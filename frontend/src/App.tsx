import { useState, useEffect } from "react";
import { ChevronLeft, Headphones, Package, ShieldCheck } from "lucide-react";
import ProductOverview, { type ProductData } from "./components/ProductOverview";
import ReviewList from "./components/ReviewList";
import AntiDeceptionFilter from "./components/AntiDeceptionFilter";
import Home from "./components/Home";
import OrderTracking from "./components/OrderTracking";
import PostPurchaseAssistant from "./components/PostPurchaseAssistant";
import mockData from "./data/mockProduct.json";

function App() {
  const [currentView, setCurrentView] = useState<"home" | "analysis" | "tracking" | "support">("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.view === "analysis") {
        setSelectedProductId(state.productId);
        setCurrentView("analysis");
      } else if (state && state.view === "tracking") {
        setCurrentView("tracking");
      } else if (state && state.view === "support") {
        setCurrentView("support");
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    
    if (!window.history.state) {
      window.history.replaceState({ view: "home" }, "", "");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView("analysis");
    window.history.pushState({ view: "analysis", productId: id }, "", `#analysis-${id}`);
  };

  const handleGoHome = () => {
    setCurrentView("home");
    window.history.pushState({ view: "home" }, "", "#");
  };

  const handleGoTracking = () => {
    setCurrentView("tracking");
    window.history.pushState({ view: "tracking" }, "", "#tracking");
  };

  const handleGoSupport = () => {
    setCurrentView("support");
    window.history.pushState({ view: "support" }, "", "#support");
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
            onClick={handleGoHome}
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
              <ShieldCheck style={{ width: 16, height: 16, color: "#fff" }} />
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
              Temu<span style={{ color: "#FF6B2B" }}>Guard</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {currentView === "analysis" && (
              <button
                onClick={handleGoHome}
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
            
            {currentView !== "support" && (
              <button
                onClick={handleGoSupport}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 9,
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,107,43,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,107,43,0.25)";
                  e.currentTarget.style.color = "#FF6B2B";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.78)";
                }}
              >
                <Headphones style={{ width: 14, height: 14 }} />
                Soporte IA
              </button>
            )}

            {currentView !== "tracking" && (
              <button
                onClick={handleGoTracking}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "linear-gradient(135deg, #FF6B2B 0%, #E55820 100%)",
                  border: "none",
                  borderRadius: 9,
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 16px rgba(255,107,43,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,43,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,107,43,0.3)";
                }}
              >
                <Package style={{ width: 14, height: 14 }} />
                Mis Pedidos
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
          ) : currentView === "tracking" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <OrderTracking />
            </div>
          ) : currentView === "support" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PostPurchaseAssistant />
            </div>
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

        <footer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: 48,
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontFamily: "Outfit, sans-serif",
            gap: 12,
          }}
          className="sm:flex-row"
        >
          <div>
            &copy; {new Date().getFullYear()} Temu<span style={{ color: "#FF6B2B", fontWeight: 600 }}>Guard</span>. Todos los derechos reservados.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Empresa y Consumidor</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span>Prototipo IA</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
