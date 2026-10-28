import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import TiltCard from '../motion/TiltCard';
import Reveal from '../motion/Reveal';
import PageTransition from '../motion/PageTransition';
import { useCart } from '../context/CartContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter States
  const currentCollection = searchParams.get('collection') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  const [selectedPriceSlab, setSelectedPriceSlab] = useState('all'); // 'all', 'under2500', '2500to50000', 'above50000'

  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedPriceSlab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentCollection !== 'all') params.append('collection', currentCollection);
      if (currentCategory !== 'all') params.append('category', currentCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (currentSort !== 'featured') params.append('sort', currentSort);

      if (selectedPriceSlab === 'under2500') {
        params.append('maxPrice', '2500');
      } else if (selectedPriceSlab === '2500to50000') {
        params.append('minPrice', '2500');
        params.append('maxPrice', '50000');
      } else if (selectedPriceSlab === 'above50000') {
        params.append('minPrice', '50000');
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Silhouettes' },
    { id: 'couture', label: 'Bridal Couture' },
    { id: 'sarees', label: 'Draped Sarees' },
    { id: 'menswear', label: 'Sherwanis & Menswear' },
    { id: 'pret', label: 'Pret Separates' },
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories && data.categories.length > 0) {
        setCategories([
          { id: 'all', label: 'All Silhouettes' },
          ...data.categories.map((c) => ({
            id: c.slug,
            label: c.name,
          })),
        ]);
      }
    } catch (e) {
      console.error('Failed to load categories in shop', e);
    }
  };

  const collections = [
    { id: 'all', label: 'All Collections' },
    { id: 'noor', label: 'The Royal Noor' },
    { id: 'aaranya', label: 'Aaranya Metamorphosis' },
    { id: 'vanya', label: 'Vanya Imperial Silk' },
    { id: 'pret', label: 'Atelier Pret' },
  ];

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-12">
        {/* Editorial Collection Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto pt-6">
            <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
              Atelier Haute Couture Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#141210] font-normal tracking-tight">
              The Runway &amp; Pret Archive
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#6E675F] font-sans leading-relaxed">
              Explore bespoke handcrafted silhouettes. Woven on traditional Indian handlooms and finished with bespoke architectural corsetry.
            </p>
          </div>

          {/* Collection Pills Navigation */}
          <div className="mt-8 flex items-center justify-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => handleFilterChange('collection', col.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-couture font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentCollection === col.id
                    ? 'bg-[#141210] text-[#FAF8F5] shadow-luxury-sm'
                    : 'bg-white text-[#3D3833] border border-[#E7E2DA] hover:border-[#C59B27]'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="mt-3 flex items-center justify-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleFilterChange('category', cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-couture font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentCategory === cat.id
                    ? 'bg-[#C59B27] text-white shadow-luxury-sm'
                    : 'bg-white/80 text-[#6E675F] border border-[#E7E2DA] hover:border-[#C59B27] hover:text-[#141210]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white border border-[#E7E2DA] rounded-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-luxury-sm">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search zari, silk, lehenga..."
                value={searchQuery}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#141210] placeholder-[#A8A29E] rounded-sm focus:outline-none focus:border-[#C59B27]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#6E675F]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-2.5 top-2.5 text-[#6E675F] hover:text-[#141210]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#6E675F] font-medium hidden sm:inline">Category:</span>
              <select
                value={currentCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="bg-[#FAF8F5] border border-[#E7E2DA] px-3 py-2 text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slab Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#6E675F] font-medium hidden sm:inline">Price Tier:</span>
              <select
                value={selectedPriceSlab}
                onChange={(e) => setSelectedPriceSlab(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E7E2DA] px-3 py-2 text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                <option value="all">All Price Ranges</option>
                <option value="under2500">Under ₹2,500 (5% GST Slab)</option>
                <option value="2500to50000">₹2,500 – ₹50,000 (18% GST)</option>
                <option value="above50000">Above ₹50,000 (Bridal Couture)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs w-full md:w-auto justify-end">
              <span className="text-[#6E675F] font-medium">Sort By:</span>
              <select
                value={currentSort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-[#FAF8F5] border border-[#E7E2DA] px-3 py-2 text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                <option value="featured">Featured Runway</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-96 bg-[#F4F0EB] animate-pulse rounded-sm border border-[#E7E2DA]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-[#E7E2DA] rounded-sm max-w-xl mx-auto p-8">
              <p className="font-serif text-xl text-[#141210]">No pieces match your selected filters</p>
              <p className="text-xs text-[#6E675F] mt-2 mb-6">Try broadening your collection or price parameters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchParams({});
                  setSelectedPriceSlab('all');
                }}
                className="px-6 py-2.5 bg-[#141210] text-[#FAF8F5] text-xs uppercase tracking-couture font-medium hover:bg-[#C59B27] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => {
                const priceRupees = product.basePricePaise / 100;
                const gstAmount = priceRupees * product.gstRate;
                const inclusivePrice = priceRupees + gstAmount;

                return (
                  <Reveal key={product._id} delay={index * 1}>
                    <div className="group flex flex-col h-full bg-white border border-[#E7E2DA] rounded-sm overflow-hidden hover:border-[#C59B27]/60 transition-colors duration-300 shadow-luxury-sm">
                      {/* Image with TiltCard */}
                      <TiltCard maxTilt={7} className="overflow-hidden bg-[#F4F0EB]">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <Link
                            to={`/product/${product.slug}`}
                            className="block w-full h-full cursor-pointer"
                            aria-label={`View details of ${product.title}`}
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          </Link>

                          {/* Collection / Slab Pill */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                            <span className="bg-[#141210]/80 backdrop-blur-sm text-[#FAF8F5] text-[9px] uppercase tracking-couture font-medium px-2 py-0.5 rounded-sm">
                              {product.collectionName}
                            </span>
                            {product.basePricePaise <= 250000 && (
                              <span className="bg-[#166534] text-white text-[8px] uppercase tracking-couture font-bold px-2 py-0.5 rounded-sm">
                                5% GST Tier
                              </span>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-[#141210]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 p-4 pointer-events-none group-hover:pointer-events-auto">
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 rounded-full bg-white text-[#141210] hover:bg-[#C59B27] hover:text-white flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer z-30 pointer-events-auto"
                              aria-label={`View ${product.title}`}
                            >
                              <Eye size={18} strokeWidth={1.5} />
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="w-10 h-10 rounded-full bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer z-30 pointer-events-auto"
                              aria-label={`Add ${product.title} to bag`}
                            >
                              <ShoppingBag size={18} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </TiltCard>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-editorial text-[#C59B27] font-semibold">
                            HSN {product.hsn} &middot; {product.fabric}
                          </p>
                          <h3 className="font-serif text-base font-semibold text-[#141210] mt-1 group-hover:text-[#C59B27] transition-colors line-clamp-1">
                            <Link to={`/product/${product.slug}`} className="hover:text-[#C59B27] transition-colors">
                              {product.title}
                            </Link>
                          </h3>
                        </div>

                        {/* GST Breakdown & Quick Add */}
                        <div className="mt-4 pt-3 border-t border-[#E7E2DA]">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-serif text-lg font-bold text-[#141210]">
                                ₹{inclusivePrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-[#6E675F] block">
                                Base: ₹{priceRupees.toLocaleString('en-IN')} + {(product.gstRate * 100).toFixed(0)}% GST
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className="p-2 rounded-full border border-[#E7E2DA] hover:border-[#C59B27] hover:bg-[#C59B27] hover:text-white text-[#141210] transition-colors cursor-pointer"
                              title="Add to Atelier Bag"
                              aria-label={`Add ${product.title} to Atelier Bag`}
                            >
                              <ShoppingBag size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Shop;
