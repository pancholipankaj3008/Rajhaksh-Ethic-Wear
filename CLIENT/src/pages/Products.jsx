import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import SkeletonGrid from "../components/SkeletonGrid";
import { GetAllProducts } from "../features/product/productThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

const fields = ["search", "category", "size", "sort"];
const filtersFromParams = (params) => ({
  search: params.get("search") || "",
  category: params.get("category") || "",
  size: params.get("size") || "",
  sort: params.get("sort") || "newest",
});

const SORT_LABELS = {
  newest: "Newest",
  lowToHigh: "Price: low to high",
  highToLow: "Price: high to low",
};

const SIZES = ["Free Size", "S", "M", "L", "XL", "XXL"];
const PAGE_SIZE = 28;

export function Products() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const { products, loading, error, totalProducts, totalPages, currentPage } = useAppSelector((state) => state.product);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(() => filtersFromParams(params));
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    API.get("/categories")
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const request = { ...filters, page: params.get("page") || 1, limit: PAGE_SIZE };
    dispatch(GetAllProducts(Object.fromEntries(Object.entries(request).filter(([, value]) => value !== ""))));
  }, [dispatch, filters, params]);

  const updateFilter = (field, value) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    setParams(Object.fromEntries(fields.map((key) => [key, next[key]]).filter(([, value]) => value)));
  };

  const clearFilter = (field) => updateFilter(field, field === "sort" ? "newest" : "");

  const clearAll = () => {
    const next = { search: "", category: "", size: "", sort: "newest" };
    setFilters(next);
    setParams({});
  };

  const changePage = (page) => setParams({ ...Object.fromEntries(params), page });

  const activeChips = fields
    .filter((field) => filters[field] && !(field === "sort" && filters[field] === "newest"))
    .map((field) => ({ field, label: field === "sort" ? SORT_LABELS[filters[field]] : filters[field] }));

  // Small page-number window around the current page, so pagination stays
  // compact even when there are many pages.
  const pageWindow = (() => {
    if (totalPages <= 1) return [];
    const span = 1;
    const start = Math.max(1, currentPage - span);
    const end = Math.min(totalPages, currentPage + span);
    const nums = [];
    for (let p = start; p <= end; p++) nums.push(p);
    return nums;
  })();

  return (
    <>
      <style>{`
        .pl-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 4px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
        }

        .pl-head .eyebrow {
          letter-spacing: 0.14em;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--muted);
        }

        .pl-head .title {
          margin-top: 6px;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.05;
        }

        .pl-count {
          color: var(--muted);
          font-size: 13.5px;
          font-style: italic;
          padding-bottom: 4px;
        }

        .pl-toolbar {
          position: sticky;
          top: 12px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin: 26px 0 16px;
          padding: 12px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: 0 6px 20px -14px rgba(0, 0, 0, 0.35);
        }

        .pl-search {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .pl-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
        }

        .pl-search input {
          padding-left: 40px;
          border-color: transparent;
          background: var(--surface-soft);
        }

        .pl-search input:focus {
          border-color: var(--line-dark);
          background: var(--surface);
        }

        .pl-divider {
          width: 1px;
          align-self: stretch;
          background: var(--line);
          margin: 2px 2px;
        }

        .pl-field {
          position: relative;
          min-width: 168px;
        }

        .pl-field select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 34px;
          background: var(--surface-soft);
          border-color: transparent;
          cursor: pointer;
        }

        .pl-field select:focus {
          border-color: var(--line-dark);
          background: var(--surface);
        }

        .pl-field .chev {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }

        .pl-field input[type="text"] {
          background: var(--surface-soft);
          border-color: transparent;
        }

        .pl-field input[type="text"]:focus {
          border-color: var(--line-dark);
          background: var(--surface);
        }

        .pl-filter-toggle {
          display: none;
          position: relative;
        }

        .pl-filter-badge {
          display: inline-grid;
          place-items: center;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--surface);
          font-size: 10.5px;
          font-weight: 700;
        }

        .pl-search input:focus-visible,
        .pl-field select:focus-visible,
        .pl-page-num:focus-visible,
        .pl-chip button:focus-visible {
          outline: 2px solid var(--line-dark);
          outline-offset: 2px;
        }

        .pl-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin: 0 0 26px;
        }

        .pl-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 8px 6px 13px;
          border-radius: 999px;
          background: var(--surface-soft);
          border: 1px solid var(--line);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-soft);
        }

        .pl-chip button {
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: none;
          background: var(--line-dark);
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .pl-chip button:hover {
          transform: scale(1.12);
        }

        .pl-chip-clear {
          border: none;
          background: none;
          color: var(--muted);
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
          padding: 6px 2px;
        }

        .pl-empty {
          padding: 70px 24px;
          text-align: center;
          background: var(--surface);
          border: 1px dashed var(--line-dark);
          border-radius: var(--radius);
        }

        .pl-empty svg {
          color: var(--muted);
          margin-bottom: 14px;
        }

        .pl-grid-fade {
          animation: plFadeIn 0.35s ease both;
        }

        @keyframes plFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pl-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 48px;
        }

        .pl-page-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          padding: 0;
        }

        .pl-page-num {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ink-soft);
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .pl-page-num:hover {
          border-color: var(--line);
        }

        .pl-page-num.active {
          background: var(--ink);
          color: var(--surface);
        }

        .pl-page-gap {
          color: var(--muted);
          font-size: 13px;
          padding: 0 2px;
        }

        @media (max-width: 960px) {
          .pl-field {
            min-width: 148px;
          }
        }

        @media (max-width: 720px) {
          .pl-head {
            padding-bottom: 16px;
          }

          .pl-toolbar {
            position: static;
            padding: 10px;
          }

          .pl-filter-toggle {
            display: inline-flex;
          }

          .pl-filter-fields {
            display: grid !important;
            width: 100%;
            grid-template-columns: 1fr 1fr;
            gap: 0 10px;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.25s ease, opacity 0.2s ease, margin-top 0.25s ease;
            margin-top: 0;
          }

          .pl-filter-fields.open {
            max-height: 200px;
            opacity: 1;
            margin-top: 10px;
          }

          .pl-filter-fields .pl-field {
            min-width: 0;
            margin-top: 10px;
          }

          .pl-divider {
            display: none;
          }

          .pl-search {
            width: 100%;
          }

          .pl-pagination {
            gap: 4px;
          }
        }

        @media (max-width: 560px) {
  .container .grid.grid-4.pl-grid-fade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
        @media (max-width: 480px) {
          .pl-filter-fields.open {
            grid-template-columns: 1fr;
          }

          .pl-filter-fields.open .pl-field {
            margin-top: 10px;
          }

          .pl-count {
            display: none;
          }
        }

        @media (max-width: 380px) {
  .container .grid.grid-4.pl-grid-fade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
      `}</style>

      <main className="section">
        <div className="container">
          <div className="pl-head">
            <div>
              <span className="eyebrow">WOMEN'S WHOLESALE</span>
              <h1 className="title">The Collection</h1>
            </div>
            {!loading && products.length > 0 && (
              <span className="pl-count">Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{((currentPage - 1) * PAGE_SIZE) + products.length} of {totalProducts} styles</span>
            )}
          </div>

          <div className="pl-toolbar">
            <div className="pl-search">
              <Search size={16} />
              <input
                className="input"
                placeholder="Search products"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-soft pl-filter-toggle"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={15} /> Filters
              {activeChips.length > 0 && <span className="pl-filter-badge">{activeChips.length}</span>}
            </button>

            <span className="pl-divider" />

            <div className={`pl-filter-fields ${filtersOpen ? "open" : ""}`} style={{ display: "contents" }}>
              <div className="pl-field">
                <select
                  className="select"
                  value={filters.category}
                  onChange={(event) => updateFilter("category", event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="chev" />
              </div>

              <div className="pl-field" style={{ minWidth: 130 }}>
                <select
                  className="select"
                  value={filters.size}
                  onChange={(event) => updateFilter("size", event.target.value)}
                >
                  <option value="">All sizes</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="chev" />
              </div>

              <div className="pl-field">
                <select
                  className="select"
                  value={filters.sort}
                  onChange={(event) => updateFilter("sort", event.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="lowToHigh">Price: low to high</option>
                  <option value="highToLow">Price: high to low</option>
                </select>
                <ChevronDown size={14} className="chev" />
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="pl-chips">
              {activeChips.map(({ field, label }) => (
                <span className="pl-chip" key={field}>
                  {label}
                  <button type="button" onClick={() => clearFilter(field)} aria-label={`Remove ${label} filter`}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button type="button" className="pl-chip-clear" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-4 pl-grid-fade">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && !products.length && (
            <div className="pl-empty">
              <Search size={30} />
              <p style={{ margin: 0, fontWeight: 600 }}>No products match these filters.</p>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 13 }}>
                Try adjusting or clearing your filters.
              </p>
              <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pl-pagination">
              <button
                type="button"
                className="btn btn-secondary pl-page-btn"
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {pageWindow[0] > 1 && (
                <>
                  <button type="button" className="pl-page-num" onClick={() => changePage(1)}>1</button>
                  {pageWindow[0] > 2 && <span className="pl-page-gap">···</span>}
                </>
              )}

              {pageWindow.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`pl-page-num ${page === currentPage ? "active" : ""}`}
                  onClick={() => changePage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              {pageWindow[pageWindow.length - 1] < totalPages && (
                <>
                  {pageWindow[pageWindow.length - 1] < totalPages - 1 && <span className="pl-page-gap">···</span>}
                  <button type="button" className="pl-page-num" onClick={() => changePage(totalPages)}>{totalPages}</button>
                </>
              )}

              <button
                type="button"
                className="btn btn-secondary pl-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => changePage(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
