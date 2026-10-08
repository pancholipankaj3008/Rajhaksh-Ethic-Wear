import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClearMessage } from "../features/auth/authSlice";
import { GetProfile, Login, SignUp } from "../features/auth/authThunk";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

const emptyForm = { name: "", email: "", password: "" };

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, message, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const dashboardPath = (nextUser) => {
    if (nextUser?.role === "admin") return "/admin";
    return location.state?.from || "/";
  };

  useEffect(() => {
    if (isAuthenticated && user) navigate(dashboardPath(user), { replace: true });
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(ClearMessage());
    }
  }, [dispatch, message]);

  useEffect(() => {
    if (error) {
      setErrors((prev) => ({ ...prev, form: error }));
      dispatch(ClearMessage());
    }
  }, [dispatch, error]);

  const validate = () => {
    const next = {};
    if (mode === "signup" && !form.name.trim()) next.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Valid email is required";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const result = mode === "signup" ? await dispatch(SignUp(form)) : await dispatch(Login({ email: form.email, password: form.password }));
    if (SignUp.fulfilled.match(result)) {
      setMode("login");
      setForm(emptyForm);
    }
    if (Login.fulfilled.match(result)) {
      const profileResult = await dispatch(GetProfile());
      const nextUser = profileResult.payload?.user;
      navigate(dashboardPath(nextUser), { replace: true });
    }
  };

  return (
    <main className="page" style={{ display: "grid", gridTemplateColumns: "minmax(320px, 520px) 1fr", minHeight: "100vh" }}>
      <section style={{ display: "grid", alignContent: "center", padding: "48px min(8vw, 72px)" }}>
        <Link className="brand" to="/">RAJ HAKSH</Link>
        <div style={{ marginTop: 54 }}>
          <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: 4, marginBottom: 32 }}>
            {["login", "signup"].map((item) => (
              <button key={item} className={`btn ${mode === item ? "btn-primary" : "btn-soft"}`} type="button" onClick={() => setMode(item)}>
                {item === "login" ? "Sign In" : "Create"}
              </button>
            ))}
          </div>
          <span className="eyebrow">Member access</span>
          <h1 className="title" style={{ marginTop: 10 }}>{mode === "login" ? "Good to see you again." : "Create your RAJ HAKSH account."}</h1>
          <form onSubmit={submit} style={{ display: "grid", gap: 16, marginTop: 30 }}>
            {mode === "signup" && (
              <div className="field">
                <label>Full Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aryan Mehta" />
                {errors.name && <small className="field-error">{errors.name}</small>}
              </div>
            )}
            <div className="field">
              <label>Email Address</label>
              <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </div>
            <div className="field">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" />
                <button className="icon-btn" style={{ position: "absolute", top: 5, right: 5, width: 34, height: 34 }} type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <small className="field-error">{errors.password}</small>}
            </div>
            {errors.form && <small className="field-error">{errors.form}</small>}
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</button>
          
          </form>
        </div>
      </section>
      <section className="hero" style={{ minHeight: "100vh" }}>
        <div className="container hero-content">
          <div className="hero-panel">
            <span className="eyebrow">Private client wardrobe</span>
            <h2 className="display">Dress with intent.</h2>
          </div>
        </div>
      </section>
    </main>
  );
}
