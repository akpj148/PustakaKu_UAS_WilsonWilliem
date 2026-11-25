import type { Prisma } from "../generated/prisma/client";

export const bookSelect = {
  id: true,
  title: true,
  author: true,
  year: true,
  stock: true,
  description: true,
  category: { select: { name: true } },
} satisfies Prisma.BookSelect;

export type SelectedBook = Prisma.BookGetPayload<{
  select: typeof bookSelect;
}>;

export function toApiBook(book: SelectedBook) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category.name,
    year: book.year,
    stock: book.stock,
    description: book.description,
  };
}
