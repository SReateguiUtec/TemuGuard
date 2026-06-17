import { Search, ArrowRight, ShieldCheck } from "lucide-react";
import mockData from "../data/mockProduct.json";
import type { ProductData } from "./ProductOverview";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-temu-orange/10 text-temu-orange text-sm font-semibold mb-6 border border-temu-orange/20">
          <ShieldCheck className="w-4 h-4" />
          Prototipo de Inteligencia Artificial
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
          Descubre la verdad detrás del <span className="text-transparent bg-clip-text bg-linear-to-r from-temu-orange to-yellow-500">marketing</span>.
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto px-4">
          Pega el enlace de cualquier producto y nuestra IA analizará cientos de reseñas reales para revelarte si la calidad coincide con la publicidad.
        </p>

        {/* Search Bar (Disabled) */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto opacity-60 cursor-not-allowed px-4 sm:px-0">
          <div className="absolute inset-y-0 left-8 sm:left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
          </div>
          <input
            type="text"
            disabled
            className="block w-full p-4 pl-12 sm:p-6 sm:pl-14 text-sm sm:text-lg text-gray-400 bg-surface border-2 border-gray-800 rounded-2xl cursor-not-allowed outline-none pr-[100px] sm:pr-[160px]"
            placeholder="Pegar enlace (Función en desarrollo...)"
          />
          <button
            type="button"
            disabled
            className="absolute right-6 bottom-2 top-2 sm:right-3 sm:bottom-3 sm:top-3 bg-gray-800 text-gray-500 font-bold rounded-xl px-4 sm:px-8 flex items-center gap-1 sm:gap-2 cursor-not-allowed text-xs sm:text-base"
          >
            Analizar
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" />
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
  );
}
