import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  Ruler,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Eye,
  X,
} from 'lucide-react';
import TiltCard from '../motion/TiltCard';
import Reveal from '../motion/Reveal';
import PageTransition from '../motion/PageTransition';
import { useCart } from '../context/CartContext';
import { m, AnimatePresence } from 'motion/react';
import { modalScaleVariant } from '../motion/variants';

export const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Selections
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Pincode checker state
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState({
    craft: true,
    care: false,
    shipping: false,
  });

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        setRelated(data.related || []);
        if (data.product.sizes?.length) {
          setSelectedSize(data.product.sizes[0].size);
        }
        if (data.product.colors?.length) {
          setSelectedColor(data.product.colors[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load product detail', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput.trim())) {
      setPincodeResult({ error: 'Please enter a valid 6-digit Indian pincode.' });
      return;
    }

    setCheckingPincode(true);
    try {
      const res = await fetch(`/api/pincodes/check/${pincodeInput.trim()}`);
      const data = await res.json();
      setPincodeResult(data);
    } catch (err) {
      setPincodeResult({ error: 'Unable to check delivery status.' });
    } finally {
      setCheckingPincode(false);
    }
  };

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C59B27] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-sm text-[#141210] uppercase tracking-wider">Unveiling Garment Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-24 text-center">
        <h2 className="font-serif text-2xl text-[#141210]">Garment Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block text-xs uppercase tracking-couture text-[#C59B27] underline">
          Return to Collection
        </Link>
      </div>
    );
  }

  const priceRupees = product.basePricePaise / 100;
  const gstRupees = priceRupees * product.gstRate;
  const inclusivePrice = priceRupees + gstRupees;
  const isWishlisted = wishlist.includes(product._id);

  // Selected size stock check
  const sizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const currentStock = sizeObj ? sizeObj.stock : 5;

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-10">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-xs text-[#6E675F]">
          <Link to="/" className="hover:text-[#141210]">Home</Link> &gt;{' '}
          <Link to="/shop" className="hover:text-[#141210]">Catalog</Link> &gt;{' '}
          <span className="text-[#141210] font-medium">{product.title}</span>
        </div>

        {/* Main Product Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Editorial Photo Gallery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Primary Large Image */}
              <div className="relative aspect-[3/4] max-h-[660px] w-full rounded-sm overflow-hidden bg-white border border-[#E7E2DA] shadow-luxury-md">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#141210]/80 backdrop-blur-sm text-[#FAF8F5] text-[10px] uppercase tracking-couture px-3 py-1 rounded-sm font-medium">
                    {product.collectionName}
                  </span>
                </div>
              </div>

              {/* Thumbnail Row */}
              {product.images.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-24 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#C59B27] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Garment Specifications & Purchase Controls */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* Collection & HSN metadata */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
                  <span className="text-xs uppercase tracking-couture text-[#C59B27] font-semibold">
                    {product.collectionName} &middot; HSN {product.hsn}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product._id)}
                    className="p-2 text-[#3D3833] hover:text-[#C59B27] cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} fill={isWishlisted ? '#C59B27' : 'none'} strokeWidth={1.5} className={isWishlisted ? 'text-[#C59B27]' : ''} />
                  </button>
                </div>

                {/* Monumental Title */}
                <h1 className="font-serif text-3xl sm:text-4xl text-[#141210] mt-3 font-semibold leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-[#6E675F] mt-1 font-light">
                  Crafted over {product.craftHours} artisan hours &middot; 100% {product.fabric}
                </p>

                {/* GST-Compliant Price Breakdown */}
                <div className="mt-6 p-4 bg-white border border-[#E7E2DA] rounded-sm">
                  <div className="flex items-baseline space-x-3">
                    <span className="font-serif text-3xl font-bold text-[#141210]">
                      ₹{inclusivePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#166534] font-medium bg-[#166534]/10 px-2.5 py-0.5 rounded-sm">
                      Inclusive of all GST &amp; Taxes
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#6E675F] space-y-0.5 pt-2 border-t border-[#E7E2DA]/60">
                    <div className="flex justify-between">
                      <span>Pre-Tax Taxable Value:</span>
                      <span className="font-medium text-[#141210]">₹{priceRupees.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applicable GST Slab:</span>
                      <span className="font-medium text-[#141210]">
                        {(product.gstRate * 100).toFixed(0)}% ({product.basePricePaise <= 250000 ? 'Low-value apparel slab' : 'Standard luxury couture'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Amount:</span>
                      <span className="font-medium text-[#141210]">₹{gstRupees.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Color Variants Switcher */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-couture font-semibold text-[#141210] block mb-2">
                      Color Shade: <span className="text-[#6E675F] font-normal">{selectedColor?.name}</span>
                    </span>
                    <div className="flex items-center space-x-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          style={{ backgroundColor: color.hex }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            selectedColor?.name === color.name
                              ? 'border-[#C59B27] scale-110 ring-2 ring-white'
                              : 'border-black/20 hover:scale-105'
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector & Size Guide Link */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-couture font-semibold text-[#141210]">
                      Select Size:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-xs text-[#C59B27] hover:underline flex items-center cursor-pointer font-medium"
                    >
                      <Ruler size={13} className="mr-1" /> Size Guide &amp; Measurements
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes?.map((s) => (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border rounded-sm transition-all cursor-pointer ${
                          selectedSize === s.size
                            ? 'bg-[#141210] text-[#FAF8F5] border-[#141210] shadow-luxury-sm'
                            : 'bg-white text-[#3D3833] border-[#E7E2DA] hover:border-[#C59B27]'
                        }`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#166534] mt-2 flex items-center">
                    <Check size={12} className="mr-1" /> In Stock &middot; Handcrafted &amp; Dispatches in 48 Hours
                  </p>
                </div>

                {/* Primary Add to Bag Action */}
                <div className="mt-8 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => addToCart(product, selectedSize, selectedColor?.name || 'Default')}
                    className="flex-1 py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer"
                  >
                    <ShoppingBag size={16} className="mr-2" /> Add to Atelier Bag
                  </button>
                </div>

                {/* Pincode Delivery Checker */}
                <div className="mt-8 pt-6 border-t border-[#E7E2DA]">
                  <span className="text-xs uppercase tracking-couture font-semibold text-[#141210] flex items-center mb-2">
                    <MapPin size={14} className="text-[#C59B27] mr-1.5" /> Check Delivery &amp; COD Serviceability
                  </span>
                  <form onSubmit={handlePincodeCheck} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#E7E2DA] text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                    <button
                      type="submit"
                      disabled={checkingPincode}
                      className="px-5 py-2 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium rounded-sm transition-colors cursor-pointer"
                    >
                      {checkingPincode ? 'Checking...' : 'Check'}
                    </button>
                  </form>

                  {pincodeResult && (
                    <div className="mt-3 p-3 bg-white border border-[#E7E2DA] rounded-sm text-xs space-y-1">
                      {pincodeResult.error ? (
                        <p className="text-[#991B1B]">{pincodeResult.error}</p>
                      ) : (
                        <>
                          <p className="text-[#166534] font-medium flex items-center">
                            <Check size={12} className="mr-1" /> Serviceable in {pincodeResult.estimatedDays} business days ({pincodeResult.city}, {pincodeResult.state})
                          </p>
                          <p className="text-[#6E675F]">
                            COD Availability: {pincodeResult.isCodAllowed ? (
                              <span className="text-[#166534] font-medium">Available (OTP Verified)</span>
                            ) : (
                              <span className="text-[#991B1B] font-medium">Prepaid Only (Razorpay)</span>
                            )}
                          </p>
                          <p className="text-[#6E675F]">
                            GST Supply Nature: <span className="font-medium text-[#141210]">{pincodeResult.taxType}</span>
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Fabric, Care & Atelier Accordions */}
                <div className="mt-8 border-t border-[#E7E2DA] divide-y divide-[#E7E2DA]">
                  {/* Craft & Description */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('craft')}
                      className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-couture font-semibold text-[#141210] cursor-pointer"
                    >
                      <span>Craftsmanship &amp; Silhouette</span>
                      {openAccordions.craft ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordions.craft && (
                      <div className="pb-4 text-xs text-[#6E675F] leading-relaxed font-sans font-light">
                        {product.description}
                      </div>
                    )}
                  </div>

                  {/* Care Instructions */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('care')}
                      className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-couture font-semibold text-[#141210] cursor-pointer"
                    >
                      <span>Fabric Care &amp; Muslin Storage</span>
                      {openAccordions.care ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordions.care && (
                      <div className="pb-4 text-xs text-[#6E675F] leading-relaxed font-sans font-light">
                        {product.care}
                      </div>
                    )}
                  </div>

                  {/* Delivery & Complimentary Alterations */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('shipping')}
                      className="w-full py-4 flex items-center justify-between text-xs uppercase tracking-couture font-semibold text-[#141210] cursor-pointer"
                    >
                      <span>Insured Delivery &amp; Fitting Policy</span>
                      {openAccordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openAccordions.shipping && (
                      <div className="pb-4 text-xs text-[#6E675F] leading-relaxed font-sans font-light space-y-1">
                        <p>Complimentary tamper-proof express delivery across all serviceable Indian pincodes.</p>
                        <p>Delivered in minimal matte packaging with a discreet card reading: &ldquo;We trust you with our secret.&rdquo;</p>
                        <p>Includes one round of complimentary custom fitting alterations through our Siliguri atelier within 14 days of delivery.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Couture Pieces */}
          {related && related.length > 0 && (
            <div className="mt-24 pt-16 border-t border-[#E7E2DA]">
              <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
                Complementary Silhouettes
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#141210] mb-8">
                From the Same Capsule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {related.map((relItem) => (
                  <Link key={relItem._id} to={`/product/${relItem.slug}`} className="group block">
                    <TiltCard maxTilt={6} className="bg-white border border-[#E7E2DA] rounded-sm overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={relItem.images[0]}
                          alt={relItem.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] uppercase tracking-editorial text-[#C59B27]">HSN {relItem.hsn}</p>
                        <h4 className="font-serif text-sm font-semibold text-[#141210] group-hover:text-[#C59B27] transition-colors line-clamp-1 mt-0.5">
                          {relItem.title}
                        </h4>
                        <p className="font-serif text-sm font-bold text-[#141210] mt-1">
                          ₹{((relItem.basePricePaise * (1 + relItem.gstRate)) / 100).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </TiltCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size Guide Modal with Accessible Focus Trap & Escape key */}
        <AnimatePresence>
          {sizeGuideOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSizeGuideOpen(false)}
                className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm"
              />
              <m.div
                variants={modalScaleVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white rounded-sm border border-[#E7E2DA] max-w-xl w-full p-6 sm:p-8 z-10 shadow-2xl"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#E7E2DA]">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#141210]">Atelier Couture Size Guide</h3>
                    <p className="text-xs text-[#6E675F]">Standard measurements in inches (and cm)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(false)}
                    className="p-1 text-[#6E675F] hover:text-[#141210] cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F5] text-[#141210] uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Bust (in)</th>
                        <th className="py-2.5 px-3">Waist (in)</th>
                        <th className="py-2.5 px-3">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA] text-[#3D3833]">
                      <tr><td className="py-2 px-3 font-semibold">XS</td><td className="py-2 px-3">32 (81cm)</td><td className="py-2 px-3">25 (63cm)</td><td className="py-2 px-3">35 (89cm)</td></tr>
                      <tr><td className="py-2 px-3 font-semibold">S</td><td className="py-2 px-3">34 (86cm)</td><td className="py-2 px-3">27 (68cm)</td><td className="py-2 px-3">37 (94cm)</td></tr>
                      <tr><td className="py-2 px-3 font-semibold">M</td><td className="py-2 px-3">36 (91cm)</td><td className="py-2 px-3">29 (74cm)</td><td className="py-2 px-3">39 (99cm)</td></tr>
                      <tr><td className="py-2 px-3 font-semibold">L</td><td className="py-2 px-3">38 (96cm)</td><td className="py-2 px-3">31 (79cm)</td><td className="py-2 px-3">41 (104cm)</td></tr>
                      <tr><td className="py-2 px-3 font-semibold">XL</td><td className="py-2 px-3">40 (102cm)</td><td className="py-2 px-3">33 (84cm)</td><td className="py-2 px-3">43 (109cm)</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7E2DA] text-xs text-[#6E675F] space-y-1">
                  <p><strong>Bespoke Custom Measurements:</strong> Available for bridal and high couture ensembles at no additional charge. Select "Custom Bespoke" size and our concierge will contact you for virtual video measurements.</p>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
