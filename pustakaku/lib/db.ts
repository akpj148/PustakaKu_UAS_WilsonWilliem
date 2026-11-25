import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  stock: number;
  description: string;
};

export type NewBook = Omit<Book, "id">;

type SqlValue = string | number | bigint | Uint8Array | null;

type DatabaseGlobal = typeof globalThis & {
  pustakaKuDatabase?: DatabaseSync;
};

const demoBooks: Array<NewBook & { id: string }> = [
  {
    id: "1001",
    title: "Laut yang Menyimpan Cerita",
    author: "Nara Adiwijaya",
    category: "Fiksi",
    year: 2022,
    stock: 4,
    description:
      "Di sebuah kota pesisir, seorang penjaga mercusuar menemukan catatan-catatan lama yang mengubah cara pandangnya tentang rumah, kehilangan, dan keberanian untuk memulai lagi.",
  },
  {
    id: "1002",
    title: "Kebun Kecil di Ujung Kota",
    author: "Mira Sekar",
    category: "Pengembangan Diri",
    year: 2021,
    stock: 2,
    description:
      "Kisah dan refleksi sederhana tentang membangun kebiasaan baik, merawat hubungan, dan menemukan ruang untuk bertumbuh di tengah kesibukan sehari-hari.",
  },
  {
    id: "1003",
    title: "Atlas Bintang Nusantara",
    author: "Raka Pradipta",
    category: "Sains",
    year: 2024,
    stock: 0,
    description:
      "Pengantar populer untuk mengenal langit malam, rasi bintang, dan cara masyarakat kepulauan memaknai alam semesta dari generasi ke generasi.",
  },
  {
    id: "1004",
    title: "Jejak di Kota Lama",
    author: "Dian Puspita",
    category: "Sejarah",
    year: 2019,
    stock: 6,
    description:
      "Catatan perjalanan menyusuri bangunan, arsip, dan kisah warga yang membentuk wajah sebuah kota dari masa ke masa.",
  },
  {
    id: "1005",
    title: "Ruang untuk Pulang",
    author: "Bima Aksara",
    category: "Fiksi",
    year: 2023,
    stock: 1,
    description:
      "Dua sahabat lama bertemu kembali dan belajar bahwa pulang bukan selalu tentang tempat, tetapi juga tentang orang-orang yang bersedia mendengarkan.",
  },
];

function openDatabase() {
  const dataDirectory = path.join(process.cwd(), "data");
  mkdirSync(dataDirectory, { recursive: true });

  const database = new DatabaseSync(path.join(dataDirectory, "pustakaku.db"));
  database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  database.exec(
    readFileSync(
      path.join(process.cwd(), "database", "schema.sql"),
      "utf8",
    ),
  );
  seedDemoBooks(database);
  return database;
}

function getOrCreateCategory(database: DatabaseSync, name: string) {
  database
    .prepare("INSERT INTO categories (name) VALUES (?) ON CONFLICT(name) DO NOTHING")
    .run(name);
  const row = database
    .prepare("SELECT id FROM categories WHERE name = ?")
    .get(name);

  if (!row || typeof row.id !== "number") {
    throw new Error(`Kategori "${name}" tidak dapat dibuat.`);
  }
  return row.id;
}

function seedDemoBooks(database: DatabaseSync) {
  const count = database.prepare("SELECT COUNT(*) AS count FROM books").get();
  if (count && typeof count.count === "number" && count.count > 0) return;

  database.exec("BEGIN IMMEDIATE");
  try {
    const insertBook = database.prepare(
      `INSERT INTO books
        (id, title, author, category_id, year, stock, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );

    for (const book of demoBooks) {
      const categoryId = getOrCreateCategory(database, book.category);
      insertBook.run(
        book.id,
        book.title,
        book.author,
        categoryId,
        book.year,
        book.stock,
        book.description,
      );
    }

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

const globalDatabase = globalThis as DatabaseGlobal;
export const database =
  globalDatabase.pustakaKuDatabase ?? openDatabase();
globalDatabase.pustakaKuDatabase = database;

const bookSelect = `SELECT
  books.id AS id,
  books.title AS title,
  books.author AS author,
  categories.name AS category,
  books.year AS year,
  books.stock AS stock,
  books.description AS description
FROM books
JOIN categories ON categories.id = books.category_id`;

function toBook(row: Record<string, SqlValue>): Book {
  return {
    id: String(row.id),
    title: String(row.title),
    author: String(row.author),
    category: String(row.category),
    year: Number(row.year),
    stock: Number(row.stock),
    description: String(row.description),
  };
}

export function listBooks(search = ""): Book[] {
  const normalizedSearch = search.trim();
  const rows = normalizedSearch
    ? database
        .prepare(
          `${bookSelect}
           WHERE books.title LIKE ? COLLATE NOCASE
             OR books.author LIKE ? COLLATE NOCASE
             OR categories.name LIKE ? COLLATE NOCASE
           ORDER BY books.created_at DESC, books.title COLLATE NOCASE`,
        )
        .all(
          `%${normalizedSearch}%`,
          `%${normalizedSearch}%`,
          `%${normalizedSearch}%`,
        )
    : database
        .prepare(
          `${bookSelect}
           ORDER BY books.created_at DESC, books.title COLLATE NOCASE`,
        )
        .all();

  return rows.map(toBook);
}

export function findBook(id: string): Book | null {
  const row = database
    .prepare(`${bookSelect} WHERE books.id = ?`)
    .get(id);
  return row ? toBook(row) : null;
}

export function insertBook(book: NewBook): Book {
  const id = randomUUID();
  database.exec("BEGIN IMMEDIATE");
  try {
    const categoryId = getOrCreateCategory(database, book.category);
    database
      .prepare(
        `INSERT INTO books
          (id, title, author, category_id, year, stock, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        book.title,
        book.author,
        categoryId,
        book.year,
        book.stock,
        book.description,
      );
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }

  const createdBook = findBook(id);
  if (!createdBook) {
    throw new Error("Buku berhasil ditulis tetapi tidak dapat dibaca kembali.");
  }
  return createdBook;
}
