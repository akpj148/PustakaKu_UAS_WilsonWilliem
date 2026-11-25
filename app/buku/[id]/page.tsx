import { Suspense } from "react";
import BookDetail from "../../../components/book-detail";

async function BookDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookDetail id={id} />;
}

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="detail-loading" role="status">
          <span className="loading-spinner" />
          Memuat detail buku…
        </div>
      }
    >
      <BookDetailContent params={params} />
    </Suspense>
  );
}