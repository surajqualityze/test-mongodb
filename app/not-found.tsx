import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: "30px" }}>
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link
        href="/"
        style={{
          padding: "12px 28px",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
