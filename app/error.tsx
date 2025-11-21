"use client";

import { ReactNode, useEffect, useState } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 40, textAlign: "center" }}>
          <h1>Something went wrong!</h1>
          <p>We're a little embarrassed. Try refreshing the page.</p>

          <button
            onClick={() => reset()}
            style={{ margin: "20px", padding: "10px 20px" }}
          >
            Try again
          </button>

          <button
            onClick={() => setShowDetails((v) => !v)}
            style={{ margin: "20px" }}
          >
            {showDetails ? "Hide" : "Show"} technical details
          </button>

          {showDetails && (
            <pre
              style={{
                textAlign: "left",
                maxWidth: "640px",
                margin: "20px auto",
                color: "red",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {error.message}
              <br />
              {error.stack}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
