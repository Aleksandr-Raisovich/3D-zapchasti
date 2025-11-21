import React, { useState } from 'react';
import { Search, Package, Activity, Settings, CheckCircle, AlertCircle, ChevronDown, Cpu } from 'lucide-react';
import { PartData } from '../types';
import { fetchPartBySKU } from '../services/geminiService';

interface SearchInterfaceProps {
  setFoundPart: (part: PartData | null) => void;
  isSearching: boolean;
  setIsSearching: (status: boolean) => void;
  foundPart: PartData | null;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
    setFoundPart, 
    isSearching, 
    setIsSearching,
    foundPart
}) => {
  const [skuInput, setSkuInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuInput.trim()) return;

    setIsSearching(true);
    setError(null);
    setFoundPart(null);

    try {
      const part = await fetchPartBySKU(skuInput);
      setFoundPart(part);
    } catch (err) {
      setError("Запчасть не найдена или ошибка сети.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full min-h-[200vh] flex flex-col items-center relative z-10">
        {/* Hero Section - Page 1 */}
        <section className="w-full h-screen flex flex-col items-center justify-center px-4">
            <div className="max-w-3xl w-full space-y-8 text-center">
                <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-white rounded-full shadow-lg">
                            <Cpu className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-tech text-slate-800 drop-shadow-sm">
                        ВСЕ ЗАПЧАСТИ
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl tracking-widest uppercase font-semibold">
                        Глобальная База Поиска Деталей
                    </p>
                </div>

                {/* Search Box - Light Theme */}
                <div className="relative group max-w-xl mx-auto w-full">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    
                    <form onSubmit={handleSearch} className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-xl overflow-hidden p-2">
                        <Search className="w-6 h-6 text-slate-400 ml-3" />
                        <input 
                            type="text"
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            placeholder="Введите артикул (напр. G-492-X)"
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-xl font-tech px-4 py-2 uppercase tracking-wider"
                        />
                        <button 
                            type="submit" 
                            disabled={isSearching}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSearching ? 'ПОИСК...' : 'НАЙТИ'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow-sm">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <p className="text-xs text-slate-400 mb-2 font-bold">ЛИСТАЙТЕ ВНИЗ</p>
                    <ChevronDown className="w-6 h-6 text-slate-400 mx-auto" />
                </div>
            </div>
        </section>

        {/* Results Section - Page 2 (Revealed on scroll) */}
        <section className="w-full min-h-screen flex flex-col items-center justify-start pt-20 px-4 bg-slate-50/90">
            {foundPart ? (
                <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Main Info Card */}
                    <div className="col-span-1 md:col-span-3 bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-2 border border-blue-200">
                                    SKU: {foundPart.sku}
                                </div>
                                <h2 className="text-4xl font-bold font-tech text-slate-800">{foundPart.name}</h2>
                                <div className="text-slate-500 font-medium mt-1">
                                    Категория: {foundPart.category}
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-4xl font-bold text-slate-800">{foundPart.currency} {foundPart.price}</div>
                                <div className={`flex items-center md:justify-end gap-2 mt-2 text-sm font-bold ${foundPart.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {foundPart.inStock ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {foundPart.inStock ? `В НАЛИЧИИ: ${foundPart.stockCount} ШТ.` : 'НЕТ НА СКЛАДЕ'}
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-lg">
                            {foundPart.description}
                        </p>
                    </div>

                    {/* Specs Card */}
                    <div className="col-span-1 md:col-span-1 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-blue-600 mb-4 border-b border-slate-100 pb-2">
                            <Settings size={20} />
                            <h3 className="font-bold uppercase tracking-wider text-slate-800">Характеристики</h3>
                        </div>
                        <ul className="space-y-3">
                            {Object.entries(foundPart.specifications).map(([key, value]) => (
                                <li key={key} className="flex justify-between text-sm">
                                    <span className="text-slate-500 capitalize">{key}</span>
                                    <span className="text-slate-800 font-mono font-bold">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compatibility Card */}
                    <div className="col-span-1 md:col-span-2 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-indigo-600 mb-4 border-b border-slate-100 pb-2">
                            <Activity size={20} />
                            <h3 className="font-bold uppercase tracking-wider text-slate-800">Совместимость</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {foundPart.compatibility.map((item, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="text-center mt-20 opacity-40">
                    <Package className="w-24 h-24 mx-auto text-slate-300 mb-4" />
                    <p className="text-2xl text-slate-400 font-tech font-bold uppercase">Ожидание ввода данных...</p>
                </div>
            )}
        </section>
    </div>
  );
};