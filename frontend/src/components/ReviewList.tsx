import { Star, ThumbsUp, BadgeCheck } from "lucide-react";

export interface ReviewData {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpfulVotes?: number;
  verifiedPurchase: boolean;
}

interface ReviewListProps {
  reviews: ReviewData[];
}

const AVATAR_PALETTES = [
  ["#FF6B2B", "#1A1208"],
  ["#4ade80", "#0A1A0E"],
  ["#818cf8", "#0F0E1A"],
  ["#f472b6", "#1A0D14"],
  ["#38bdf8", "#0A1218"],
  ["#fb923c", "#1A1008"],
  ["#a78bfa", "#110E1A"],
  ["#34d399", "#0A1812"],
];

function ratingAccent(rating: number) {
  if (rating >= 4) return { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.15)" };
  if (rating >= 3) return { color: "#FFB347", bg: "rgba(255,179,71,0.08)", border: "rgba(255,179,71,0.15)" };
  return { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.15)" };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
  }));

  return (
    <div
      className="card-premium"
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Header with rating summary */}
      <div
        style={{
          padding: "20px 22px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#EEEEF5",
            margin: "0 0 14px",
            letterSpacing: "-0.01em",
          }}
        >
          Reseñas de la comunidad
          <span
            style={{
              marginLeft: 8,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {reviews.length}
          </span>
        </h2>

        {/* Rating summary row */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Big average */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 40,
                color: "#EEEEF5",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {avgRating.toFixed(1)}
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 6, justifyContent: "center" }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    color: "#FF6B2B",
                    fill: i < Math.round(avgRating) ? "#FF6B2B" : "transparent",
                    opacity: i < Math.round(avgRating) ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Distribution bars */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {dist.map(({ star, count, pct }) => (
              <div
                key={star}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    width: 8,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {star}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 99,
                      background:
                        star >= 4 ? "#4ade80" : star === 3 ? "#FFB347" : "#f87171",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", width: 16, flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "12px 16px 20px" }}
        className="custom-scrollbar"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reviews.map((review, i) => {
            const accent = ratingAccent(review.rating);
            const palette = AVATAR_PALETTES[i % AVATAR_PALETTES.length];

            return (
              <div
                key={review.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  transition: "border-color 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 35%, ${palette[0]}40, ${palette[1]})`,
                      border: `1px solid ${palette[0]}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: palette[0],
                      flexShrink: 0,
                    }}
                  >
                    {review.user.charAt(0)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#DDDDE8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {review.user}
                      </span>
                      {review.verifiedPurchase && (
                        <BadgeCheck
                          style={{ width: 13, height: 13, color: "#4ade80", flexShrink: 0 }}
                        />
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                      {formatDate(review.date)}
                    </span>
                  </div>

                  {/* Star rating pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: accent.bg,
                      border: `1px solid ${accent.border}`,
                      borderRadius: 8,
                      padding: "3px 8px",
                      flexShrink: 0,
                    }}
                  >
                    <Star style={{ width: 10, height: 10, fill: accent.color, color: accent.color }} />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: accent.color,
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {review.rating}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#DDDDE8",
                    margin: "0 0 5px",
                    lineHeight: 1.3,
                  }}
                >
                  {review.title}
                </p>

                {/* Content */}
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.42)",
                    lineHeight: 1.6,
                    margin: "0 0 10px",
                  }}
                >
                  {review.content}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 8,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {review.verifiedPurchase && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#4ade80",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Compra verificada
                    </span>
                  )}
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.22)",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.5)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.22)")
                    }
                  >
                    <ThumbsUp style={{ width: 11, height: 11 }} />
                    <span>{review.helpfulVotes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
