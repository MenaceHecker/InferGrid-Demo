import { ImageResponse } from "next/og";

export const alt =
  "InferGrid — a distributed ML inference platform on Kubernetes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const stats = [
    ["699", "RPS async"],
    ["<100ms", "sync p95"],
    ["0", "failures"],
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#fafafa",
              color: "#0a0a0a",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            IG
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#fafafa", fontWeight: 600 }}>
            InferGrid
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.05,
              fontWeight: 700,
              color: "#fafafa",
              maxWidth: 900,
            }}
          >
            Distributed ML inference, built for production.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", maxWidth: 820 }}>
            Sync + async request paths, model-drift detection, and safe A/B
            rollouts on Kubernetes.
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {stats.map(([value, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "18px 28px",
                borderRadius: 16,
                border: "1px solid #27272a",
              }}
            >
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#3987e5" }}>
                {value}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
