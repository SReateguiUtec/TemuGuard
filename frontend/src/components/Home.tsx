import { Search, ArrowRight, ShieldCheck, Star, MessageSquare, TrendingDown } from "lucide-react";
import mockData from "../data/mockProduct.json";
import type { ProductData } from "./ProductOverview";
import GradientBarsBackground from "./gradient-bars-background";

interface HomeProps {
  onAnalyze: (productId: string) => void;
}

function ProductCard({ product: p, index, onAnalyze }: { product: ProductData; index: number; onAnalyze: (id: string) => void }) {
  return (
    <div
      onClick={() => onAnalyze(p.id)}
      className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-temu-orange/40 hover:shadow-[0_12px_40px_rgba(255,107,43,0.15)] flex flex-col h-full"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Background ambient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-temu-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Discount badge */}
      {p.discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold shadow-lg">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">-{p.discountPercentage}%</span>
        </div>
      )}

      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0c] rounded-t-3xl shrink-0">
        <img
          src={p.images[0]}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        {/* elegant inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
        
        {/* "Analizar" Pill (appears on hover) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
           <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <ShieldCheck className="w-4 h-4 text-temu-orange" />
             Analizar producto
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 pt-4 bg-gradient-to-b from-[#0a0a0c] to-[#131316] flex-1 flex flex-col justify-between">
        <h4 className="font-bold text-white text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
          {p.name}
        </h4>

        {/* Stats & Price Row */}
        <div className="flex items-end justify-between mt-auto">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
               <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 border border-white/5">
                 <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                 <span className="text-gray-200">{p.rating.toFixed(1)}</span>
               </div>
               <span className="flex items-center gap-1">
                 <MessageSquare className="w-3 h-3 opacity-60" />
                 {p.totalReviews.toLocaleString()}
               </span>
             </div>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl font-black text-white">${p.price.toFixed(2)}</p>
               {p.originalPrice > p.price && (
                 <p className="text-xs text-gray-500 line-through">${p.originalPrice.toFixed(2)}</p>
               )}
             </div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-temu-orange group-hover:border-temu-orange group-hover:shadow-[0_0_20px_rgba(255,107,43,0.4)] transition-all duration-300">
             <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
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
      <div className="flex flex-col items-center w-full pb-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-temu-orange/10 text-temu-orange text-sm font-semibold mb-6 border border-temu-orange/20">
            <ShieldCheck className="w-4 h-4" />
            TemuGuard IA
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Tus compras y envíos, bajo <span className="text-transparent bg-clip-text bg-linear-to-r from-temu-orange to-yellow-500">control total</span>.
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto px-4 font-body font-normal tracking-wide leading-relaxed">
            Verifica la calidad real de productos y monitorea tus paquetes con alertas predictivas de IA.
          </p>

          {/* Search Bar (Disabled) */}
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto px-4 sm:px-0 group">
            {/* Subtle glow effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-temu-orange/30 to-yellow-500/30 rounded-full blur-md opacity-40 group-hover:opacity-60 transition duration-500"></div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-5 sm:left-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-hover:text-temu-orange transition-colors duration-300" />
              </div>
              <input
                type="text"
                disabled
                className="block w-full py-3.5 pl-12 pr-28 sm:py-4 sm:pl-14 sm:pr-36 text-sm sm:text-base text-gray-300 bg-[#0d0d10]/80 backdrop-blur-xl border border-white/10 rounded-full cursor-not-allowed outline-none shadow-2xl transition-all duration-300 focus:border-temu-orange/50 focus:shadow-[0_0_30px_rgba(255,107,43,0.15)]"
                placeholder="Enlace del producto o número de seguimiento..."
              />
              <button
                type="button"
                disabled
                className="absolute right-2 bottom-2 top-2 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-full px-4 sm:px-6 flex items-center gap-2 cursor-not-allowed text-xs sm:text-sm transition-all duration-300 hover:bg-white/10"
              >
                Analizar
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            </div>
          </form>
        </div>

        {/* Featured Products */}
        <div className="w-full max-w-5xl mx-auto mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest shrink-0">Ejemplos para analizar</h3>
            <div className="h-px bg-white/[0.06] flex-1" />
            <span className="text-xs text-gray-600 shrink-0">{products.length} productos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onAnalyze={onAnalyze} />
            ))}
          </div>
        </div>
      </div>
    </GradientBarsBackground>
  );
}
