import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, Minus, Plus, X, ShoppingBag } from "lucide-react";
import API from "../api/axios";
import { getEnquiryList, saveEnquiryList } from "../utils/enquiryList";

export function EnquiryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState(getEnquiryList());
  const [form, setForm] = useState({
    customerName: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => saveEnquiryList(items), [items]);

  const changeQuantity = (index, quantity) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item
      )
    );

  const removeItem = (index) => setItems(items.filter((_, itemIndex) => itemIndex !== index));

  const submit = async (event) => {
    event.preventDefault();
    if (!items.length || submitting) return;
    setSubmitting(true);
    setSuccess("");
    try {
      await API.post("/enquiries", {
        ...form,
        items: items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
      });
      saveEnquiryList([]);
      setItems([]);
      setSuccess("Thank you — your wholesale enquiry has been sent. We'll be in touch shortly.");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to submit enquiry. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{`
        .el-head {
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 28px;
        }

        .el-head .title {
          margin-top: 6px;
        }

        .el-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 18px;
          border-radius: var(--radius);
          margin-bottom: 22px;
          font-size: 13.5px;
          line-height: 1.5;
          border: 1px solid var(--line);
        }

        .el-banner.success {
          background: rgba(46, 125, 50, 0.06);
          border-color: rgba(46, 125, 50, 0.25);
          color: var(--ink);
        }

        .el-banner.success svg {
          color: var(--success);
        }

        .el-banner.error {
          background: rgba(192, 57, 43, 0.06);
          border-color: rgba(192, 57, 43, 0.25);
        }

        .el-banner.error svg,
        .el-banner.error p {
          color: var(--danger);
        }

        .el-banner svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .el-card {
          padding: 24px;
        }

        .el-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          margin-bottom: 6px;
          border-bottom: 1px solid var(--line);
        }

        .el-summary strong {
          font-family: "Cormorant Garamond", serif;
          font-size: 22px;
          font-weight: 600;
        }

        .el-row {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 0;
          border-bottom: 1px solid var(--line);
        }

        .el-row:last-child {
          border-bottom: none;
          padding-bottom: 4px;
        }

        .el-row:first-of-type {
          padding-top: 4px;
        }

        .el-row img {
          width: 62px;
          height: 78px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
          background: var(--surface-soft);
        }

        .el-row-info {
          flex: 1;
          min-width: 0;
        }

        .el-row-info strong {
          display: block;
          font-size: 15px;
          font-weight: 600;
        }

        .el-row-info small {
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.02em;
        }

        .el-stepper {
          display: flex;
          align-items: center;
          border: 1px solid var(--line);
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .el-stepper button {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: none;
          background: var(--surface-soft);
          cursor: pointer;
          color: var(--ink-soft);
        }

        .el-stepper button:hover {
          background: var(--line);
        }

        .el-stepper input {
          width: 40px;
          border: none;
          text-align: center;
          font-size: 13.5px;
          font-weight: 600;
          background: transparent;
          -moz-appearance: textfield;
        }

        .el-stepper input::-webkit-outer-spin-button,
        .el-stepper input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .el-remove {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
          background: #fff;
          color: var(--muted);
          cursor: pointer;
          flex-shrink: 0;
          transition: color 150ms ease, border-color 150ms ease;
        }

        .el-remove:hover {
          color: var(--danger);
          border-color: var(--danger);
        }

        .el-form-title {
          margin: 0 0 20px;
        }

        .el-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        .el-field-full {
          grid-column: 1 / -1;
        }

        .el-submit {
          grid-column: 1 / -1;
          margin-top: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .el-spinner {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          animation: elSpin 0.7s linear infinite;
        }

        @keyframes elSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 560px) {
          .el-card {
            padding: 18px;
          }

          .el-row {
            flex-wrap: wrap;
            gap: 12px;
          }

          .el-row-info {
            min-width: calc(100% - 80px);
          }

          .el-row img {
            width: 54px;
            height: 68px;
          }

          .el-stepper,
          .el-remove {
            margin-left: 80px;
          }
        }
      `}</style>

      <main className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="el-head">
            <span className="eyebrow">Wholesale enquiry</span>
            <h1 className="title">Your Enquiry List</h1>
          </div>

          {success && (
            <div className="el-banner success">
              <CheckCircle2 size={18} />
              <p role="status" style={{ margin: 0 }}>{success}</p>
            </div>
          )}

          {!items.length && !success ? (
            <div className="empty-state">
              <div className="empty-mark">
                <ShoppingBag size={26} />
              </div>
              <p style={{ margin: "0 0 18px", color: "var(--muted)" }}>Your enquiry list is empty.</p>
              <button className="btn btn-primary" onClick={() => navigate("/products")}>
                Browse products
              </button>
            </div>
          ) : (
            items.length > 0 && (
              <>
                <div className="card el-card">
                  <div className="el-summary">
                    <strong>{items.length} {items.length === 1 ? "style" : "styles"}</strong>
                    <span className="badge">{totalPieces} {totalPieces === 1 ? "piece" : "pieces"}</span>
                  </div>

                  {items.map((item, index) => (
                    <div key={`${item.productId}-${item.size}`} className="el-row">
                      {item.image && <img src={item.image} alt={item.title} />}

                      <div className="el-row-info">
                        <strong>{item.title}</strong>
                        <small>{[item.size, item.sku].filter(Boolean).join(" / ")}</small>
                      </div>

                      <div className="el-stepper">
                        <button
                          type="button"
                          onClick={() => changeQuantity(index, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => changeQuantity(index, e.target.value)}
                          aria-label="Quantity"
                        />
                        <button
                          type="button"
                          onClick={() => changeQuantity(index, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="el-remove"
                        onClick={() => removeItem(index)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <form className="card el-card" onSubmit={submit} style={{ marginTop: 22 }}>
                  <p className="eyebrow el-form-title">Your details</p>
                  <div className="el-form">
                    {[
                      ["customerName", "Name"],
                      ["businessName", "Business name"],
                      ["phone", "Phone"],
                      ["email", "Email"],
                      ["city", "City"],
                    ].map(([key, label]) => (
                      <div className="field" key={key}>
                        <label htmlFor={key}>{label}{key !== "businessName" && " *"}</label>
                        <input
                          id={key}
                          className="input"
                          required={key !== "businessName"}
                          placeholder={label}
                          type={key === "email" ? "email" : "text"}
                          value={form[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        />
                      </div>
                    ))}

                    <div className="field el-field-full">
                      <label htmlFor="message">Requirement details</label>
                      <textarea
                        id="message"
                        className="textarea"
                        rows={4}
                        placeholder="Tell us about your requirement"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <button className="btn btn-primary el-submit" disabled={submitting}>
                      {submitting && <span className="el-spinner" />}
                      {submitting ? "Sending..." : "Send Enquiry"}
                    </button>
                  </div>
                </form>
              </>
            )
          )}
        </div>
      </main>
    </>
  );
}
