export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-4">
      {Array.from({ length: count }).map((_, index) => (
        <div className="card" key={index} style={{ overflow: "hidden" }}>
          <div className="skeleton" style={{ aspectRatio: "4 / 5" }} />
          <div style={{ padding: 16 }}>
            <div className="skeleton" style={{ height: 22, width: "70%", borderRadius: 6, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: "45%", borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
