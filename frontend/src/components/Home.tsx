import { Search, ArrowRight, ShieldCheck } from "lucide-react";
import mockData from "../data/mockProduct.json";
import type { ProductData } from "./ProductOverview";
import GradientBarsBackground from "./gradient-bars-background";

interface HomeProps {
  onAnalyze: (productId: string) => void;
}

export default function Home({ onAnalyze }: HomeProps) {
  const typedMockData = mockData as unknown as { products: ProductData[] };
  const { products } = typedMockData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to the first product if they submit the form
    onAnalyze(products[0].id);
  };

  return (
    <GradientBarsBackground
      backgroundColor="transparent"
      numBars={12}
      gradientFrom="rgba(255, 71, 0, 0.25)"
      gradientTo="rgba(255, 71, 0, 0.02)"
      animationDuration={4}
      className="min-h-[80vh] pt-10"
    >
      <div className="flex flex-col items-center w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-temu-orange/10 text-temu-orange text-sm font-semibold mb-6 border border-temu-orange/20">
            <ShieldCheck className="w-4 h-4" />
            Prototipo de Filtro IA
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Descubre la verdad detrás del <span className="text-transparent bg-clip-text bg-linear-to-r from-temu-orange to-yellow-500">marketing</span>.
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto px-4 font-body font-normal tracking-wide leading-relaxed">
            Pega el enlace de cualquier producto y nuestra IA analizará cientos de reseñas reales para revelarte si la calidad coincide con la publicidad.
          </p>

          {/* Search Bar (Disabled) */}
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto opacity-60 cursor-not-allowed px-4 sm:px-0">
            <div className="absolute inset-y-0 left-4 sm:left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              disabled
              className="block w-full py-3 pl-11 pr-24 sm:py-4 sm:pl-12 sm:pr-32 text-sm sm:text-base text-gray-400 bg-surface border-2 border-gray-800 rounded-xl cursor-not-allowed outline-none"
              placeholder="Pegar enlace (Función en desarrollo...)"
            />
            <button
              type="button"
              disabled
              className="absolute right-2 bottom-2 top-2 bg-gray-800 text-gray-500 font-bold rounded-lg px-3 sm:px-4 flex items-center gap-1 cursor-not-allowed text-xs sm:text-sm"
            >
              Analizar
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Featured Products */}
        <div className="w-full max-w-5xl mx-auto mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-300">Ejemplos para analizar</h3>
            <div className="h-px bg-gray-800 flex-1 ml-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div 
                key={p.id}
                onClick={() => onAnalyze(p.id)}
                className="bg-surface rounded-2xl p-4 border border-gray-800 hover:border-temu-orange cursor-pointer transition-all group hover:shadow-lg hover:shadow-temu-orange/5"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 bg-gray-900 relative">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-white text-lg mb-1 truncate">{p.name}</h4>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{p.totalReviews} reseñas</span>
                  <span className="text-temu-orange font-bold">${p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GradientBarsBackground>
  );
}
