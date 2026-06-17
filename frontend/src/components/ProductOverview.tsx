import { useState } from "react";
import { Star, Zap, Shield, Clock } from "lucide-react";
import type { ReviewData } from "./ReviewList";

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  totalReviews: number;
  description: string;
  images: string[];
  attributes: ProductAttribute[];
  reviews: ReviewData[];
}

interface ProductOverviewProps {
  product: ProductData;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const ratingColor =
    product.rating >= 4 ? "#4ade80" : product.rating >= 3 ? "#FFB347" : "#f87171";

  return (
    <div
      className="card-premium flex flex-col h-full overflow-y-auto custom-scrollbar"
      style={{ position: "relative" }}
    >
      {/* Image Hero */}
      <div className="relative flex-shrink-0">
        <div
          className="w-full overflow-hidden rounded-t-[20px]"
          style={{ aspectRatio: "4 / 3", position: "relative", background: "#0d0d10", maxHeight: 340 }}
        >
          <img
            src={product.images[activeImageIndex]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.4s ease, transform 0.6s ease",
            }}
          />

          {/* Bottom gradient fade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, #131316 0%, rgba(19,19,22,0.4) 45%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Discount badge */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "linear-gradient(135deg, #FF6B2B, #FFB347)",
              borderRadius: 10,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Zap style={{ width: 12, height: 12, color: "#fff" }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "Outfit, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              -{product.discountPercentage}%
            </span>
          </div>

          {/* Rating badge */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "rgba(10,10,11,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              backdropFilter: "blur(12px)",
            }}
          >
            <Star style={{ width: 11, height: 11, fill: ratingColor, color: ratingColor }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ratingColor }}>
              {product.rating}
            </span>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 16px",
            background: "#131316",
          }}
        >
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              style={{
                flex: 1,
                aspectRatio: "1 / 1",
                borderRadius: 10,
                overflow: "hidden",
                border: `2px solid ${activeImageIndex === idx ? "#FF6B2B" : "rgba(255,255,255,0.06)"}`,
                opacity: activeImageIndex === idx ? 1 : 0.45,
                transition: "all 0.25s ease",
                cursor: "pointer",
                padding: 0,
                background: "transparent",
              }}
            >
              <img
                src={img}
                alt={`View ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "4px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Stars row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  width: 13,
                  height: 13,
                  color: "#FF6B2B",
                  fill: i < Math.floor(product.rating) ? "#FF6B2B" : "transparent",
                  opacity: i < Math.floor(product.rating) ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            {product.totalReviews.toLocaleString()} reseñas
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 17,
            color: "#EEEEF5",
            lineHeight: 1.3,
            margin: "0 0 14px",
            letterSpacing: "-0.01em",
          }}
        >
          {product.name}
        </h1>

        {/* Price block */}
        <div
          style={{
            marginBottom: 14,
            padding: "14px 16px",
            background: "rgba(255,107,43,0.06)",
            border: "1px solid rgba(255,107,43,0.15)",
            borderRadius: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 800,
                  fontSize: 30,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                ${product.price}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                  textDecoration: "line-through",
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                ${product.originalPrice}
              </span>
            </div>
            <span
              style={{
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 6,
                padding: "4px 9px",
                whiteSpace: "nowrap",
              }}
            >
              Ahorras ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65,
            margin: "0 0 20px",
          }}
        >
          {product.description}
        </p>

        {/* Spec grid */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <Shield style={{ width: 13, height: 13, color: "rgba(255,255,255,0.3)" }} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Especificaciones
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {product.attributes.map((attr, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  {attr.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#DDDDE8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {attr.value}
                </div>
              </div>
            ))}

            {/* Battery extra pill */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Clock style={{ width: 13, height: 13, color: "#FFB347" }} />
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 2,
                  }}
                >
                  Batería
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#DDDDE8" }}>5-7 días</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
