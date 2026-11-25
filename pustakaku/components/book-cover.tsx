export default function BookCover({ id }: { id: string }) {
  return (
    <div className="detail-cover" aria-label={`Placeholder gambar buku ID ${id}`}>
      <div className="cover-inner">
        <span className="cover-mark" aria-hidden="true">P</span>
        <span className="cover-rule" aria-hidden="true" />
        <span className="cover-label">Gambar Buku</span>
        <strong>ID {id}</strong>
      </div>
    </div>
  );
}
