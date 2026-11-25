import { findBook } from "../../../../lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const book = findBook(id);
    if (!book) {
      return Response.json(
        { error: "Buku tidak ditemukan." },
        { status: 404 },
      );
    }
    return Response.json(book);
  } catch (error) {
    console.error(`GET /api/buku/${id} gagal memuat buku.`, error);
    return Response.json(
      { error: "Detail buku gagal dimuat." },
      { status: 500 },
    );
  }
}
