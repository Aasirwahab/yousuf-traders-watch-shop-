"use client";

import { useEffect } from "react";

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the whole document, so it must render its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#eef0ef",
          color: "#101416",
          fontFamily: "system-ui, sans-serif",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 400, letterSpacing: "-0.04em" }}>
            Something went wrong.
          </h1>
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, color: "#687276" }}>
            The page failed to load. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 28,
              height: 48,
              padding: "0 28px",
              borderRadius: 9999,
              border: "none",
              background: "#101416",
              color: "#fbfcfb",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
