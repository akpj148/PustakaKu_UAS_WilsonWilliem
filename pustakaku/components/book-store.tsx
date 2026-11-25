"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  stock: number;
  description: string;
};

type NewBook = Omit<Book, "id">;

type BookStoreValue = {
  books: Book[];
  ready: boolean;
  storageError: string | null;
  addBook: (book: NewBook) => Book;
};

type StoreSnapshot = {
  books: Book[];
  ready: boolean;
  storageError: string | null;
};

const STORAGE_KEY = "pustakaku.books.v1";

const demoBooks: Book[] = [
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

const serverSnapshot: StoreSnapshot = {
  books: demoBooks,
  ready: false,
  storageError: null,
};

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;
  const book = value as Record<string, unknown>;

  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.category === "string" &&
    typeof book.year === "number" &&
    typeof book.stock === "number" &&
    typeof book.description === "string"
  );
}

function isBookList(value: unknown): value is Book[] {
  return Array.isArray(value) && value.every(isBook);
}

function readInitialSnapshot(): StoreSnapshot {
  if (typeof window === "undefined") return serverSnapshot;

  try {
    const savedBooks = window.localStorage.getItem(STORAGE_KEY);
    if (savedBooks === null) {
      return { books: demoBooks, ready: true, storageError: null };
    }

    const parsedBooks: unknown = JSON.parse(savedBooks);
    if (!isBookList(parsedBooks)) {
      throw new Error("Format koleksi tersimpan tidak valid.");
    }
    return { books: parsedBooks, ready: true, storageError: null };
  } catch (error) {
    console.error("Koleksi PustakaKu tidak dapat dibaca dari penyimpanan.", error);
    return {
      books: demoBooks,
      ready: true,
      storageError:
        "Koleksi lokal tidak dapat dibaca. Data contoh ditampilkan untuk sementara.",
    };
  }
}

let snapshot = readInitialSnapshot();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function publish(nextSnapshot: StoreSnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

const BookStoreContext = createContext<BookStoreValue | null>(null);

export function BookStoreProvider({ children }: { children: ReactNode }) {
  const currentSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addBook = useCallback((newBook: NewBook) => {
    const book: Book = {
      ...newBook,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Date.now().toString(),
    };
    const nextBooks = [book, ...snapshot.books];
    let storageError: string | null = null;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks));
    } catch (error) {
      console.error("Koleksi PustakaKu tidak dapat disimpan.", error);
      storageError =
        "Perubahan belum tersimpan di perangkat ini. Periksa izin penyimpanan browser.";
    }

    publish({ books: nextBooks, ready: true, storageError });
    return book;
  }, []);

  const value = useMemo(
    () => ({
      books: currentSnapshot.books,
      ready: currentSnapshot.ready,
      storageError: currentSnapshot.storageError,
      addBook,
    }),
    [currentSnapshot, addBook],
  );

  return (
    <BookStoreContext.Provider value={value}>
      {children}
    </BookStoreContext.Provider>
  );
}

export function useBookStore() {
  const store = useContext(BookStoreContext);
  if (!store) {
    throw new Error("useBookStore harus digunakan di dalam BookStoreProvider.");
  }
  return store;
}
