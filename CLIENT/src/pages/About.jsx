import { Link } from "react-router-dom";
import {
  Award,
  Leaf,
  Sparkles,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";

const VALUES = [
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Handpicked fabrics and expert craftsmanship in every garment.",
  },
  {
    icon: Leaf,
    title: "Ethical Fashion",
    desc: "Fair trade practices and sustainable sourcing.",
  },
  {
    icon: Sparkles,
    title: "Modern Design",
    desc: "Clean, contemporary styles with innovative details.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Exceptional service and hassle-free shopping experience.",
  },
];

export function About() {
  return (
    <>
      <style>{`
        /* =========================================
           ABOUT PAGE
        ========================================= */

        .about-page {
          --about-bg: #f7f4ee;
          --about-white: #fffdf9;
          --about-soft: #f1ece3;
          --about-text: #25211c;
          --about-muted: #70695f;
          --about-light-muted: #928a7f;
          --about-gold: #b89455;
          --about-gold-dark: #96743d;
          --about-border: #e4ddd1;

          background: var(--about-bg);
          color: var(--about-text);
          font-family: "Jost", sans-serif;
          overflow: hidden;
        }

        .about-page *,
        .about-page *::before,
        .about-page *::after {
          box-sizing: border-box;
        }

        .about-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* =========================================
          HERO
        ========================================= */

        .about-hero {
  min-height: min(760px, 82vh);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  color: #fff;

  background:
    linear-gradient(
      180deg,
      rgba(20, 17, 13, 0.38),
      rgba(20, 17, 13, 0.72)
    ),
    url("https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&q=85")
      center / cover no-repeat;
}

        .about-hero::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(184, 148, 85, 0.16),
              transparent 42%
            );
        }

        .about-hero-content {
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 850px;

  margin: 0 auto;
  padding: 120px 20px 90px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

        .about-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          padding: 7px 15px;

          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 999px;

          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);

          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .about-hero h1 {
          margin: 22px 0 18px;

          font-family: "Playfair Display", serif;
          font-size: clamp(3rem, 7vw, 6.2rem);
          line-height: 0.98;
          font-weight: 700;
          letter-spacing: -0.04em;

          text-shadow: 0 8px 35px rgba(0, 0, 0, 0.35);
        }

        .about-hero h1 span {
          color: #e2c383;
          font-style: italic;
        }

        .about-hero p {
  width: 100%;
  max-width: 680px;
  margin: 0 auto 34px;

  text-align: center;

  color: rgba(255, 255, 255, 0.88);

  font-size: clamp(1rem, 2vw, 1.35rem);
  line-height: 1.75;
  font-weight: 300;
}

        /* =========================================
           BUTTONS
        ========================================= */

        .about-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          min-height: 52px;
          padding: 0 28px;

          border-radius: 999px;

          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;

          text-decoration: none;

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .about-btn:hover {
          transform: translateY(-3px);
        }

        .about-btn-light {
          background: #fffdf9;
          color: #26221d;

          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .about-btn-light:hover {
          background: #e8d0a0;
          color: #211d18;
        }

        .about-btn-gold {
          background: var(--about-gold);
          color: #fff;
          border: 1px solid var(--about-gold);

          box-shadow: 0 10px 28px rgba(184, 148, 85, 0.22);
        }

        .about-btn-gold:hover {
          background: var(--about-gold-dark);
          border-color: var(--about-gold-dark);
        }

        .about-btn-outline-light {
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: transparent;
        }

        .about-btn-outline-light:hover {
          background: #fff;
          color: #211d18;
          border-color: #fff;
        }

        /* =========================================
           STORY
        ========================================= */

        .about-story {
          padding: 110px 0;
          background: var(--about-bg);
        }

        .about-story-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 80px;
          align-items: center;
        }

        .about-section-label {
          display: inline-block;

          margin-bottom: 16px;

          color: var(--about-gold-dark);

          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .about-story h2,
        .about-values h2,
        .about-promise h2,
        .about-cta h2 {
          margin: 0;

          font-family: "Playfair Display", serif;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .about-story h2 {
          max-width: 520px;
          margin-bottom: 24px;

          font-size: clamp(2.3rem, 4vw, 3.5rem);
          line-height: 1.08;
        }

        .about-story-copy p {
          margin: 0;

          color: var(--about-muted);

          font-size: 16px;
          line-height: 1.9;
          font-weight: 300;
        }

        .about-story-copy p + p {
          margin-top: 20px;
        }

        .about-story-copy strong {
          color: var(--about-text);
          font-weight: 600;
        }

        .about-story-image {
          position: relative;

          border-radius: 22px;
          overflow: hidden;

          background: var(--about-soft);

          box-shadow:
            0 25px 60px rgba(47, 38, 27, 0.12);
        }

        .about-story-image::after {
          content: "";

          position: absolute;
          inset: 14px;

          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 15px;

          pointer-events: none;
        }

        .about-story-image img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;

          transition: transform 0.7s ease;
        }

        .about-story-image:hover img {
          transform: scale(1.035);
        }

        /* =========================================
           VALUES
        ========================================= */

        .about-values {
          padding: 105px 0;

          background: #fffdf9;

          border-top: 1px solid var(--about-border);
          border-bottom: 1px solid var(--about-border);
        }

        .about-values-heading {
          max-width: 650px;
          margin: 0 auto 55px;

          text-align: center;
        }

        .about-values-heading h2 {
          font-size: clamp(2.2rem, 4vw, 3.1rem);
          line-height: 1.1;
        }

        .about-values-heading p {
          margin: 15px auto 0;

          max-width: 560px;

          color: var(--about-muted);

          font-size: 15px;
          line-height: 1.75;
        }

        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .about-value-card {
          padding: 34px 26px;

          border: 1px solid var(--about-border);
          border-radius: 16px;

          background: #fff;

          text-align: center;

          box-shadow: 0 7px 25px rgba(40, 32, 22, 0.035);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .about-value-card:hover {
          transform: translateY(-7px);

          border-color: rgba(184, 148, 85, 0.45);

          box-shadow:
            0 18px 40px rgba(40, 32, 22, 0.09);
        }

        .about-value-icon {
          width: 58px;
          height: 58px;

          display: grid;
          place-items: center;

          margin: 0 auto 20px;

          border-radius: 50%;

          background: #f6efe3;
          color: var(--about-gold-dark);
        }

        .about-value-card h3 {
          margin: 0 0 10px;

          font-family: "Playfair Display", serif;
          font-size: 19px;
          color: #29251f;
        }

        .about-value-card p {
          margin: 0;

          color: var(--about-muted);

          font-size: 13px;
          line-height: 1.75;
        }

        /* =========================================
           PROMISE
        ========================================= */

        .about-promise {
          position: relative;

          padding: 105px 0;

          background:
            linear-gradient(
              135deg,
              #28231d,
              #171411
            );

          color: #fff;
          overflow: hidden;
        }

        .about-promise::before {
          content: "";

          position: absolute;
          width: 500px;
          height: 500px;

          top: -250px;
          left: 50%;

          transform: translateX(-50%);

          border-radius: 50%;

          background: rgba(184, 148, 85, 0.12);

          filter: blur(40px);
        }

        .about-promise-inner {
          position: relative;
          z-index: 1;

          text-align: center;
        }

        .about-promise .about-section-label {
          color: #d5b46f;
        }

        .about-promise h2 {
          font-size: clamp(2.3rem, 5vw, 3.6rem);
        }

        .about-promise-sub {
          max-width: 650px;
          margin: 16px auto 0;

          color: rgba(255, 255, 255, 0.65);

          font-size: 15px;
          line-height: 1.8;
        }

        .about-promise-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;

          max-width: 900px;

          margin: 60px auto 0;
        }

        .about-promise-card {
          position: relative;

          padding: 35px;

          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 18px;

          background: rgba(255, 255, 255, 0.045);

          text-align: left;

          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease;
        }

        .about-promise-card:hover {
          transform: translateY(-5px);

          border-color: rgba(213, 180, 111, 0.35);
          background: rgba(255, 255, 255, 0.065);
        }

        .about-promise-card-top {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 15px;
        }

        .about-promise-card-top svg {
          color: #d5b46f;
        }

        .about-promise-card h3 {
          margin: 0;

          font-family: "Playfair Display", serif;
          font-size: 23px;
          color: #fff;
        }

        .about-promise-card p {
          margin: 0;

          color: rgba(255, 255, 255, 0.68);

          font-size: 15px;
          line-height: 1.85;
        }

        /* =========================================
           CTA
        ========================================= */

        .about-cta {
          padding: 115px 0;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(184, 148, 85, 0.15),
              transparent 45%
            ),
            #f4efe6;

          text-align: center;
        }

        .about-cta-inner {
          max-width: 780px;
          margin: 0 auto;
        }

        .about-cta h2 {
          font-size: clamp(2.4rem, 5vw, 4rem);
          line-height: 1.08;
        }

        .about-cta p {
          max-width: 600px;
          margin: 18px auto 35px;

          color: var(--about-muted);

          font-size: 16px;
          line-height: 1.75;
        }

        .about-cta-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 950px) {
          .about-story-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .about-story-copy {
            max-width: 720px;
            margin: 0 auto;
            text-align: center;
          }

          .about-story h2 {
            margin-left: auto;
            margin-right: auto;
          }

          .about-story-image {
            max-width: 650px;
            width: 100%;
            margin: 0 auto;
          }

          .about-values-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-promise-grid {
            gap: 18px;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 650px) {
          .about-container {
            width: min(100% - 32px, 1180px);
          }

          .about-hero {
            min-height: 680px;
          }

          .about-hero-content {
            padding: 100px 0 70px;
          }

          .about-hero h1 {
            font-size: clamp(2.7rem, 14vw, 4.2rem);
            letter-spacing: -0.045em;
          }

          .about-hero p {
            font-size: 15px;
            line-height: 1.7;
          }

          .about-story,
          .about-values,
          .about-promise,
          .about-cta {
            padding: 75px 0;
          }

          .about-values-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .about-value-card {
            padding: 30px 24px;
          }

          .about-promise-grid {
            grid-template-columns: 1fr;
            margin-top: 40px;
          }

          .about-promise-card {
            padding: 28px 24px;
          }

          .about-promise-card h3 {
            font-size: 21px;
          }

          .about-cta-actions {
            flex-direction: column;
          }

          .about-btn {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          .about-hero {
            min-height: 620px;
          }

          .about-eyebrow {
            font-size: 9px;
            letter-spacing: 0.2em;
          }

          .about-hero h1 {
            font-size: 2.65rem;
          }

          .about-story h2,
          .about-values-heading h2 {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <main className="about-page">
        {/* =========================================
            HERO
        ========================================= */}

        <section className="about-hero">
          <div className="about-container">
            <div className="about-hero-content">
              <span className="about-eyebrow">
                <Sparkles size={13} />
                RAJ HAKSH Fashion
              </span>

              <h1>
                About <span>RAJ HAKSH</span>
              </h1>

              <p>
                Where timeless elegance meets tomorrow's fashion.
                Discover a thoughtful approach to premium women's
                fashion and wholesale collections.
              </p>

              <Link
                to="/products"
                className="about-btn about-btn-light"
              >
                Explore Our Collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================
            STORY
        ========================================= */}

        <section className="about-story">
          <div className="about-container">
            <div className="about-story-grid">
              <div className="about-story-copy">
                <span className="about-section-label">
                  Our Story
                </span>

                <h2>
                  Fashion made with purpose, style and substance.
                </h2>

                <p>
                  Founded in 2022, RAJ HAKSH was born from a simple
                  idea: fashion should be{" "}
                  <strong>premium yet accessible</strong>, timeless
                  yet forward-thinking. We believe clothing is more
                  than fabric — it's an expression of confidence,
                  personality, and values.
                </p>

                <p>
                  From carefully selected premium fabrics to ethical
                  manufacturing partners, every piece in our
                  collection tells a story of craftsmanship,
                  innovation, and respect for both people and planet.
                </p>
              </div>

              <div className="about-story-image">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&q=85"
                  alt="RAJ HAKSH fashion collection"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            VALUES
        ========================================= */}

        <section className="about-values">
          <div className="about-container">
            <div className="about-values-heading">
              <span className="about-section-label">
                What Drives Us
              </span>

              <h2>
                The values behind RAJ HAKSH
              </h2>

              <p>
                Every collection is guided by a balance of quality,
                modern design, responsible sourcing and customer
                relationships.
              </p>
            </div>

            <div className="about-values-grid">
              {VALUES.map(
                ({ icon: Icon, title, desc }) => (
                  <div
                    className="about-value-card"
                    key={title}
                  >
                    <div className="about-value-icon">
                      <Icon
                        size={27}
                        strokeWidth={1.6}
                      />
                    </div>

                    <h3>{title}</h3>

                    <p>{desc}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            PROMISE
        ========================================= */}

        <section className="about-promise">
          <div className="about-container">
            <div className="about-promise-inner">
              <span className="about-section-label">
                Our Promise
              </span>

              <h2>What we are building</h2>

              <p className="about-promise-sub">
                A fashion business focused on meaningful design,
                reliable quality and long-term relationships.
              </p>

              <div className="about-promise-grid">
                <div className="about-promise-card">
                  <div className="about-promise-card-top">
                    <Check size={18} />
                    <h3>Mission</h3>
                  </div>

                  <p>
                    To redefine premium fashion by making
                    exceptional design and quality accessible to
                    the modern individual who values both style
                    and substance.
                  </p>
                </div>

                <div className="about-promise-card">
                  <div className="about-promise-card-top">
                    <Check size={18} />
                    <h3>Vision</h3>
                  </div>

                  <p>
                    A world where fashion empowers confidence,
                    celebrates individuality, and respects our
                    planet for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="about-cta">
          <div className="about-container">
            <div className="about-cta-inner">
              <span className="about-section-label">
                Start Exploring
              </span>

              <h2>
                Ready to discover RAJ HAKSH?
              </h2>

              <p>
                Explore our latest collections and discover
                styles created for modern fashion businesses.
              </p>

              <div className="about-cta-actions">
                <Link
                  to="/products"
                  className="about-btn about-btn-gold"
                >
                  Shop Collection
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/"
                  className="about-btn"
                  style={{
                    color: "#29251f",
                    border: "1px solid #d8cfc1",
                    background: "#fffdf9",
                  }}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
