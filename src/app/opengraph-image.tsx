import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so social shares never show a blank card.
 * Note: Satori requires explicit `display: flex` on any element with
 * more than one child — plain block layout is not supported.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0710 0%, #1c1224 55%, #130c18 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9a8fa8",
            marginBottom: 28,
          }}
        >
          Nashik, India · Available immediately
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#f5efe6",
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            TEJAS
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#e9be6c",
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            TARLE
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#c2416a", marginTop: 30 }}>
          Backend Engineer · Node.js · Payment Gateway Integrations
        </div>

        <div
          style={{
            display: "flex",
            gap: 44,
            marginTop: 52,
            fontSize: 24,
            color: "#9a8fa8",
          }}
        >
          <div style={{ display: "flex" }}>5 production systems</div>
          <div style={{ display: "flex", color: "#e9be6c" }}>3 payment gateways</div>
          <div style={{ display: "flex" }}>95% on-time delivery</div>
        </div>
      </div>
    ),
    size
  );
}
