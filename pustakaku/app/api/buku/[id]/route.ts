import { bookSelect, toApiBook } from "../../../../lib/books";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      select: bookSelect,
    });
    if (!book) {
      return Response.json(
        { error: "Buku tidak ditemukan." },
        { status: 404 },
      );
    }
    return Response.json(toApiBook(book));
  } catch (error) {
    console.error(`GET /api/buku/${id} gagal memuat buku.`, error);
    return Response.json(
      { error: "Detail buku gagal dimuat." },
      { status: 500 },
    );
  }
}
