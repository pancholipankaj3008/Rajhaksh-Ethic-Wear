import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/*
  NOTE: `img` abhi temporary hai. Apne asli product/banner images
  (Cloudinary ya /public) se replace karna.
  `category` wahi slug hona chahiye jo Category resource me hai.
*/
const slides = [
  {
    img: "https://i.pinimg.com/736x/4e/c7/e0/4ec7e0ee71a1c617cc38602b5c31463a.jpg",
    label: "SAREES — WHOLESALE COLLECTION",
    title: "Timeless\nSarees",
    subtitle: "Silk, georgette and designer sarees, curated for retailers and boutiques.",
    accent: "#E8C97E",
    tag: "BEST SELLER",
    category: "sarees",
    position: "center 30%",
  },
  {
    img: "https://stylecaret.com/cdn/shop/files/54023474853_45d5f19db4_k.jpg?v=1729769697",
    label: "LEHENGA CHOLI — BRIDAL & FESTIVE",
    title: "Festive\nLehenga Choli",
    subtitle: "Rich embroidery and grand flairs for weddings and celebrations.",
    accent: "#C9A4D4",
    tag: "WEDDING EDIT",
    category: "lehenga-choli",
    position: "center 7%",
  },
  {
    img: "https://i.pinimg.com/1200x/7a/0c/ca/7a0ccab2c88ce7fd07d0b156388c3a1f.jpg",
    label: "SALWAR SUITS — DAILY & PARTY WEAR",
    title: "Elegant\nSalwar Suits",
    subtitle: "Straight, anarkali and palazzo suit sets in trending fabrics.",
    accent: "#A8C5DA",
    tag: "NEW IN",
    category: "salwar-suits",
    position: "center 45%",
  },
  {
    img: "https://i.pinimg.com/1200x/e2/e2/44/e2e244edc772d5bf273fd4a3b204c854.jpg",
    label: "KURTA SETS — EVERYDAY ETHNIC",
    title: "Modern\nKurta Sets",
    subtitle: "Kurta with bottom and dupatta sets, easy to style and easy to sell.",
    accent: "#F4A26A",
    tag: "TRENDING",
    category: "kurta-sets",
    position: "center 30%",
  },
  {
    img: "https://i.pinimg.com/1200x/1e/4b/ce/1e4bce93916c540125cccd376cc66505.jpg",
    label: "ETHNIC CO-ORDS & SETS — FUSION",
    title: "Ethnic\nCo-ords & Sets",
    subtitle: "Fusion co-ord sets for the modern woman, in wholesale quantities.",
    accent: "#E8C97E",
    tag: "JUST DROPPED",
    category: "ethnic-coords-sets",
    position: "center 35%",
  },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const navigate = useNavigate();

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    setAnimKey((k) => k + 1);
  };

  const accent = slides[activeIndex]?.accent || "#fff";

  const goToCollection = (slide) => navigate(`/products?category=${slide.category}`);
  const goToEnquiry = (slide) => navigate(`/contact?category=${slide.category}`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --accent: ${accent};
          --transition-speed: 0.6s;
        }

        .hero-swiper {
          width: 100%;
          height: 100vh;
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 6s ease-out;
          transform: scale(1.03);
        }

        @media (min-width: 1024px) {
          .slide-img {
            object-position: center center;
          }
        }

        .hero-swiper .swiper-slide-active .slide-img {
          transform: scale(1.25);
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 50%,
            rgba(0,0,0,0.10) 100%
          );
        }

        .accent-line {
          position: absolute;
          left: 7vw;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 0;
          background: var(--accent);
          transition: height 0.9s cubic-bezier(0.77,0,0.18,1) 0.2s, background 0.5s;
        }

        .slide-active-content .accent-line,
        .accent-line.slide-active-content {
          height: 120px;
        }

        .slide-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 calc(7vw + 28px);
          font-family: 'Jost', sans-serif;
          color: #fff;
        }

        .slide-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          padding: 5px 14px;
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: 100px;
          margin-bottom: 18px;
          width: fit-content;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s, border-color 0.5s, color 0.5s;
        }

        .slide-active-content .slide-tag {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-label {
          font-size: clamp(10px, 1.2vw, 13px);
          font-weight: 300;
          letter-spacing: 0.3em;
          margin-bottom: 14px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }

        .slide-active-content .slide-label {
          opacity: 0.65;
          transform: translateY(0);
        }

        .slide-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 6.5vw, 92px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          white-space: pre-line;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
        }

        .slide-active-content .slide-title {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-title em {
          font-style: italic;
          color: var(--accent);
          transition: color 0.5s;
        }

        .slide-subtitle {
          font-size: clamp(13px, 1.4vw, 17px);
          font-weight: 300;
          max-width: 420px;
          line-height: 1.7;
          margin-bottom: 38px;
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .slide-active-content .slide-subtitle {
          opacity: 0.8;
          transform: translateY(0);
        }

        .slide-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s;
        }

        .slide-active-content .slide-ctas {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          background: var(--accent);
          color: #000;
          border: 1px solid var(--accent);
          padding: 14px 32px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.3s, transform 0.3s;
        }

        .btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.7);
          padding: 14px 32px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, transform 0.3s;
        }

        .btn-secondary:hover {
          background: #fff;
          color: #000;
          transform: translateY(-2px);
        }

        .slide-counter {
          position: absolute;
          bottom: 48px;
          left: 7vw;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .slide-counter .current {
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }

        .counter-bar {
          width: 60px;
          height: 1px;
          background: rgba(255,255,255,0.2);
          position: relative;
        }

        .counter-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--accent);
          animation: counterFill 5s linear forwards;
        }

        @keyframes counterFill {
          from { width: 0; }
          to { width: 100%; }
        }

        .hero-swiper .swiper-pagination {
          bottom: 48px;
          right: 7vw;
          left: auto;
          width: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.35);
          border-radius: 50%;
          opacity: 1;
          margin: 0 !important;
          transition: all 0.4s;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          background: var(--accent);
          height: 24px;
          border-radius: 3px;
          transition: background 0.5s, height 0.4s;
        }

        .vertical-label {
          position: absolute;
          right: 7vw;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.35em;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
          text-transform: uppercase;
          z-index: 10;
        }

        @media (max-width: 767px) {
          .slide-img {
            object-position: center top !important;
            transform: scale(1.02) !important;
          }

          .vertical-label {
            right: -34%;
            top: 40%;
            font-size: 8px;
            letter-spacing: 0.18em;
          }

          .slide-content {
            padding: 0 20px 0 52px !important;
          }

          .accent-line {
            left: 20px !important;
          }

          .slide-counter {
            left: 20px !important;
          }

          .slide-title {
            font-size: clamp(34px, 10vw, 52px) !important;
          }

          .btn-primary,
          .btn-secondary {
            padding: 12px 22px;
          }

          .hero-swiper .swiper-pagination {
            right: 12px !important;
            bottom: 40px !important;
          }
        }

        .scroll-hint {
          position: absolute;
          bottom: 44px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.4;
          animation: scrollBounce 2s infinite;
        }

        .scroll-hint span {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          color: #fff;
          text-transform: uppercase;
        }

        .scroll-arrow {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, #fff, transparent);
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>

      <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative", background: "#000" }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          speed={1100}
          className="hero-swiper"
          onSlideChange={handleSlideChange}
          onSwiper={(s) => setActiveIndex(s.realIndex)}
        >
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;
            return (
              <SwiperSlide key={slide.category}>
                <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

                  <img
                    src={slide.img}
                    alt={`${slide.title.replace("\n", " ")} - women's wholesale collection`}
                    className="slide-img"
                    style={{ objectPosition: slide.position || "center" }}
                  />

                  <div className="slide-overlay" />

                  <div className={`accent-line ${isActive ? "slide-active-content" : ""}`} />

                  <div
                    className={`slide-content ${isActive ? "slide-active-content" : ""}`}
                    key={`${index}-${animKey}`}
                  >
                    <div className="slide-tag">{slide.tag}</div>
                    <div className="slide-label">{slide.label}</div>

                    <h1 className="slide-title">
                      {slide.title.split("\n").map((line, i) =>
                        i % 2 === 1
                          ? <span key={i}><em>{line}</em>{"\n"}</span>
                          : <span key={i}>{line}{"\n"}</span>
                      )}
                    </h1>

                    <p className="slide-subtitle">{slide.subtitle}</p>

                    <div className="slide-ctas">
                      <button className="btn-primary" onClick={() => goToCollection(slide)}>
                        Collection
                      </button>
                      <button className="btn-secondary" onClick={() => goToEnquiry(slide)}>
                        Enquiry
                      </button>
                    </div>
                  </div>

                  <div className="slide-counter">
                    <span className="current">0{index + 1}</span>
                    <div className="counter-bar">
                      {isActive && (
                        <div
                          className="counter-bar-fill"
                          key={animKey}
                          style={{ background: slide.accent }}
                        />
                      )}
                    </div>
                    <span>0{slides.length}</span>
                  </div>

                  <div className="vertical-label">
                    Women's Wholesale · Curated Catalog · Enquire on WhatsApp
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </div>
    </>
  );
}
