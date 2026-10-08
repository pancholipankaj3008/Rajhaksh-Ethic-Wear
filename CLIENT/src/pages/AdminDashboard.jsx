import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  LogOut,
  Plus,
  LayoutDashboard,
  Shirt,
  Tags,
  MessageSquare,
  Users,
  Pencil,
  Trash2,
  Search,
  ImageOff,
  Menu,
  X,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  Eye,
  UserRound,
  Eye as EyeIcon,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";
import API from "../api/axios";
import AdminProductForm, {
  buildProductForm,
  createEmptyProduct,
  productToForm,
} from "../components/admin/AdminProductForm";
import { Logout } from "../features/auth/authThunk";
import { useAppDispatch } from "../hooks/reduxHooks";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "enquiries", label: "Enquiries", icon: MessageSquare },
  { key: "users", label: "Users", icon: Users },
  { key: "profile", label: "Profile", icon: UserRound },
];

const ENQUIRY_STATUSES = ["pending", "contacted", "completed", "cancelled"];

const STATUS_TONE = {
  pending: { bg: "#fef3c7", fg: "#92400e", dot: "#d97706" },
  contacted: { bg: "#dbeafe", fg: "#1e40af", dot: "#2563eb" },
  completed: { bg: "#d1fae5", fg: "#065f46", dot: "#059669" },
  cancelled: { bg: "#fee2e2", fg: "#991b1b", dot: "#dc2626" },
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", isActive: true });
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productStatus, setProductStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [message, setMessage] = useState("");
  const setError = (value) => {
    if (value) toast.error(value);
  };
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const cancelConfirmationRef = useRef(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const confirmAction = (config) => setPendingConfirmation(config);
  const signOut = () => confirmAction({
    title: "Log out?",
    description: "You will need to sign in again to access the admin panel.",
    confirmLabel: "Log out",
    onConfirm: () => dispatch(Logout()),
  });

  useEffect(() => {
    if (!pendingConfirmation) return undefined;
    cancelConfirmationRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPendingConfirmation(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingConfirmation]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse, enquiryResponse, userResponse] = await Promise.all([
        API.get("/product/admin/all-products?limit=100&includeInactive=true"),
        API.get("/categories?includeInactive=true"),
        API.get("/enquiries"),
        API.get("/user/all-users"),
      ]);

      setProducts(productResponse.data.products || []);
      setCategories(categoryResponse.data.categories || []);
      setEnquiries(enquiryResponse.data.enquiries || []);
      setUsers(userResponse.data.users || []);
      const profileResponse = await API.get("/user/profile");
      setProfile({ name: profileResponse.data.user.name || "", phone: profileResponse.data.user.phone || "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load admin data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const closeProductForm = () => {
    setProductForm(null);
    setImageFiles([]);
    setEditingProductId(null);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSavingProduct(true);
    setError("");
    setMessage("");

    try {
      const formData = buildProductForm(productForm, imageFiles);
      const response = editingProductId
        ? await API.put(`/product/update-product/${editingProductId}`, formData)
        : await API.post("/product/add-product", formData);

      setMessage(response.data.message || "Product saved successfully.");
      closeProductForm();
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save product."));
    } finally {
      setSavingProduct(false);
    }
  };

  const deactivateProduct = async (id) => {
    const product = products.find((item) => item._id === id);
    confirmAction({
      title: "Deactivate product?",
      description: `“${product?.title || "This product"}” will be removed from the active catalog.`,
      confirmLabel: "Deactivate",
      onConfirm: async () => {
        setError("");
        try {
          const response = await API.delete(`/product/delete-product/${id}`);
          setMessage(response.data.message || "Product deactivated.");
          await loadDashboard();
        } catch (requestError) { setError(getErrorMessage(requestError, "Unable to deactivate product.")); }
      },
    });
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setSavingCategory(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("description", categoryForm.description);
      formData.append("isActive", categoryForm.isActive);
      if (categoryImage) formData.append("image", categoryImage);
      const response = editingCategoryId
        ? await API.put(`/categories/${editingCategoryId}`, formData)
        : await API.post("/categories", formData);
      setMessage(response.data.message || "Category saved successfully.");
      setCategoryForm({ name: "", description: "", isActive: true });
      setCategoryImage(null);
      setEditingCategoryId(null);
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save category."));
    } finally {
      setSavingCategory(false);
    }
  };

  const startCategoryEdit = (category) => {
    setCategoryForm({ name: category.name, description: category.description || "", isActive: category.isActive });
    setCategoryImage(null);
    setEditingCategoryId(category._id);
    setError("");
    setMessage("");
  };

  const cancelCategoryEdit = () => {
    setCategoryForm({ name: "", description: "", isActive: true });
    setCategoryImage(null);
    setEditingCategoryId(null);
  };

  const deleteCategory = async (category) => {
    confirmAction({
      title: "Delete category?",
      description: `Delete “${category.name}”? Categories with active products will be deactivated instead.`,
      confirmLabel: "Delete category",
      onConfirm: async () => {
        setError("");
        setMessage("");
        try {
          const response = await API.delete(`/categories/${category._id}`);
          setMessage(response.data.message || "Category deleted successfully.");
          if (editingCategoryId === category._id) cancelCategoryEdit();
          await loadDashboard();
        } catch (requestError) { setError(getErrorMessage(requestError, "Unable to delete category.")); }
      },
    });
  };

  const updateEnquiryStatus = async (id, status) => {
    setError("");

    try {
      await API.put(`/enquiries/${id}`, { status });
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update enquiry status."));
    }
  };

  const openEnquiry = async (id) => {
    setError("");
    try {
      const response = await API.get(`/enquiries/${id}`);
      setSelectedEnquiry(response.data.enquiry);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to open enquiry."));
    }
  };

  const deleteEnquiry = async (enquiry) => {
    confirmAction({
      title: "Delete enquiry?",
      description: `The enquiry from ${enquiry.customerName} will be permanently removed.`,
      confirmLabel: "Delete enquiry",
      onConfirm: async () => {
        try {
          await API.delete(`/enquiries/${enquiry._id}`);
          setSelectedEnquiry(null);
          setMessage("Enquiry deleted successfully.");
          await loadDashboard();
        } catch (requestError) { setError(getErrorMessage(requestError, "Unable to delete enquiry.")); }
      },
    });
  };

  const saveAdminProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await API.put("/user/update-profile", profile);
      setMessage(response.data.message || "Profile updated.");
    } catch (requestError) { setError(getErrorMessage(requestError, "Unable to update profile.")); }
  };

  const changeAdminPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (passwordForm.newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      const response = await API.put("/user/change-password", passwordForm);
      setMessage(response.data.message || "Password changed.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setConfirmNewPassword("");
    } catch (requestError) { setError(getErrorMessage(requestError, "Unable to change password.")); }
    finally { setChangingPassword(false); }
  };

  const pendingEnquiries = enquiries.filter((enquiry) => enquiry.status === "pending").length;
  const visibleProducts = products.filter((product) => {
    const search = productSearch.trim().toLowerCase();
    const matchesSearch = !search || [product.title, product.sku, product.category].some((value) => String(value || "").toLowerCase().includes(search));
    const matchesCategory = !productCategory || product.category === productCategory;
    const matchesStatus = productStatus === "all" || (productStatus === "active" ? product.isActive : !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeTabInfo = TABS.find((t) => t.key === tab);

  const goToTab = (key) => {
    setTab(key);
    setNavOpen(false);
  };

  return (
    <>
      <style>{`
        .crm {
          --crm-bg: #faf8f5;
          --crm-sidebar: #0a0a0a;
          --crm-sidebar-hover: #1d1b18;
          --crm-accent: #b79a65;
          --crm-accent-soft: #f6efe3;
          --crm-border: #e8e5de;
          --crm-text: #0a0a0a;
          --crm-muted: #74706b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "DM Sans", sans-serif;
          background:
            radial-gradient(circle at 92% 2%, rgba(183, 154, 101, 0.14), transparent 28rem),
            var(--crm-bg);
          min-height: 100vh;
          color: var(--crm-text);
          display: grid;
          grid-template-columns: 232px 1fr;
        }

        .crm * { box-sizing: border-box; }
        .crm-spin { animation: crm-spin 900ms linear infinite; }
        @keyframes crm-spin { to { transform: rotate(360deg); } }
        .crm-confirm-backdrop { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: 18px; background: rgba(16, 14, 11, .52); backdrop-filter: blur(3px); }
        .crm-confirm-card { width: min(420px, 100%); padding: 24px; border: 1px solid var(--crm-border); border-radius: 16px; background: #fff; box-shadow: 0 24px 80px #0003; animation: crm-confirm-in 160ms ease-out; }
        @keyframes crm-confirm-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* SIDEBAR */
        .crm-sidebar {
          background: var(--crm-sidebar);
          color: #e5e7eb;
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
        }

        .crm-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px 22px;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 14px;
        }

        .crm-logo-badge {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--crm-accent);
          display: grid;
          place-items: center;
          flex: none;
        }

        .crm-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .crm-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          border: none;
          background: transparent;
          color: #9ca3af;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease;
        }

        .crm-nav-item:hover {
          background: var(--crm-sidebar-hover);
          color: #fff;
        }

        .crm-nav-item.active {
          background: var(--crm-accent);
          color: #fff;
        }

        .crm-sidebar-foot {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .crm-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: none;
          background: transparent;
          color: #9ca3af;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
        }

        .crm-logout:hover {
          background: var(--crm-sidebar-hover);
          color: #fff;
        }

        /* MAIN */
        .crm-main {
          padding: 22px 28px 60px;
          min-width: 0;
        }

        .crm-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .crm-crumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--crm-muted);
          margin-bottom: 4px;
        }

        .crm-h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .crm-mobile-toggle {
          display: none;
        }

        /* CARDS */
        .crm-card {
          background: #fff;
          border: 1px solid var(--crm-border);
          border-radius: 10px;
        }

        .crm-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 22px;
        }

        .crm-stat {
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .crm-stat-label {
          font-size: 12px;
          color: var(--crm-muted);
          font-weight: 500;
          margin: 0 0 8px;
        }

        .crm-stat-num {
          font-size: 26px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .crm-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          flex: none;
        }

        /* ALERTS */
        .crm-alert {
          padding: 11px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid transparent;
        }

        .crm-alert-error { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
        .crm-alert-success { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }

        /* BUTTONS */
        .crm-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 8px;
          border: 1px solid var(--crm-border);
          background: #fff;
          color: var(--crm-text);
          font-size: 13px;
          font-weight: 600;
          padding: 0 14px;
          min-height: 36px;
          cursor: pointer;
          transition: background 150ms ease, border-color 150ms ease;
          white-space: nowrap;
        }

        .crm-btn:hover { background: #f9fafb; }

        .crm-btn-primary {
          background: var(--crm-accent);
          border-color: var(--crm-accent);
          color: #fff;
        }

        .crm-btn-primary:hover { background: #4338ca; }

        .crm-btn-danger {
          color: #dc2626;
          border-color: #fecaca;
        }

        .crm-btn-danger:hover { background: #fef2f2; }

        .crm-btn-sm {
          min-height: 30px;
          padding: 0 10px;
          font-size: 12px;
        }

        /* TOOLBAR / FILTERS */
        .crm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .crm-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .crm-search {
          position: relative;
        }

        .crm-search svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--crm-muted);
        }

        .crm-input,
        .crm-select {
          width: 100%;
          border: 1px solid var(--crm-border);
          background: #fff;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13.5px;
          color: var(--crm-text);
          outline: none;
          font-family: inherit;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .crm-input:focus,
        .crm-select:focus {
          border-color: var(--crm-accent);
          box-shadow: 0 0 0 3px var(--crm-accent-soft);
        }

        .crm-search .crm-input {
          padding-left: 34px;
        }

        /* TABLE */
        .crm-table-wrap {
          overflow-x: auto;
        }

        .crm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        .crm-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--crm-muted);
          padding: 12px 16px;
          border-bottom: 1px solid var(--crm-border);
          background: #fafafa;
        }

        .crm-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--crm-border);
          font-size: 13.5px;
          vertical-align: middle;
        }

        .crm-table tr:last-child td { border-bottom: none; }
        .crm-table tbody tr:hover { background: #fafafa; }

        .crm-cell-title { font-weight: 600; }
        .crm-cell-sub { font-size: 12px; color: var(--crm-muted); }

        .crm-thumb {
          width: 38px;
          height: 46px;
          border-radius: 6px;
          object-fit: cover;
          display: block;
          background: #f3f4f6;
        }

        .crm-thumb-empty {
          width: 38px;
          height: 46px;
          border-radius: 6px;
          background: #f3f4f6;
          display: grid;
          place-items: center;
          color: #9ca3af;
        }

        .crm-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .crm-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .crm-row-actions {
          display: flex;
          gap: 6px;
        }

        .crm-status-select {
          border: none;
          border-radius: 999px;
          padding: 5px 10px 5px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .crm-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--crm-muted);
          font-size: 13.5px;
        }

        /* CATEGORY GRID */
        .crm-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .crm-cat-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .crm-cat-avatar {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid var(--crm-border);
        }

        .crm-cat-avatar-empty {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          background: #f3f4f6;
          display: grid;
          place-items: center;
        }

        .crm-cat-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
          align-items: end;
          padding: 16px;
          margin-bottom: 18px;
        }

        .crm-field { display: flex; flex-direction: column; gap: 6px; }
        .crm-field label {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--crm-muted);
        }

        .crm-mobile-nav {
          display: none;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .crm-stats { grid-template-columns: repeat(3, 1fr); }
          .crm-cat-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 900px) {
          .crm {
            grid-template-columns: 1fr;
          }

          .crm-sidebar { display: none; }

          .crm-mobile-toggle {
            display: inline-flex;
          }

          .crm-mobile-nav {
            display: none;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            background: #fff;
            border: 1px solid var(--crm-border);
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 18px;
          }

          .crm-mobile-nav.open { display: grid; }

          .crm-mobile-nav .crm-nav-item {
            color: var(--crm-text);
            justify-content: center;
          }

          .crm-mobile-nav .crm-nav-item:hover {
            background: #f3f4f6;
            color: var(--crm-text);
          }

          .crm-mobile-nav .crm-nav-item.active {
            background: var(--crm-accent);
            color: #fff;
          }

          .crm-main { padding: 18px 16px 50px; }
          .crm-stats { grid-template-columns: repeat(2, 1fr); }
          .crm-cat-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 560px) {
          .crm-stats { grid-template-columns: 1fr 1fr; }
          .crm-cat-grid { grid-template-columns: 1fr; }
          .crm-h1 { font-size: 19px; }
          .crm-toolbar { flex-direction: column; align-items: stretch; }
          .crm-toolbar > * { width: 100%; }
        }
      `}</style>

      <div className="crm">
        {/* SIDEBAR (desktop) */}
        <aside className="crm-sidebar">
          <div className="crm-logo">
            <span className="crm-logo-badge"><Shirt size={16} color="#fff" /></span>
            RAJ HAKSH Admin
          </div>

          <nav className="crm-nav">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`crm-nav-item ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>

          <div className="crm-sidebar-foot">
            <button className="crm-logout" onClick={signOut}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="crm-main">
          <div className="crm-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                className="crm-btn crm-mobile-toggle"
                onClick={() => setNavOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {navOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <div>
                <div className="crm-crumb">
                  Admin <ChevronRight size={12} /> {activeTabInfo?.label}
                </div>
                <h1 className="crm-h1">{activeTabInfo?.label}</h1>
              </div>
            </div>

            <button className="crm-btn crm-mobile-toggle" style={{ display: "none" }} />
            <button className="crm-btn" onClick={signOut}>
              <LogOut size={15} /> Logout
            </button>
          </div>

          <nav className={`crm-mobile-nav ${navOpen ? "open" : ""}`}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`crm-nav-item ${tab === key ? "active" : ""}`}
                onClick={() => goToTab(key)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>

          {message && <div className="crm-alert crm-alert-success">{message}</div>}

          {loading && <div className="crm-card" style={{ padding: 24, textAlign: "center", color: "var(--crm-muted)" }}>Loading dashboard...</div>}

          {!loading && tab === "dashboard" && (
            <div className="crm-stats">
              {[
                ["Products", products.length, Package, "#4f46e5", "#eef2ff"],
                ["Active products", products.filter((p) => p.isActive).length, CheckCircle2, "#059669", "#ecfdf5"],
                ["Categories", categories.length, Tags, "#d97706", "#fffbeb"],
                ["Pending enquiries", pendingEnquiries, Clock, "#dc2626", "#fef2f2"],
                ["Customers", users.filter((u) => u.role === "customer").length, Users, "#2563eb", "#eff6ff"],
              ].map(([label, value, Icon, color, soft]) => (
                <div className="crm-card crm-stat" key={label}>
                  <div>
                    <p className="crm-stat-label">{label}</p>
                    <p className="crm-stat-num">{value}</p>
                  </div>
                  <div className="crm-stat-icon" style={{ background: soft }}>
                    <Icon size={18} color={color} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && tab === "dashboard" && (
            <>
              <div className="crm-toolbar">
                <span className="crm-cell-sub">{visibleProducts.length} of {products.length} products</span>
                <button
                  className="crm-btn crm-btn-primary"
                  onClick={() => { setProductForm(createEmptyProduct()); setEditingProductId(null); }}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {productForm && (
                <div style={{ marginBottom: 20 }}>
                  <AdminProductForm
                    productForm={productForm}
                    setProductForm={setProductForm}
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    editingId={editingProductId}
                    loading={savingProduct}
                    onSubmit={saveProduct}
                    onClose={closeProductForm}
                  />
                </div>
              )}

              <div className="crm-card crm-filters">
                <div className="crm-search">
                  <Search size={14} />
                  <input
                    className="crm-input"
                    placeholder="Search title, SKU..."
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                  />
                </div>
                <select className="crm-select" value={productCategory} onChange={(event) => setProductCategory(event.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <select className="crm-select" value={productStatus} onChange={(event) => setProductStatus(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="crm-card crm-table-wrap">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Wholesale Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="crm-thumb" />
                          ) : (
                            <span className="crm-thumb-empty"><ImageOff size={14} /></span>
                          )}
                        </td>
                        <td>
                          <div className="crm-cell-title">{product.title}</div>
                          <div className="crm-cell-sub">{product.sku}</div>
                        </td>
                        <td>{product.category}</td>
                        <td>{formatINR(product.wholesalePrice)}</td>
                        <td>
                          <span
                            className="crm-pill"
                            style={product.isActive
                              ? { background: "#d1fae5", color: "#065f46" }
                              : { background: "#f3f4f6", color: "#6b7280" }}
                          >
                            <span className="crm-pill-dot" style={{ background: product.isActive ? "#059669" : "#9ca3af" }} />
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="crm-row-actions">
                            <button
                              className="crm-btn crm-btn-sm"
                              onClick={() => { setProductForm(productToForm(product)); setEditingProductId(product._id); }}
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button className="crm-btn crm-btn-sm crm-btn-danger" onClick={() => deactivateProduct(product._id)}>
                              <Trash2 size={12} /> Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!visibleProducts.length && (
                      <tr>
                        <td colSpan="6" className="crm-empty">No products match these filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && tab === "categories" && (
            <>
              <form className="crm-card crm-cat-form" onSubmit={saveCategory}>
                <div className="crm-field">
                  <label>Name</label>
                  <input
                    className="crm-input"
                    required
                    placeholder="Category name"
                    value={categoryForm.name}
                    onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
                  />
                </div>
                <div className="crm-field">
                  <label>Description</label>
                  <input
                    className="crm-input"
                    placeholder="Description"
                    value={categoryForm.description}
                    onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
                  />
                </div>
                <div className="crm-field">
                  <label>Image</label>
                  <input
                    className="crm-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => setCategoryImage(event.target.files?.[0] || null)}
                  />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, paddingBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(event) => setCategoryForm({ ...categoryForm, isActive: event.target.checked })}
                  />
                  Active
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="crm-btn crm-btn-primary" disabled={savingCategory}>
                    {savingCategory ? "Saving..." : editingCategoryId ? "Update" : "Add Category"}
                  </button>
                  {editingCategoryId && (
                    <button type="button" className="crm-btn" onClick={cancelCategoryEdit}>Cancel</button>
                  )}
                </div>
              </form>

              <div className="crm-cat-grid">
                {categories.map((category) => (
                  <div className="crm-card crm-cat-card" key={category._id}>
                    {category.image ? (
                      <img src={category.image} alt="" className="crm-cat-avatar" />
                    ) : (
                      <div className="crm-cat-avatar-empty">
                        <Tags size={18} color="#9ca3af" />
                      </div>
                    )}
                    <strong style={{ fontSize: 14 }}>{category.name}</strong>
                    {category.description && (
                      <span className="crm-cell-sub">{category.description}</span>
                    )}
                    <span
                      className="crm-pill"
                      style={category.isActive
                        ? { background: "#d1fae5", color: "#065f46", width: "fit-content" }
                        : { background: "#f3f4f6", color: "#6b7280", width: "fit-content" }}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button" className="crm-btn crm-btn-sm" onClick={() => startCategoryEdit(category)}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button type="button" className="crm-btn crm-btn-sm crm-btn-danger" onClick={() => deleteCategory(category)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!categories.length && (
                  <div className="crm-card crm-empty" style={{ gridColumn: "1 / -1" }}>
                    No categories yet. Add your first one above.
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && tab === "enquiries" && (
            <div className="crm-card crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td>
                        <div className="crm-cell-title">{enquiry.customerName}</div>
                        <div className="crm-cell-sub">{enquiry.businessName}</div>
                      </td>
                      <td>
                        {enquiry.phone}
                        <div className="crm-cell-sub">{enquiry.email}</div>
                      </td>
                      <td>{enquiry.items?.map((item) => `${item.productSnapshot?.title} (${item.quantity})`).join(", ")}</td>
                      <td>
                        <select
                          className="crm-status-select"
                          value={enquiry.status}
                          onChange={(event) => updateEnquiryStatus(enquiry._id, event.target.value)}
                          style={{
                            background: STATUS_TONE[enquiry.status]?.bg,
                            color: STATUS_TONE[enquiry.status]?.fg,
                          }}
                        >
                          {ENQUIRY_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td><div className="crm-row-actions">
                        <button className="crm-btn crm-btn-sm" onClick={() => openEnquiry(enquiry._id)}><Eye size={12} /> Open</button>
                        <button className="crm-btn crm-btn-sm crm-btn-danger" onClick={() => deleteEnquiry(enquiry)}><Trash2 size={12} /> Delete</button>
                      </div></td>
                    </tr>
                  ))}
                  {!enquiries.length && (
                    <tr><td colSpan="5" className="crm-empty">No enquiries yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && tab === "profile" && <div style={{ display: "grid", gap: 16, maxWidth: 680 }}>
            <form className="crm-card" style={{ padding: 20, display: "grid", gap: 12 }} onSubmit={saveAdminProfile}>
              <h2 style={{ margin: 0, fontSize: 17 }}>Manage profile</h2>
              <label className="crm-field">Name<input className="crm-input" required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
              <label className="crm-field">Phone<input className="crm-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
              <button className="crm-btn crm-btn-primary">Save profile</button>
            </form>
            <form className="crm-card" style={{ padding: 0, overflow: "hidden", maxWidth: 520 }} onSubmit={changeAdminPassword}>
              <div style={{ padding: "20px 22px", color: "#fff", background: "linear-gradient(120deg, #17130e, #514129)", display: "flex", alignItems: "center", gap: 13 }}>
                <span style={{ width: 42, height: 42, borderRadius: 13, background: "#ffffff20", display: "grid", placeItems: "center" }}><LockKeyhole size={20} /></span>
                <div><h2 style={{ margin: 0, fontSize: 17 }}>Change password</h2><span style={{ color: "#e8dfd0", fontSize: 12 }}>Keep your admin account secure</span></div>
              </div>
              <div style={{ padding: 22, display: "grid", gap: 16 }}>
                <label className="crm-field">Current password<div style={{ position: "relative" }}><input className="crm-input" style={{ paddingRight: 46 }} type={showCurrentPassword ? "text" : "password"} required autoComplete="current-password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Enter current password" /><button type="button" aria-label={showCurrentPassword ? "Hide current password" : "Show current password"} onClick={() => setShowCurrentPassword((visible) => !visible)} style={{ position: "absolute", right: 6, top: 4, height: 30, width: 34, border: 0, background: "transparent", color: "#777", cursor: "pointer" }}>{showCurrentPassword ? <EyeOff size={17} /> : <EyeIcon size={17} />}</button></div></label>
                <label className="crm-field">New password<div style={{ position: "relative" }}><input className="crm-input" style={{ paddingRight: 46 }} type={showNewPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="At least 6 characters" /><button type="button" aria-label={showNewPassword ? "Hide new password" : "Show new password"} onClick={() => setShowNewPassword((visible) => !visible)} style={{ position: "absolute", right: 6, top: 4, height: 30, width: 34, border: 0, background: "transparent", color: "#777", cursor: "pointer" }}>{showNewPassword ? <EyeOff size={17} /> : <EyeIcon size={17} />}</button></div><span style={{ color: "#777", fontSize: 11 }}>Use 6 or more characters.</span></label>
                <label className="crm-field">Confirm new password<input className="crm-input" type={showNewPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Enter new password again" /></label>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#777", fontSize: 12 }}><ShieldCheck size={15} color="#927441" /> Your current password is required to save this change.</div>
                <button className="crm-btn crm-btn-primary" disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !confirmNewPassword} style={{ minHeight: 42, gap: 8, opacity: changingPassword ? 0.75 : 1 }}>
                  {changingPassword ? <><LoaderCircle size={16} className="crm-spin" /> Updating password…</> : <><LockKeyhole size={15} /> Update password</>}
                </button>
              </div>
            </form>
          </div>}

          {selectedEnquiry && <div role="dialog" aria-modal="true" aria-label="Enquiry details" onClick={() => setSelectedEnquiry(null)} style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0008", display: "grid", placeItems: "center", padding: 16 }}>
            <section className="crm-card" onClick={(e) => e.stopPropagation()} style={{ background: "white", width: "min(760px, 100%)", maxHeight: "90vh", overflow: "auto", padding: 24, borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}><div><h2 style={{ margin: "0 0 6px" }}>{selectedEnquiry.customerName}</h2><div className="crm-cell-sub">{selectedEnquiry.businessName || "Individual enquiry"} · {selectedEnquiry.city}</div></div><button className="crm-btn" onClick={() => setSelectedEnquiry(null)}>Close</button></div>
              <p>{selectedEnquiry.email} · {selectedEnquiry.phone}</p><p>{selectedEnquiry.message || "No message provided."}</p>
              <h3>Requested items</h3><div style={{ display: "grid", gap: 12 }}>{selectedEnquiry.items?.map((item) => <div key={item._id} style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                {item.productSnapshot?.image || item.product?.images?.[0] ? <img src={item.productSnapshot?.image || item.product?.images?.[0]} alt={item.productSnapshot?.title || item.product?.title || "Product"} style={{ width: 88, height: 100, objectFit: "cover", borderRadius: 8 }} /> : <span className="crm-thumb-empty"><ImageOff size={18} /></span>}
                <div><strong>{item.productSnapshot?.title || item.product?.title || "Product"}</strong><div className="crm-cell-sub">SKU {item.selection?.sku || item.product?.sku || "—"} · Size {item.selection?.size || "—"} · Qty {item.quantity}</div><div className="crm-cell-sub">{formatINR(item.productSnapshot?.wholesalePrice)}</div></div>
              </div>)}</div>
            </section>
          </div>}

          {pendingConfirmation && <div className="crm-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingConfirmation(null); }}>
            <section className="crm-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="crm-confirm-title" aria-describedby="crm-confirm-description">
              <div style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center", color: "#b45309", background: "#fff7ed", marginBottom: 16 }}><AlertTriangle size={21} /></div>
              <h2 id="crm-confirm-title" style={{ margin: "0 0 8px", fontSize: 19 }}>{pendingConfirmation.title}</h2>
              <p id="crm-confirm-description" style={{ margin: 0, color: "var(--crm-muted)", fontSize: 14, lineHeight: 1.6 }}>{pendingConfirmation.description}</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 24 }}>
                <button ref={cancelConfirmationRef} className="crm-btn" onClick={() => setPendingConfirmation(null)}>Cancel</button>
                <button className="crm-btn crm-btn-danger" onClick={() => { const action = pendingConfirmation.onConfirm; setPendingConfirmation(null); action(); }}>{pendingConfirmation.confirmLabel}</button>
              </div>
            </section>
          </div>}

          {!loading && tab === "users" && (
            <div className="crm-card crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="crm-cell-title">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="crm-pill" style={{ background: "#eef2ff", color: "#4338ca" }}>{user.role}</span>
                      </td>
                      <td>
                        <span
                          className="crm-pill"
                          style={user.isBlocked
                            ? { background: "#fee2e2", color: "#991b1b" }
                            : { background: "#d1fae5", color: "#065f46" }}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr><td colSpan="4" className="crm-empty">No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
