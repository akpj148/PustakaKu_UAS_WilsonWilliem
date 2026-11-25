export default function StockBadge({ stock }: { stock: number }) {
  const available = stock > 0;

  return (
    <span className={`stock-badge ${available ? "stock-available" : "stock-empty"}`}>
      <span className="stock-dot" aria-hidden="true" />
      {available ? `Tersedia · ${stock}` : "Habis · 0"}
    </span>
  );
}
