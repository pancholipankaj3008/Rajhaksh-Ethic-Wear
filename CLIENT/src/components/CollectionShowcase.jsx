import { Link } from "react-router-dom";

export default function CollectionShowcase() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .cs2-root,
        .cs2-root * {
          box-sizing: border-box;
        }

        .cs2-root {
          background: #0a0a0a;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .cs2-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .cs2-section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        .cs2-section-label span {
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .cs2-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .cs2-block {
          display: grid;
          position: relative;
          z-index: 1;
        }

        .cs2-block-a {
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }

        .cs2-img-wrap {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .cs2-block-a .cs2-img-wrap {
          border-radius: 50px 0 0 50px;
          aspect-ratio: 16 / 10;
        }

        .cs2-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition:
            transform 1s cubic-bezier(0.25,0.46,0.45,0.94),
            filter 0.5s;
          filter: brightness(0.9) saturate(0.85);
        }

        .cs2-img-wrap:hover img {
          transform: scale(1.06);
          filter: brightness(1) saturate(1);
        }

        .cs2-img-number {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 72px;
          color: rgba(255,255,255,0.08);
          transition: .4s;
        }

        .cs2-img-wrap:hover .cs2-img-number {
          color: rgba(255,255,255,0.15);
        }

        .cs2-img-pill {
          position: absolute;
          top: 22px;
          left: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(10,10,10,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f135;
          box-shadow: 0 0 8px #c8f135;
        }

        .cs2-text {
          padding: 48px;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
        }

        .cs2-text-eyebrow {
          font-size: 10px;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: #c8f135;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cs2-text-eyebrow::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #c8f135;
        }

        .cs2-text-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 5vw, 72px);
          line-height: .9;
          color: #f0ede8;
          margin-bottom: 24px;
        }

        .outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(240,237,232,.4);
        }

        .cs2-text-desc {
          max-width: 360px;
          font-size: 13px;
          line-height: 1.8;
          color: rgba(240,237,232,.45);
          margin-bottom: 30px;
        }

        .cs2-stats {
          display: flex;
          gap: 32px;
          margin-bottom: 30px;
        }

        .cs2-stat {
          display: flex;
          flex-direction: column;
        }

        .cs2-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #f0ede8;
        }

        .cs2-stat-label {
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(240,237,232,.35);
        }

        .cs2-ctas {
          display: flex;
          gap: 14px;
        }

        .cs2-btn-primary {
          border: none;
          background: #c8f135;
          color: #0a0a0a;
          padding: 14px 28px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
        }

        .cs2-btn-ghost {
          border: 1px solid rgba(255,255,255,.12);
          background: transparent;
          color: rgba(255,255,255,.6);
          padding: 14px 24px;
          font-size: 10px;
          letter-spacing: .2em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
        }

        @media (max-width: 900px) {
          .cs2-root {
            padding: 40px 20px;
          }

          .cs2-block-a {
            grid-template-columns: 1fr;
          }

          .cs2-block-a .cs2-img-wrap {
            border-radius: 24px 24px 0 0;
            aspect-ratio: 16/11;
          }

          .cs2-text {
            padding: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .cs2-stats {
            gap: 18px;
          }

          .cs2-ctas {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="cs2-root">

        <div className="cs2-section-label">
          <span>Reflect Studio — FW 2026</span>
        </div>

        {/* Clothing */}
        <div className="cs2-block cs2-block-a">

          <div className="cs2-img-wrap">
            <img
              src="https://i.pinimg.com/1200x/49/0e/f3/490ef3e33250c42d59e5850fc2de436d.jpg"
              alt="Clothing Collection"
            />
            <div className="cs2-img-number">01</div>

            <div className="cs2-img-pill">
              <span className="dot"></span>
              New Season
            </div>
          </div>

          <div className="cs2-text">
            <div className="cs2-text-eyebrow">
              Clothing Collection
            </div>

            <h2 className="cs2-text-title">
              CLOTHING <br />
              <span className="outline">COLLECTION</span>
            </h2>

            <p className="cs2-text-desc">
              A celebration of style, versatility, and craftsmanship. Each piece
              is designed to complement a range of occasions — from everyday
              casual wear to statement-making outfits.
            </p>

            <div className="cs2-stats">
              <div className="cs2-stat">
                <span className="cs2-stat-num">200+</span>
                <span className="cs2-stat-label">Styles</span>
              </div>

              <div className="cs2-stat">
                <span className="cs2-stat-num">12</span>
                <span className="cs2-stat-label">Collections</span>
              </div>

              <div className="cs2-stat">
                <span className="cs2-stat-num">SS26</span>
                <span className="cs2-stat-label">Season</span>
              </div>
            </div>

            <div className="cs2-ctas">
              <Link to="/products" className="cs2-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                Explore Products
              </Link>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
