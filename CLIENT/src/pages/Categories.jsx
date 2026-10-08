import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import API from "../api/axios";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/categories")
      .then((response) => setCategories(response.data.categories || []))
      .catch((requestError) =>
        (() => {
          const message = requestError.response?.data?.message || "Unable to load categories.";
          setError(message);
          toast.error(message);
        })()
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(term));
  }, [categories, search]);

  const featured = categories.slice(0, 6);

  return (
    <>
      <style>{`
        .cat-banner {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 8px;
}

.cat-banner-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      110deg,
      rgba(10,10,10,0.82) 10%,
      rgba(10,10,10,0.45) 55%,
      rgba(10,10,10,0.15) 100%
    ),
    url("https://images.unsplash.com/photo-1503160865267-af4660ce7bf2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
      center 10% / cover;
}

.cat-banner-content {
  position: relative;
  padding: 60px 64px;
  max-width: 650px;
}

.cat-banner-title {
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(34px, 4.5vw, 56px);
  font-weight: 600;
  line-height: 1.05;
  margin: 0 0 16px;
}

.cat-banner-sub {
  font-size: 14px;
  line-height: 1.75;
  color: rgba(255,255,255,0.82);
  margin: 0 0 28px;
  max-width: 500px;
}

        .cat-banner-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cat-banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 180ms ease, opacity 180ms ease, background 180ms ease, color 180ms ease;
        }

        .cat-banner-btn-primary {
          background: var(--gold);
          color: #1a1509;
        }

        .cat-banner-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .cat-banner-btn-outline {
          border: 1px solid rgba(255,255,255,0.5);
          color: #fff;
        }

        .cat-banner-btn-outline:hover {
          background: #fff;
          color: var(--ink);
          transform: translateY(-2px);
        }

        .cat-hero {
          text-align: center;
          margin-top: 48px;
        }

        .cat-hero .subtitle {
          margin: 10px auto 0;
        }

        .cat-hero-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .cat-search {
          position: relative;
          max-width: 360px;
          margin: 26px auto 0;
        }

        .cat-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }

        .cat-search input {
          padding-left: 40px;
        }

        .cat-featured-strip {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 22px 2px 8px;
          margin-bottom: 6px;
        }

        .cat-featured-chip {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--line-dark);
          background: #fff;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-soft);
          white-space: nowrap;
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
        }

        .cat-featured-chip:hover {
          background: var(--ink);
          border-color: var(--ink);
          color: #fff;
        }

        .category-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 30px 22px;
          margin-top: 30px;
        }

        .category-link {
          text-align: center;
          color: inherit;
          text-decoration: none;
          display: block;
        }

        .category-image {
          position: relative;
          width: min(100%, 150px);
          aspect-ratio: 1;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 12px;
          background: var(--surface-soft);
          border: 2px solid var(--line);
          transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
          box-shadow: 0 8px 22px rgba(0,0,0,0.08);
        }

        .category-link:hover .category-image {
          transform: translateY(-5px);
          border-color: var(--gold);
          box-shadow: 0 14px 30px rgba(0,0,0,0.14);
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-ring {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, var(--gold), transparent 60%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .category-link:hover .category-ring {
          opacity: 1;
        }

        .category-name {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
        }

        .category-count {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: var(--muted);
          font-weight: 500;
        }

        .category-link:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 5px;
          border-radius: 50%;
        }

        .cat-empty-search {
          text-align: center;
          color: var(--muted);
          margin-top: 40px;
        }

        @media (max-width: 640px) {
          .cat-banner {
            min-height: 220px;
          }

          .cat-banner-content {
            padding: 28px 22px;
          }

          .cat-banner-sub {
            font-size: 12.5px;
          }

          .cat-hero {
            margin-top: 36px;
          }

          .category-list {
            grid-template-columns: repeat(3, 1fr);
            gap: 22px 12px;
          }

          .category-image {
            width: 100%;
            max-width: 96px;
          }

          .category-name {
            font-size: 12px;
          }

          .category-count {
            font-size: 10px;
          }
        }
      `}</style>

      <main className="section">
        <div className="container">
          {/* PROMO BANNER */}
          <div className="cat-banner">
            <div className="cat-banner-bg" />
            <div className="cat-banner-content">
              <span className="cat-banner-eyebrow">
                <Sparkles size={12} /> New Arrivals Every Week
              </span>
              <h2 className="cat-banner-title">
                Curated styles for your <em>wholesale</em> business
              </h2>
              <p className="cat-banner-sub">
                Browse every category, pick your styles and send us an enquiry —
                our team will help with sizing, quantity and pricing.
              </p>
              <div className="cat-banner-actions">
                <Link className="cat-banner-btn cat-banner-btn-primary" to="/products">
                  Explore Collection <ArrowRight size={14} />
                </Link>
                <Link className="cat-banner-btn cat-banner-btn-outline" to="/contact">
                  <MessageCircle size={14} /> Talk to Us
                </Link>
              </div>
            </div>
          </div>

          <div className="cat-hero">
            <span className="eyebrow">Women's wear</span>
            <h1 className="title">Shop by Category</h1>
            <p className="subtitle" style={{ marginLeft: "auto", marginRight: "auto" }}>
              Choose a category to see every matching style, curated for wholesale buyers.
            </p>
            {!loading && categories.length > 0 && (
              <div className="cat-hero-count">
                <Sparkles size={13} /> {categories.length} categories available
              </div>
            )}

            <div className="cat-search">
              <Search size={16} />
              <input
                className="input"
                placeholder="Search a category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {!loading && featured.length > 3 && (
            <div className="cat-featured-strip">
              {featured.map((category) => (
                <Link
                  key={category._id}
                  className="cat-featured-chip"
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  {category.name}
                </Link>
              ))}
              <Link className="cat-featured-chip" to="/products">
                View All
              </Link>
            </div>
          )}

          {loading && (
            <div className="category-list">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <div className="category-image skeleton" />
                  <div className="skeleton" style={{ width: "70%", height: 14, margin: "auto" }} />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && (
            <>
              {categories.length ? (
                filtered.length ? (
                  <div className="category-list">
                    {filtered.map((category) => (
                      <Link
                        key={category._id}
                        className="category-link"
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        aria-label={`View ${category.name} products`}
                      >
                        <div className="category-image">
                          <span className="category-ring" />
                          {category.image ? (
                            <img src={category.image} alt={category.name} loading="lazy" />
                          ) : (
                            <span
                              style={{
                                display: "grid",
                                height: "100%",
                                placeItems: "center",
                                color: "var(--muted)",
                                fontSize: 11,
                              }}
                            >
                              No image
                            </span>
                          )}
                        </div>
                        <h2 className="category-name">{category.name}</h2>
                        {typeof category.productCount === "number" && (
                          <span className="category-count">{category.productCount} styles</span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="cat-empty-search">No categories match "{search}".</p>
                )
              ) : (
                <p style={{ textAlign: "center", marginTop: 40 }}>
                  Categories are being curated. Browse the full collection in the meantime.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
