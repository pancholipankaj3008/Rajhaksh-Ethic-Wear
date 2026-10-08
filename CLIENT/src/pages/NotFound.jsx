import { Link } from "react-router-dom";

export function NotFound() {
  return <main className="page"><div className="container section"><div className="empty-state"><h1 className="display">404</h1><p className="subtitle" style={{ margin: "12px auto 20px" }}>This page is not part of the current collection.</p><Link className="btn btn-primary" to="/">Back Home</Link></div></div></main>;
}
