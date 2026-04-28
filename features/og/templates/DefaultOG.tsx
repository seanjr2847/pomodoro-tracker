import { siteConfig } from "@/config/site";

export function DefaultOG({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: siteConfig.theme.gradient,
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: "24px",
          padding: "60px 80px",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title ?? siteConfig.name}
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            marginTop: "16px",
            lineHeight: 1.4,
          }}
        >
          {description ?? siteConfig.description}
        </p>
        <p
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "24px",
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </div>
  );
}
