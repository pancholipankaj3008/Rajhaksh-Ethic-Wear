import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const collectionLinks = [
    ["All Collection", "/products"],
    ["Categories", "/categories"],
    ["New Arrivals", "/products"],
  ];

  const businessLinks = [
    ["Enquiry List", "/enquiry"],
    ["Contact Us", "/contact"],
    ["About Us", "/about"],
  ];

  return (
    <>
      <style>{`
        .ng-footer,
        .ng-footer * {
          box-sizing: border-box;
        }

        .ng-footer {
          position: relative;
          overflow: hidden;
          background: #0a0908;
          color: #f5f0e9;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-family: "Jost", "DM Sans", Arial, sans-serif;
        }

        .ng-footer::before {
          content: "";
          position: absolute;
          top: -180px;
          left: -120px;
          width: 520px;
          height: 420px;
          background: radial-gradient(
            circle,
            rgba(232,201,126,0.10) 0%,
            rgba(232,201,126,0.035) 38%,
            transparent 72%
          );
          pointer-events: none;
        }

        .ng-footer::after {
          content: "";
          position: absolute;
          right: -180px;
          bottom: -220px;
          width: 600px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(232,201,126,0.055) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .ng-footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 78px 32px 28px;
        }

        /* TOP */

        .ng-footer-top {
          display: grid;
          grid-template-columns: minmax(280px, 1.2fr) minmax(420px, 1fr);
          gap: 80px;
          padding-bottom: 64px;
        }

        /* BRAND */

        .ng-footer-brand {
          max-width: 520px;
        }

        .ng-footer-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: #e8c97e;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .ng-footer-kicker::before {
          content: "";
          width: 28px;
          height: 1px;
          background: #e8c97e;
        }

        .ng-footer-logo {
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(52px, 7vw, 92px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.045em;
        }

        .ng-footer-logo span {
          color: #e8c97e;
          font-style: italic;
          font-weight: 400;
        }

        .ng-footer-description {
          max-width: 430px;
          margin: 28px 0 0;
          color: rgba(245,240,233,0.52);
          font-size: 14px;
          font-weight: 300;
          line-height: 1.9;
        }

        .ng-footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 28px;
          padding: 13px 18px;
          border: 1px solid rgba(232,201,126,0.38);
          border-radius: 4px;
          color: #e8c97e;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .ng-footer-cta:hover {
          background: #e8c97e;
          color: #0a0908;
          transform: translateY(-2px);
        }

        /* LINKS */

        .ng-footer-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 45px;
          align-content: start;
        }

        .ng-footer-column-title {
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          color: rgba(245,240,233,0.48);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .ng-footer-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .ng-footer-list a {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: fit-content;
          color: rgba(245,240,233,0.62);
          text-decoration: none;
          font-size: 14px;
          font-weight: 300;
          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .ng-footer-list a::before {
          content: "";
          width: 0;
          height: 1px;
          margin-right: 0;
          background: #e8c97e;
          transition:
            width 0.25s ease,
            margin-right 0.25s ease;
        }

        .ng-footer-list a:hover {
          color: #e8c97e;
          transform: translateX(3px);
        }

        .ng-footer-list a:hover::before {
          width: 14px;
          margin-right: 8px;
        }

        /* CONTACT STRIP */

        .ng-footer-contact {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 52px;
        }

        .ng-footer-contact-card {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 76px;
          padding: 16px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          background: rgba(255,255,255,0.025);
          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .ng-footer-contact-card:hover {
          border-color: rgba(232,201,126,0.25);
          background: rgba(232,201,126,0.035);
          transform: translateY(-2px);
        }

        .ng-footer-contact-icon {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(232,201,126,0.1);
          color: #e8c97e;
        }

        .ng-footer-contact-label {
          margin-bottom: 4px;
          color: rgba(245,240,233,0.34);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ng-footer-contact-value {
          color: rgba(245,240,233,0.72);
          font-size: 13px;
          line-height: 1.4;
          word-break: break-word;
        }

        /* DIVIDER */

        .ng-footer-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* BOTTOM */

        .ng-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-top: 23px;
        }

        .ng-footer-copy {
          margin: 0;
          color: rgba(245,240,233,0.28);
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .ng-footer-socials {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ng-footer-social {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          color: rgba(245,240,233,0.55);
          text-decoration: none;
          transition:
            color 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .ng-footer-social:hover {
          color: #0a0908;
          background: #e8c97e;
          border-color: #e8c97e;
          transform: translateY(-2px);
        }

        .ng-footer-social svg {
          width: 15px;
          height: 15px;
        }

        /* WATERMARK */

        .ng-footer-watermark {
          position: absolute;
          right: -12px;
          bottom: -58px;
          z-index: 0;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          color: rgba(255,255,255,0.018);
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(120px, 18vw, 260px);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .ng-footer-inner {
            padding: 62px 24px 24px;
          }

          .ng-footer-top {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .ng-footer-contact {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .ng-footer {
            margin-top: 55px;
          }

          .ng-footer-inner {
            padding: 50px 18px 20px;
          }

          .ng-footer-logo {
            font-size: 55px;
          }

          .ng-footer-description {
            font-size: 13px;
          }

          .ng-footer-links {
            grid-template-columns: 1fr 1fr;
            gap: 35px 25px;
          }

          .ng-footer-contact {
            grid-template-columns: 1fr;
            margin-bottom: 40px;
          }

          .ng-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .ng-footer-socials {
            width: 100%;
          }
        }
      `}</style>

      <footer className="ng-footer">
        <div className="ng-footer-watermark">RAJ HAKSH</div>

        <div className="ng-footer-inner">
          {/* TOP SECTION */}

          <div className="ng-footer-top">
            {/* BRAND */}

            <div className="ng-footer-brand">
              <div className="ng-footer-kicker">
                Wholesale Fashion
              </div>

              <h2 className="ng-footer-logo">
                RAJ HAKSH 
              </h2>

              <p className="ng-footer-description">
                Curated women's fashion for boutiques and wholesale
                buyers. Discover thoughtfully selected styles, quality
                fabrics and collections made for modern retail.
              </p>

              <Link className="ng-footer-cta" to="/products">
                Explore Collection
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* LINKS */}

            <div className="ng-footer-links">
              <div>
                <h3 className="ng-footer-column-title">
                  Collection
                </h3>

                <ul className="ng-footer-list">
                  {collectionLinks.map(([label, path]) => (
                    <li key={`${label}-${path}`}>
                      <Link to={path}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="ng-footer-column-title">
                  Business
                </h3>

                <ul className="ng-footer-list">
                  {businessLinks.map(([label, path]) => (
                    <li key={`${label}-${path}`}>
                      <Link to={path}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CONTACT */}

          <div className="ng-footer-contact">
            <Link
              to="/contact"
              className="ng-footer-contact-card"
              style={{ textDecoration: "none" }}
            >
              <div className="ng-footer-contact-icon">
                <MessageCircle size={17} />
              </div>

              <div>
                <div className="ng-footer-contact-label">
                  Wholesale Enquiry
                </div>

                <div className="ng-footer-contact-value">
                  Start a conversation with us
                </div>
              </div>
            </Link>

            <a
              href="mailto:contact@rajhaksh.com"
              className="ng-footer-contact-card"
              style={{ textDecoration: "none" }}
            >
              <div className="ng-footer-contact-icon">
                <Mail size={17} />
              </div>

              <div>
                <div className="ng-footer-contact-label">
                  Email
                </div>

                <div className="ng-footer-contact-value">
                  rajhakshethicwear@gmail.com
                </div>
              </div>
            </a>

            <a
              href="tel:+910000000000"
              className="ng-footer-contact-card"
              style={{ textDecoration: "none" }}
            >
              <div className="ng-footer-contact-icon">
                <Phone size={17} />
              </div>

              <div>
                <div className="ng-footer-contact-label">
                  Call Us
                </div>

                <div className="ng-footer-contact-value">
                  +91 9998767891, +91 8128699255
                </div>
              </div>
            </a>
          </div>

          {/* DIVIDER */}

          <div className="ng-footer-divider" />

          {/* BOTTOM */}

          <div className="ng-footer-bottom">
            <p className="ng-footer-copy">
              © {currentYear} Raj Haksh. All rights reserved.
            </p>

            
          </div>
        </div>
      </footer>
    </>
  );
}
