import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  Package,
  Ruler,
  Truck,
} from "lucide-react";
import { buildWhatsAppUrl, getWhatsAppNumber } from "../utils/whatsapp";

const CONTACT = {
  phone: import.meta.env.VITE_CONTACT_PHONE || "",
  email: import.meta.env.VITE_CONTACT_EMAIL || "",
  address: import.meta.env.VITE_CONTACT_ADDRESS || "",
  hours: import.meta.env.VITE_BUSINESS_HOURS || "",
};

const STEPS = [
  {
    icon: Package,
    title: "Share your requirement",
    text: "Tell us the styles, fabrics and quantities you are sourcing.",
  },
  {
    icon: Ruler,
    title: "We curate for you",
    text: "Our team suggests the right designs, sizes and colour sets.",
  },
  {
    icon: Truck,
    title: "Confirm & dispatch",
    text: "Finalise rates and delivery details directly with our team.",
  },
];

const INITIAL = {
  name: "",
  business: "",
  phone: "",
  city: "",
  looking: "",
  message: "",
};

export function Contact() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({ ...INITIAL, looking: searchParams.get("category") || "" }));
  const [errors, setErrors] = useState({});

  const whatsappReady = Boolean(getWhatsAppNumber());

  useEffect(() => {
    document.title = "Contact Us | Women's Wholesale Collection";

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      "content",
      "Contact us for women's ethnic wear wholesale. Share your requirement on WhatsApp or send an enquiry and our team will get back to you."
    );
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((er) => ({
        ...er,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Please enter your name";
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      e.phone = "Enter a valid phone number";
    }

    if (!form.message.trim() && !form.looking.trim()) {
      e.message = "Tell us what you are looking for";
    }

    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const e = validate();
    setErrors(e);

    if (Object.keys(e).length) return;

    const message = [
      "Hello, I would like to discuss a wholesale collection.",
      `Name: ${form.name.trim()}`,
      form.business.trim() && `Business: ${form.business.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.city.trim() && `City: ${form.city.trim()}`,
      form.looking.trim() && `Looking for: ${form.looking.trim()}`,
      form.message.trim() && `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = buildWhatsAppUrl(message);

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const quickWhatsApp = buildWhatsAppUrl(
    "Hello, I would like to discuss a wholesale collection."
  );

  const details = [
    CONTACT.phone && {
      icon: Phone,
      label: "Call us",
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`,
    },
    CONTACT.email && {
      icon: Mail,
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    CONTACT.address && {
      icon: MapPin,
      label: "Visit us",
      value: CONTACT.address,
    },
    CONTACT.hours && {
      icon: Clock,
      label: "Working hours",
      value: CONTACT.hours,
    },
  ].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');

        .ct-root,
        .ct-root * {
          box-sizing: border-box;
        }

        /* =========================
           LIGHT LUXURY THEME
        ========================= */

        .ct-root {
          --gold: #b89455;
          --gold-dark: #96743d;

          --ink: #f7f4ee;
          --card: #fffdf9;
          --card-soft: #faf7f0;

          --text: #24211d;
          --muted: #746e65;
          --muted-light: #938b80;

          --line: #e6dfd3;
          --line-dark: #d8cfc1;

          background: var(--ink);
          color: var(--text);
          font-family: "Jost", sans-serif;
          min-height: 100vh;
        }

        .ct-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* =========================
           HERO
        ========================= */

        .ct-hero {
          padding: 130px 0 72px;
          text-align: center;

          background:
            radial-gradient(
              60% 80% at 50% 0%,
              rgba(184, 148, 85, 0.13),
              transparent 70%
            ),
            linear-gradient(
              180deg,
              #fbf9f5 0%,
              #f7f4ee 100%
            );

          border-bottom: 1px solid var(--line);
        }

        .ct-eyebrow {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--gold-dark);

          border: 1px solid rgba(184, 148, 85, 0.42);

          background: rgba(255, 253, 249, 0.75);

          padding: 7px 17px;
          border-radius: 100px;
          margin-bottom: 22px;
        }

        .ct-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(38px, 6vw, 72px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #24211d;
          margin: 0 0 18px;
        }

        .ct-title em {
          font-style: italic;
          color: var(--gold-dark);
        }

        .ct-sub {
          max-width: 560px;
          margin: 0 auto 32px;
          font-size: clamp(14px, 1.5vw, 17px);
          font-weight: 300;
          line-height: 1.8;
          color: var(--muted);
        }

        .ct-hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* =========================
           BUTTONS
        ========================= */

        .ct-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          padding: 14px 28px;

          font-family: "Jost", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;

          text-decoration: none;
          border-radius: 5px;
          cursor: pointer;

          transition:
            transform 0.3s ease,
            opacity 0.3s ease,
            background 0.3s ease,
            color 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .ct-btn:hover {
          transform: translateY(-2px);
        }

        .ct-btn-gold {
          background: var(--gold);
          color: #fff;
          border: 1px solid var(--gold);

          box-shadow: 0 8px 22px rgba(184, 148, 85, 0.18);
        }

        .ct-btn-gold:hover {
          background: var(--gold-dark);
          border-color: var(--gold-dark);
          box-shadow: 0 12px 28px rgba(184, 148, 85, 0.24);
        }

        .ct-btn-outline {
          background: #fffdf9;
          color: #2c2924;
          border: 1px solid var(--line-dark);
        }

        .ct-btn-outline:hover {
          background: #2c2924;
          color: #fff;
          border-color: #2c2924;
        }

        /* =========================
           STEPS
        ========================= */

        .ct-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 60px 0 20px;
        }

        .ct-step {
          padding: 28px;

          border: 1px solid var(--line);
          border-radius: 14px;

          background: var(--card);

          box-shadow:
            0 5px 25px rgba(50, 42, 32, 0.035);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .ct-step:hover {
          transform: translateY(-4px);

          border-color: rgba(184, 148, 85, 0.4);

          box-shadow:
            0 14px 35px rgba(50, 42, 32, 0.08);
        }

        .ct-step-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;

          display: grid;
          place-items: center;

          background: rgba(184, 148, 85, 0.11);
          color: var(--gold-dark);

          margin-bottom: 16px;
        }

        .ct-step h3 {
          font-family: "Playfair Display", serif;
          font-size: 19px;
          margin: 0 0 8px;
          font-weight: 700;
          color: #29251f;
        }

        .ct-step p {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: var(--muted);
          font-weight: 300;
        }

        /* =========================
           MAIN GRID
        ========================= */

        .ct-main {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 32px;
          padding: 50px 0 90px;
          align-items: start;
        }

        .ct-panel {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 14px;

          padding: 34px;

          box-shadow:
            0 8px 35px rgba(50, 42, 32, 0.045);
        }

        .ct-panel h2 {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          margin: 0 0 8px;
          font-weight: 700;
          color: #28241f;
        }

        .ct-panel-sub {
          margin: 0 0 26px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--muted);
          font-weight: 300;
        }

        /* =========================
           CONTACT DETAILS
        ========================= */

        .ct-detail {
          display: flex;
          gap: 16px;

          padding: 18px 0;

          border-top: 1px solid var(--line);

          color: inherit;
          text-decoration: none;
        }

        .ct-detail:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .ct-detail-icon {
          flex: none;

          width: 42px;
          height: 42px;
          border-radius: 10px;

          display: grid;
          place-items: center;

          background: #f5efe4;
          color: var(--gold-dark);
        }

        .ct-detail-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;

          color: var(--muted-light);

          margin-bottom: 4px;
        }

        .ct-detail-value {
          font-size: 15px;
          line-height: 1.6;
          word-break: break-word;
          color: #2d2924;
        }

        a.ct-detail:hover .ct-detail-value {
          color: var(--gold-dark);
        }

        /* =========================
           WHATSAPP CARD
        ========================= */

        .ct-wa-card {
          margin-top: 26px;
          padding: 22px;

          border-radius: 12px;

          border: 1px solid rgba(184, 148, 85, 0.32);

          background:
            linear-gradient(
              135deg,
              rgba(184, 148, 85, 0.08),
              rgba(255, 253, 249, 0.95)
            );
        }

        .ct-wa-card p {
          margin: 0 0 14px;

          font-size: 14px;
          line-height: 1.7;

          color: #625b51;
        }

        .ct-empty {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
        }

        /* =========================
           FORM
        ========================= */

        .ct-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .ct-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .ct-field.full {
          grid-column: 1 / -1;
        }

        .ct-field label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;

          color: #756e64;
        }

        .ct-field input,
        .ct-field textarea {
          width: 100%;

          background: #fbf9f5;

          border: 1px solid #ddd5c8;
          border-radius: 7px;

          padding: 13px 14px;

          font-family: "Jost", sans-serif;
          font-size: 15px;

          color: #29251f;

          outline: none;

          transition:
            border-color 0.25s,
            box-shadow 0.25s,
            background 0.25s;
        }

        .ct-field input:hover,
        .ct-field textarea:hover {
          background: #fffdf9;
          border-color: #cfc4b4;
        }

        .ct-field textarea {
          min-height: 120px;
          resize: vertical;
        }

        .ct-field input::placeholder,
        .ct-field textarea::placeholder {
          color: #aaa197;
        }

        .ct-field input:focus,
        .ct-field textarea:focus {
          background: #fffdf9;

          border-color: var(--gold);

          box-shadow:
            0 0 0 3px rgba(184, 148, 85, 0.11);
        }

        .ct-field.err input,
        .ct-field.err textarea {
          border-color: #d94b50;
        }

        .ct-error {
          font-size: 12px;
          color: #c83e43;
        }

        /* =========================
           FORM FOOT
        ========================= */

        .ct-form-foot {
          grid-column: 1 / -1;

          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;

          margin-top: 6px;
        }

        .ct-btn-submit {
          border: none;
        }

        .ct-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .ct-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;

          color: #625b51;

          text-decoration: none;

          border-bottom: 1px solid #c9c0b4;

          padding-bottom: 3px;

          transition:
            color 0.25s,
            border-color 0.25s;
        }

        .ct-link:hover {
          color: var(--gold-dark);
          border-color: var(--gold);
        }

        .ct-note {
          grid-column: 1 / -1;

          font-size: 12px;
          color: #958c81;

          margin: 0;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 900px) {
          .ct-hero {
            padding: 110px 0 50px;
          }

          .ct-steps {
            grid-template-columns: 1fr;
            padding-top: 40px;
          }

          .ct-main {
            grid-template-columns: 1fr;
            padding-bottom: 60px;
          }

          .ct-panel {
            padding: 26px 20px;
          }
        }

        @media (max-width: 560px) {
          .ct-wrap {
            padding: 0 16px;
          }

          .ct-form {
            grid-template-columns: 1fr;
          }

          .ct-field.full {
            grid-column: auto;
          }

          .ct-btn {
            width: 100%;
            justify-content: center;
          }

          .ct-hero-actions {
            flex-direction: column;
          }

          .ct-title {
            font-size: 42px;
          }

          .ct-step {
            padding: 22px;
          }
        }
      `}</style>

      <main className="ct-root">
        {/* HERO */}

        <section className="ct-hero">
          <div className="ct-wrap">
            <span className="ct-eyebrow">
              Wholesale partnership
            </span>

            <h1 className="ct-title">
              Let’s build your <em>collection</em>
            </h1>

            <p className="ct-sub">
              Tell us what you are sourcing and our team will help curate the
              right styles, sizes and quantities for your business.
            </p>

            <div className="ct-hero-actions">
              {whatsappReady && (
                <a
                  className="ct-btn ct-btn-gold"
                  href={quickWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              )}

              <Link
                className="ct-btn ct-btn-outline"
                to="/products"
              >
                View Collection
              </Link>
            </div>
          </div>
        </section>

        <div className="ct-wrap">
          {/* HOW IT WORKS */}

          <section
            className="ct-steps"
            aria-label="How wholesale enquiry works"
          >
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div className="ct-step" key={title}>
                <div className="ct-step-icon">
                  <Icon size={20} />
                </div>

                <h3>{title}</h3>

                <p>{text}</p>
              </div>
            ))}
          </section>

          {/* DETAILS + FORM */}

          <section className="ct-main">
            <div className="ct-panel">
              <h2>Get in touch</h2>

              <p className="ct-panel-sub">
                Reach us the way that suits you. We usually reply quickly
                during working hours.
              </p>

              {details.length > 0 ? (
                details.map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <div className="ct-detail-icon">
                        <Icon size={18} />
                      </div>

                      <div>
                        <div className="ct-detail-label">
                          {label}
                        </div>

                        <div className="ct-detail-value">
                          {value}
                        </div>
                      </div>
                    </>
                  );

                  return href ? (
                    <a
                      className="ct-detail"
                      href={href}
                      key={label}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="ct-detail" key={label}>
                      {inner}
                    </div>
                  );
                })
              ) : (
                <p className="ct-empty">
                  Please use WhatsApp or the enquiry form and our team will
                  contact you.
                </p>
              )}

              <div className="ct-wa-card">
                <p>
                  Already picked some styles? Add them to your enquiry list
                  and send everything to us in one go.
                </p>

                <Link className="ct-link" to="/enquiry">
                  Open enquiry list <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="ct-panel">
              <h2>Send us your requirement</h2>

              <p className="ct-panel-sub">
                Fill in a few details and we will continue the conversation
                on WhatsApp.
              </p>

              <form
                className="ct-form"
                onSubmit={onSubmit}
                noValidate
              >
                <div
                  className={`ct-field ${
                    errors.name ? "err" : ""
                  }`}
                >
                  <label htmlFor="ct-name">
                    Your name *
                  </label>

                  <input
                    id="ct-name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Full name"
                    autoComplete="name"
                  />

                  {errors.name && (
                    <span className="ct-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-business">
                    Business name
                  </label>

                  <input
                    id="ct-business"
                    name="business"
                    value={form.business}
                    onChange={onChange}
                    placeholder="Store / boutique name"
                    autoComplete="organization"
                  />
                </div>

                <div
                  className={`ct-field ${
                    errors.phone ? "err" : ""
                  }`}
                >
                  <label htmlFor="ct-phone">
                    Phone *
                  </label>

                  <input
                    id="ct-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="10 digit mobile number"
                    autoComplete="tel"
                  />

                  {errors.phone && (
                    <span className="ct-error">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="ct-field">
                  <label htmlFor="ct-city">
                    City
                  </label>

                  <input
                    id="ct-city"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="Your city"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="ct-field full">
                  <label htmlFor="ct-looking">
                    Looking for
                  </label>

                  <input
                    id="ct-looking"
                    name="looking"
                    value={form.looking}
                    onChange={onChange}
                    placeholder="e.g. Sarees, Kurta Sets, Lehenga Choli"
                  />
                </div>

                <div
                  className={`ct-field full ${
                    errors.message ? "err" : ""
                  }`}
                >
                  <label htmlFor="ct-message">
                    Message
                  </label>

                  <textarea
                    id="ct-message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="Quantity, budget, fabric preference or anything else..."
                  />

                  {errors.message && (
                    <span className="ct-error">
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className="ct-form-foot">
                  <button
                    type="submit"
                    className="ct-btn ct-btn-gold ct-btn-submit"
                    disabled={!whatsappReady}
                  >
                    <Send size={15} />
                    Send on WhatsApp
                  </button>

                  <Link
                    className="ct-link"
                    to="/products"
                  >
                    Browse collection{" "}
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {!whatsappReady && (
                  <p className="ct-note">
                    WhatsApp is not configured yet. Please use the enquiry
                    list and our team will contact you.
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
