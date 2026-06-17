import { useState } from "react";
import { ChevronLeft, ScanLine } from "lucide-react";
import ProductOverview, { type ProductData } from "./components/ProductOverview";
import ReviewList from "./components/ReviewList";
import AntiDeceptionFilter from "./components/AntiDeceptionFilter";
import Home from "./components/Home";
import mockData from "./data/mockProduct.json";

function App() {
  const [currentView, setCurrentView] = useState<"home" | "analysis">("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView("analysis");
  };

  const typedMockData = mockData as unknown as { products: ProductData[] };
  const product = typedMockData.products.find((p) => p.id === selectedProductId) || typedMockData.products[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0B",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "fixed",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,107,43,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            marginBottom: 24,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => setCurrentView("home")}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(135deg, #FF6B2B, #E55820)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(255,107,43,0.35)",
              }}
            >
              <ScanLine style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.02em",
                color: "#EEEEF5",
              }}
            >
              Temu<span style={{ color: "#FF6B2B" }}>Filter</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {currentView === "analysis" && (
              <button
                onClick={() => setCurrentView("home")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 9,
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} />
                Nueva búsqueda
              </button>
            )}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.2)",
                display: "none",
              }}
              className="sm:block"
            >
              PROTOTIPO v1.0
            </div>
          </div>
        </header>

        <main>
          {currentView === "home" ? (
            <Home onAnalyze={handleSelectProduct} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)] lg:min-h-[650px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Product Info (25%) */}
              <div className="lg:col-span-3 h-[500px] lg:h-full overflow-hidden">
                <ProductOverview product={product} />
              </div>

              {/* Middle Column: AI Filter Dashboard (42%) */}
              <div className="lg:col-span-5 h-[500px] lg:h-full overflow-hidden">
                <AntiDeceptionFilter key={product.id} product={product} />
              </div>

              {/* Right Column: Raw Reviews (33%) */}
              <div className="lg:col-span-4 h-[500px] lg:h-full overflow-hidden">
                <ReviewList reviews={product.reviews} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
