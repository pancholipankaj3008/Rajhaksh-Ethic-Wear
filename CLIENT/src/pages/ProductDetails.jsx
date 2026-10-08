import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Minus, Plus, ChevronRight, ShieldCheck, Truck, Tag } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SkeletonGrid from "../components/SkeletonGrid";
import { GetRelatedProducts, GetSingleProduct } from "../features/product/productThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { addEnquiryItem } from "../utils/enquiryList";
import { whatsappEnquiryUrl } from "../utils/whatsapp";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export function ProductDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { product, relatedProducts, productLoading, error } = useAppSelector((state) => state.product);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { dispatch(GetSingleProduct(id)); }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedImage(product.images?.[0] || "");
    dispatch(GetRelatedProducts(product._id));
  }, [dispatch, product]);

  const gallery = useMemo(() => [...new Set(product?.images || [])], [product?.images]);

  if (productLoading) {
    return (
      <main className="section">
        <div className="container">
          <SkeletonGrid count={1} />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="empty-state" style={{ marginBottom: 20 }}>
            <p className="field-error" role="alert" style={{ margin: 0 }}>
              {error || "Product not found."}
            </p>
          </div>
          <Link className="btn btn-secondary" to="/products">← Back to collection</Link>
        </div>
      </main>
    );
  }

  const selection = { size: selectedSize, sku: product.sku };

  const addToEnquiry = () => {
    addEnquiryItem({
      productId: product._id,
      sku: product.sku,
      size: selectedSize,
      quantity,
      title: product.title,
      image: selectedImage || gallery[0] || "",
      wholesalePrice: product.wholesalePrice,
    });
    setAdded(true);
    setTimeout(() => navigate("/enquiry"), 500);
  };

  const whatsappUrl = whatsappEnquiryUrl({ product, variant: selection, quantity });

  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQty = () => setQuantity((q) => q + 1);

  return (
    <>
      <style>{`
        .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .pd-breadcrumb a { color: var(--muted); }
  .pd-breadcrumb a:hover { color: var(--ink); }
  .pd-breadcrumb span.current { color: var(--ink); font-weight: 600; }

  .pd-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.7fr) minmax(300px, 1.3fr);
    gap: 48px;
    align-items: start;
  }

  .pd-gallery {
    position: sticky;
    top: 90px;
    display: flex;
    gap: 12px;
  }

  .pd-main-media {
    order: 2;
    flex: 1;
    aspect-ratio: 3 / 4;
    background: var(--surface-soft);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .pd-main-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pd-thumbs {
    order: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 0;
    flex-wrap: nowrap;
    max-height: 520px;
    overflow-y: auto;
  }

  .pd-thumb {
    padding: 0;
    border-radius: 6px;
    overflow: hidden;
    background: none;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 150ms ease;
    flex: none;
  }

  .pd-thumb.active { border-color: var(--ink); }
  .pd-thumb:not(.active) { border-color: var(--line); }

  .pd-thumb img {
    width: 62px;
    height: 78px;
    object-fit: cover;
    display: block;
  }

  .pd-info-head {
    margin-bottom: 18px;
  }

  .pd-info-head h1 {
    margin: 8px 0 4px;
  }

  .pd-sku {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.04em;
  }

  .pd-price {
    font-family: "Cormorant Garamond", serif;
    font-size: 34px;
    font-weight: 600;
    margin: 16px 0 4px;
  }

  .pd-price-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  .pd-desc {
    color: var(--muted);
    line-height: 1.8;
    font-size: 14px;
    margin: 18px 0;
    padding-top: 18px;
    border-top: 1px solid var(--line);
  }

  .pd-section-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 10px;
  }

  .pd-sizes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 22px;
  }

  .pd-size-pill {
    min-width: 46px;
    height: 42px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--line-dark);
    background: #fff;
    color: var(--ink);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 150ms ease, background 150ms ease, color 150ms ease;
  }

  .pd-size-pill.active {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }

  .pd-qty-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .pd-qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line-dark);
    border-radius: 6px;
    overflow: hidden;
  }

  .pd-qty button {
    width: 40px;
    height: 42px;
    border: none;
    background: var(--surface-soft);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: var(--ink);
  }

  .pd-qty button:hover { background: var(--line); }

  .pd-qty input {
    width: 52px;
    height: 42px;
    border: none;
    border-left: 1px solid var(--line-dark);
    border-right: 1px solid var(--line-dark);
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    -moz-appearance: textfield;
  }

  .pd-qty input::-webkit-outer-spin-button,
  .pd-qty input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .pd-ctas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .pd-ctas .btn {
    flex: 1;
    min-width: 180px;
  }

  .pd-trust {
    display: grid;
    gap: 12px;
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid var(--line);
  }

  .pd-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12.5px;
    color: var(--ink-soft);
  }

  .pd-related {
    margin-top: 72px;
  }

  .pd-related-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  .pd-back {
    margin-top: 40px;
    display: inline-flex;
  }

  .pd-mobile-cta {
    display: none;
  }

  @media (max-width: 900px) {
    .pd-layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .pd-gallery {
      position: static;
    }

    .pd-price { font-size: 28px; }
  }

  @media (max-width: 640px) {
    .pd-main-media {
      aspect-ratio: 4 / 5;
      border-radius: 0;
      margin: 0 -14px;
      width: calc(100% + 28px);
    }

    .pd-gallery {
      flex-direction: column;
    }

    .pd-main-media {
      order: 1;
    }

    .pd-thumbs {
      order: 2;
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: visible;
      max-height: none;
      margin-top: 10px;
      padding-bottom: 4px;
    }

    .pd-ctas {
      display: none;
    }

    .pd-mobile-cta {
      display: flex;
      gap: 10px;
      position: sticky;
      bottom: 0;
      background: #fff;
      border-top: 1px solid var(--line);
      padding: 12px 14px calc(12px + env(safe-area-inset-bottom, 0px));
      margin: 20px -14px 0;
    }

    .pd-mobile-cta .btn {
      flex: 1;
    }

    .pd-related {
      margin-top: 48px;
    }
  }
      `}</style>

      <main className="section" style={{ paddingBottom: 40 }}>
        <div className="container">
          <nav className="pd-breadcrumb">
            <Link to="/products">Collection</Link>
            <ChevronRight size={12} />
            {product.category && (
              <>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
                <ChevronRight size={12} />
              </>
            )}
            <span className="current">{product.title}</span>
          </nav>

          <div className="pd-layout">
            {/* GALLERY */}
            <section className="pd-gallery">
              <div className="pd-main-media">
                {selectedImage && <img src={selectedImage} alt={product.title} />}
              </div>

              {gallery.length > 1 && (
                <div className="pd-thumbs">
                  {gallery.map((image) => (
                    <button
                      key={image}
                      type="button"
                      className={`pd-thumb ${selectedImage === image ? "active" : ""}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image} alt={`${product.title} view`} />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* INFO */}
            <section>
              <div className="pd-info-head">
                <span className="eyebrow">{product.category}</span>
                <h1 className="title">{product.title}</h1>
                <span className="pd-sku">SKU: {product.sku}</span>
              </div>

              <div>
                <div className="pd-price-label">Wholesale price</div>
                <div className="pd-price">{money(product.wholesalePrice)}</div>
              </div>

              {product.description && <p className="pd-desc">{product.description}</p>}

              {product.sizes?.length > 0 && (
                <div>
                  <div className="pd-section-label">Select size</div>
                  <div className="pd-sizes">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`pd-size-pill ${selectedSize === size ? "active" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="pd-section-label">Quantity</div>
                <div className="pd-qty-row">
                  <div className="pd-qty">
                    <button type="button" onClick={decrementQty} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    />
                    <button type="button" onClick={incrementQty} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pd-ctas">
                <button className="btn btn-primary" onClick={addToEnquiry}>
                  {added ? "Added ✓" : "Add to Enquiry"}
                </button>
                {whatsappUrl && (
                  <a className="btn btn-secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} /> WhatsApp Enquiry
                  </a>
                )}
              </div>

              <div className="pd-trust">
                <div className="pd-trust-item"><Tag size={15} /> Wholesale pricing for bulk orders</div>
                <div className="pd-trust-item"><ShieldCheck size={15} /> Curated quality, checked before dispatch</div>
                <div className="pd-trust-item"><Truck size={15} /> Pan-India shipping for retailers</div>
              </div>
            </section>
          </div>

          {relatedProducts.length > 0 && (
            <section className="pd-related">
              <div className="pd-related-head">
                <h2 className="title" style={{ fontSize: 28 }}>You may also like</h2>
                <Link to="/products" className="btn btn-secondary">View all</Link>
              </div>
              <div className="grid grid-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          )}

          <Link className="btn btn-secondary pd-back" to="/products">← Back to collection</Link>
        </div>

        {/* Mobile sticky CTA */}
        <div className="pd-mobile-cta">
          <button className="btn btn-primary" onClick={addToEnquiry}>
            {added ? "Added ✓" : "Add to Enquiry"}
          </button>
          {whatsappUrl && (
            <a className="btn btn-secondary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={16} />
            </a>
          )}
        </div>
      </main>
    </>
  );
}