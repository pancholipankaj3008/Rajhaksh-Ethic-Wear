import { useState } from "react";
import {
  Menu,
  MessageCircle,
  User,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const links = [
    ["Home", "/"],
    ["Collections", "/products"],
    ["Categories", "/categories"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  const submit = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
    } else {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    }

    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <style>{`
        .ng-nav,
        .ng-nav * {
          box-sizing: border-box;
        }

        .ng-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.96);
          color: #f5f0e9;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ng-nav::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(232, 201, 126, 0.45),
            transparent
          );
          opacity: 0.7;
        }

        .ng-nav-inner {
          min-height: 76px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        /* BRAND */

        .ng-brand {
          flex-shrink: 0;
          color: #f5f0e9;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          line-height: 1;
          min-width: 180px;
        }

        .ng-brand-main {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .ng-brand-main span {
          color: #e8c97e;
          font-style: italic;
          font-weight: 400;
        }

        .ng-brand-sub {
          margin-top: 6px;
          color: rgba(245, 240, 233, 0.38);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.27em;
          text-transform: uppercase;
        }

        /* NAV LINKS */

        .ng-nav-links {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .ng-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          height: 40px;
          padding: 0 11px;
          color: rgba(245, 240, 233, 0.58);
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          transition:
            color 0.25s ease,
            background 0.25s ease;
          border-radius: 4px;
        }

        .ng-nav-link:hover {
          color: #f5f0e9;
          background: rgba(255, 255, 255, 0.035);
        }

        .ng-nav-link.active {
          color: #e8c97e;
        }

        .ng-nav-link.active::after {
          content: "";
          position: absolute;
          left: 11px;
          right: 11px;
          bottom: 2px;
          height: 1px;
          background: #e8c97e;
        }

        /* ACTIONS */

        .ng-nav-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        /* SEARCH */

        .ng-search {
          width: 170px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 5px;
          transition:
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .ng-search:focus-within {
          border-color: rgba(232, 201, 126, 0.45);
          background: rgba(255, 255, 255, 0.06);
        }

        .ng-search-icon {
          flex-shrink: 0;
          color: rgba(245, 240, 233, 0.38);
        }

        .ng-search input {
          width: 100%;
          min-width: 0;
          padding: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #f5f0e9;
          font-family: inherit;
          font-size: 12px;
        }

        .ng-search input::placeholder {
          color: rgba(245, 240, 233, 0.3);
        }

        /* ENQUIRY */

        .ng-enquiry {
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          border: 1px solid #e8c97e;
          border-radius: 5px;
          background: #e8c97e;
          color: #0a0a0a;
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .ng-enquiry:hover {
          background: #f1d995;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232, 201, 126, 0.12);
        }

        /* ADMIN */

        .ng-admin,
        .ng-account {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          color: rgba(245, 240, 233, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 5px;
          text-decoration: none;
          transition:
            color 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .ng-admin:hover,
        .ng-account:hover {
          color: #e8c97e;
          border-color: rgba(232, 201, 126, 0.35);
          background: rgba(232, 201, 126, 0.05);
        }

        /* MOBILE MENU BUTTON */

        .ng-menu-btn {
          width: 40px;
          height: 40px;
          display: none;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          background: transparent;
          color: #f5f0e9;
          cursor: pointer;
        }

        .ng-menu-btn:hover {
          border-color: rgba(232, 201, 126, 0.35);
          color: #e8c97e;
        }

        /* MOBILE PANEL */

        .ng-mobile-panel {
          display: none;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px 24px;
        }

        .ng-mobile-search {
          height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          margin-bottom: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.04);
        }

        .ng-mobile-search svg {
          flex-shrink: 0;
          color: rgba(245, 240, 233, 0.4);
        }

        .ng-mobile-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 13px;
        }

        .ng-mobile-search input::placeholder {
          color: rgba(245, 240, 233, 0.3);
        }

        .ng-mobile-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .ng-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 5px;
          color: rgba(245, 240, 233, 0.65);
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.05em;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .ng-mobile-link svg {
          opacity: 0.3;
        }

        .ng-mobile-link:hover,
        .ng-mobile-link.active {
          color: #e8c97e;
          background: rgba(232, 201, 126, 0.05);
          border-color: rgba(232, 201, 126, 0.2);
        }

        /* TABLET */

        @media (max-width: 1120px) {
          .ng-nav-inner {
            gap: 16px;
          }

          .ng-brand {
            min-width: 155px;
          }

          .ng-brand-main {
            font-size: 22px;
          }

          .ng-nav-link {
            padding: 0 7px;
            font-size: 11px;
          }

          .ng-search {
            width: 145px;
          }
        }

        /* MOBILE */

        @media (max-width: 900px) {
          .ng-nav-inner {
            min-height: 68px;
            padding: 0 18px;
          }

          .ng-brand-main {
            font-size: 23px;
          }

          .ng-brand-sub {
            font-size: 7px;
          }

          .ng-nav-links,
          .ng-search,
          .ng-enquiry,
          .ng-admin {
            display: none;
          }

          .ng-nav-actions {
            margin-left: auto;
          }

          .ng-menu-btn {
            display: grid;
          }

          .ng-mobile-panel {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .ng-brand {
            min-width: 0;
          }

          .ng-brand-main {
            font-size: 20px;
          }

          .ng-mobile-panel {
            padding-left: 14px;
            padding-right: 14px;
          }

          .ng-mobile-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="ng-nav">
        <div className="ng-nav-inner">
          {/* BRAND */}

          <Link to="/" className="ng-brand" onClick={closeMenu}>
            <span className="ng-brand-main">
              RAJ HAKSH
            </span>

            <span className="ng-brand-sub">
              Women's Ethic Wear
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="ng-nav-links">
            {links.map(([name, path]) => (
              <NavLink
                key={`${name}-${path}`}
                to={path}
                className={({ isActive }) =>
                  `ng-nav-link ${isActive ? "active" : ""}`
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}

          <div className="ng-nav-actions">
            <form className="ng-search" onSubmit={submit}>
              <Search size={15} className="ng-search-icon" />

              <input
                aria-label="Search products"
                placeholder="Search styles..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>

            <Link to="/enquiry" className="ng-enquiry">
              <MessageCircle size={15} />
              Enquiry
            </Link>

            <Link
              to={user?.role === "admin" ? "/admin" : "/auth"}
              className="ng-account"
              aria-label={user ? "Your account" : "Sign in"}
              title={user ? "Your account" : "Sign in"}
            >
              <User size={18} />
            </Link>

            <button
              type="button"
              className="ng-menu-btn"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}

        {open && (
          <div className="ng-mobile-panel">
            <form className="ng-mobile-search" onSubmit={submit}>
              <Search size={17} />

              <input
                autoFocus
                aria-label="Search styles"
                placeholder="Search styles..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>

            <nav className="ng-mobile-links">
              {links.map(([name, path]) => (
                <NavLink
                  key={`${name}-mobile-${path}`}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `ng-mobile-link ${isActive ? "active" : ""}`
                  }
                >
                  {name}
                  <ChevronRight size={15} />
                </NavLink>
              ))}

              <Link
                to="/enquiry"
                className="ng-mobile-link"
                onClick={closeMenu}
              >
                Wholesale Enquiry
                <MessageCircle size={15} />
              </Link>

              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="ng-mobile-link"
                  onClick={closeMenu}
                >
                  Admin Panel
                  <User size={15} />
                </Link>
              ) : (
                <Link to="/auth" className="ng-mobile-link" onClick={closeMenu}>
                  {user ? "My account" : "Sign in"}
                  <User size={15} />
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
