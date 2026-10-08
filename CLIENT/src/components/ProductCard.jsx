import { Link } from "react-router-dom";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function ProductCard({ product }) {
  const image = product.images?.[0] || "";
  const sizes = product.sizes || [];
  return <article className="product-card"><Link to={`/product/${product._id}`} style={{ color: "inherit" }}><div className="product-media">{image ? <img src={image} alt={product.title} loading="lazy" /> : <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 10 }}>No image</div>}{product.category && <span style={{ position: "absolute", top: 5, left: 5, background: "rgba(255,255,255,0.92)", color: "var(--ink)", fontSize: 7, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 999 }}>{product.category}</span>}</div><div className="product-body"><h3 className="product-name">{product.title}</h3><span className="product-meta">{sizes.length ? sizes.join(" · ") : "\u00A0"}</span><div className="price">{formatCurrency(product.wholesalePrice)}</div></div></Link></article>;
}
