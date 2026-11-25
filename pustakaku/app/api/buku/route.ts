import { insertBook, listBooks, type NewBook } from "../../../lib/db";

type FieldErrors = Record<string, string>;

function validateBook(value: unknown): {
  book?: NewBook;
  errors?: FieldErrors;
} {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { errors: { form: "Data buku harus berupa objek JSON." } };
  }

  const input = value as Record<string, unknown>;
  const errors: FieldErrors = {};
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const author = typeof input.author === "string" ? input.author.trim() : "";
  const category =
    typeof input.category === "string" ? input.category.trim() : "";
  const description =
    input.description === undefined
      ? ""
      : typeof input.description === "string"
        ? input.description.trim()
        : null;
  const year = input.year;
  const stock = input.stock;
  const currentYear = new Date().getFullYear();

  if (!title) errors.title = "Judul buku wajib diisi.";
  else if (title.length > 200) errors.title = "Judul maksimal 200 karakter.";

  if (!author) errors.author = "Penulis wajib diisi.";
  else if (author.length > 120) errors.author = "Penulis maksimal 120 karakter.";

  if (!category) errors.category = "Kategori wajib diisi.";
  else if (category.length > 80) {
    errors.category = "Kategori maksimal 80 karakter.";
  }

  if (typeof year !== "number" || !Number.isInteger(year)) {
    errors.year = "Tahun terbit harus berupa bilangan bulat.";
  } else if (year < 1450 || year > currentYear) {
    errors.year = `Tahun terbit harus antara 1450 dan ${currentYear}.`;
  }

  if (typeof stock !== "number" || !Number.isSafeInteger(stock) || stock < 0) {
    errors.stock = "Stok harus berupa bilangan bulat minimal 0.";
  }

  if (description === null) {
    errors.description = "Deskripsi harus berupa teks.";
  } else if (description.length > 5000) {
    errors.description = "Deskripsi maksimal 5000 karakter.";
  }

  if (Object.keys(errors).length > 0) return { errors };
  if (
    typeof year !== "number" ||
    typeof stock !== "number" ||
    description === null
  ) {
    return { errors: { form: "Data buku tidak valid." } };
  }

  return {
    book: { title, author, category, year, stock, description },
  };
}

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).searchParams.get("search") ?? "";
    return Response.json(listBooks(search.slice(0, 100)));
  } catch (error) {
    console.error("GET /api/buku gagal memuat koleksi.", error);
    return Response.json(
      { error: "Koleksi buku gagal dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Body harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const validation = validateBook(payload);
  if (!validation.book) {
    return Response.json(
      {
        error: "Periksa kembali informasi buku.",
        fields: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const book = insertBook(validation.book);
    return Response.json(book, { status: 201 });
  } catch (error) {
    console.error("POST /api/buku gagal menyimpan buku.", error);
    return Response.json(
      { error: "Buku gagal disimpan ke database." },
      { status: 500 },
    );
  }
}
