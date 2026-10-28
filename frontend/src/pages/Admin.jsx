import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  MapPin,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  LogOut,
  Plus,
  RefreshCw,
  Lock,
  Layers,
  Trash2,
  X,
  AlertCircle,
  Tag,
  Check,
  Eye,
} from 'lucide-react';
import PageTransition from '../motion/PageTransition';

export const Admin = () => {
  const [token, setToken] = useState(() => localStorage.getItem('zariya_admin_jwt') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zariya_admin_user')) || null;
    } catch {
      return null;
    }
  });

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab: 'orders' | 'products' | 'categories' | 'pincodes' | 'analytics'
  const [activeTab, setActiveTab] = useState('orders');

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Feedback notifications
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Add Product Modal & Form State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    collectionName: 'The Royal Noor',
    category: 'couture',
    basePriceRupees: '',
    hsn: '6204',
    fabric: 'Pure Mulberry Silk with Handloom Zari',
    care: 'Specialist dry clean only. Store wrapped in unbleached muslin.',
    craftHours: 240,
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    description: 'An architectural couture creation meticulously needlecrafted by master artisans.',
    isFeatured: true,
  });

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token, activeTab]);

  const showNotification = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed.');
      }

      setToken(data.token);
      setAdminUser(data.admin);
      localStorage.setItem('zariya_admin_jwt', data.token);
      localStorage.setItem('zariya_admin_user', JSON.stringify(data.admin));
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem('zariya_admin_jwt');
    localStorage.removeItem('zariya_admin_user');
  };

  const loadAdminData = async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Always load categories for dropdowns
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !newProduct.category) {
          setNewProduct((prev) => ({ ...prev, category: catData.categories[0].slug }));
        }
      }

      if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders', { headers });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } else if (activeTab === 'pincodes') {
        const res = await fetch('/api/pincodes', { headers });
        const data = await res.json();
        if (data.success) setPincodes(data.pincodes);
      } else if (activeTab === 'analytics') {
        const res = await fetch('/api/admin/analytics', { headers });
        const data = await res.json();
        if (data.success) setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Order fulfillment status updated.');
        loadAdminData();
      }
    } catch (err) {
      showNotification('error', 'Failed to update order status');
    }
  };

  const handleMarkCashCollected = async (orderId) => {
    if (!window.confirm('Confirm cash collection and delivery for this COD order?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/collect-cash`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Cash collected and order marked delivered.');
        loadAdminData();
      }
    } catch (err) {
      showNotification('error', 'Failed to mark cash collected');
    }
  };

  const handleTogglePincodeCod = async (pincode, currentVal) => {
    try {
      const res = await fetch(`/api/pincodes/toggle/${pincode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCodAllowed: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Pincode ${pincode} COD status updated.`);
        loadAdminData();
      }
    } catch (err) {
      showNotification('error', 'Failed to toggle pincode COD status');
    }
  };

  // 1. Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.basePriceRupees) {
      showNotification('error', 'Please fill in title and taxable base price.');
      return;
    }

    setProductSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newProduct.title,
          collectionName: newProduct.collectionName,
          category: newProduct.category,
          basePriceRupees: Number(newProduct.basePriceRupees),
          hsn: newProduct.hsn || (Number(newProduct.basePriceRupees) <= 2500 ? '6214' : '6204'),
          fabric: newProduct.fabric,
          care: newProduct.care,
          craftHours: Number(newProduct.craftHours) || 200,
          description: newProduct.description,
          imageUrl: newProduct.imageUrl,
          isFeatured: newProduct.isFeatured,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to add product.');
      }

      showNotification('success', `Garment "${data.product.title}" added to catalog with ${(data.product.gstRate * 100).toFixed(0)}% GST!`);
      setProductModalOpen(false);
      setNewProduct({
        title: '',
        collectionName: 'The Royal Noor',
        category: categories.length > 0 ? categories[0].slug : 'couture',
        basePriceRupees: '',
        hsn: '6204',
        fabric: 'Pure Mulberry Silk with Handloom Zari',
        care: 'Specialist dry clean only. Store wrapped in unbleached muslin.',
        craftHours: 240,
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
        description: 'An architectural couture creation meticulously needlecrafted by master artisans.',
        isFeatured: true,
      });
      loadAdminData();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setProductSubmitting(false);
    }
  };

  // 2. Delete Product
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${title}" from the atelier catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message || 'Garment removed from catalog.');
        loadAdminData();
      } else {
        throw new Error(data.message || 'Failed to remove product.');
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // 3. Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showNotification('error', 'Category name is required.');
      return;
    }

    setCatSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create category.');
      }

      showNotification('success', `Category "${data.category.name}" added successfully.`);
      setNewCatName('');
      setNewCatDesc('');
      loadAdminData();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setCatSubmitting(false);
    }
  };

  // 4. Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove category "${name}"? Existing garments in this category will remain, but the filter will be removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message || 'Category removed.');
        loadAdminData();
      } else {
        throw new Error(data.message || 'Failed to remove category.');
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // Computed GST Rate for live preview in Add Product modal
  const previewPriceNum = Number(newProduct.basePriceRupees) || 0;
  const previewGstRate = previewPriceNum <= 2500 ? 0.05 : 0.18;
  const previewGstAmount = previewPriceNum * previewGstRate;
  const previewInclusiveTotal = previewPriceNum + previewGstAmount;

  if (!token) {
    return (
      <PageTransition>
        <div className="bg-[#FAF8F5] min-h-[85vh] py-20 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-[#E7E2DA] rounded-sm p-8 shadow-luxury-md">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-1">
                Atelier Administration
              </span>
              <h1 className="font-serif text-2xl text-[#141210]">Executive Portal Login</h1>
              <p className="text-xs text-[#6E675F] mt-2">
                Secured access for atelier directors, GST auditors, and inventory fulfillment.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-[#991B1B]/10 border border-[#991B1B]/30 rounded-sm text-xs text-[#991B1B]">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-[#3D3833] font-medium mb-1">Director Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zariyaatelier.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#3D3833] font-medium mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium rounded-sm transition-colors cursor-pointer"
              >
                {loginLoading ? 'Authenticating...' : 'Enter Atelier Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E7E2DA] mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block">
                Atelier Administration &middot; Siliguri, West Bengal
              </span>
              <h1 className="font-serif text-3xl text-[#141210]">
                ZARIYA Executive Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[#6E675F]">
                Logged in as: <strong className="text-[#141210]">{adminUser?.name || 'Atelier Director'}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 border border-[#141210] rounded-sm text-xs text-[#141210] hover:bg-[#141210] hover:text-white flex items-center transition-colors cursor-pointer"
              >
                <LogOut size={13} className="mr-1" /> Logout
              </button>
            </div>
          </div>

          {/* Action Notification Banner */}
          {actionMessage.text && (
            <div
              className={`mb-6 p-4 rounded-sm text-xs flex items-center justify-between transition-all ${
                actionMessage.type === 'success'
                  ? 'bg-[#166534]/10 border border-[#166534]/30 text-[#166534]'
                  : 'bg-[#991B1B]/10 border border-[#991B1B]/30 text-[#991B1B]'
              }`}
            >
              <div className="flex items-center">
                {actionMessage.type === 'success' ? (
                  <CheckCircle size={16} className="mr-2 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="mr-2 shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
              <button onClick={() => setActionMessage({ type: '', text: '' })}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-3 border-b border-[#E7E2DA] mb-8 overflow-x-auto pb-2 text-xs uppercase tracking-couture font-medium">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-3 transition-colors cursor-pointer whitespace-nowrap flex items-center ${
                activeTab === 'orders' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F]'
              }`}
            >
              <ShoppingBag size={14} className="mr-1.5" /> Orders &amp; Invoices
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-3 transition-colors cursor-pointer whitespace-nowrap flex items-center ${
                activeTab === 'products' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F]'
              }`}
            >
              <Package size={14} className="mr-1.5" /> Garments Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-3 px-3 transition-colors cursor-pointer whitespace-nowrap flex items-center ${
                activeTab === 'categories' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F]'
              }`}
            >
              <Layers size={14} className="mr-1.5" /> Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('pincodes')}
              className={`pb-3 px-3 transition-colors cursor-pointer whitespace-nowrap flex items-center ${
                activeTab === 'pincodes' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F]'
              }`}
            >
              <MapPin size={14} className="mr-1.5" /> Pincode COD Manager
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-3 transition-colors cursor-pointer whitespace-nowrap flex items-center ${
                activeTab === 'analytics' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F]'
              }`}
            >
              <TrendingUp size={14} className="mr-1.5" /> Revenue &amp; Analytics
            </button>
          </div>

          {/* Tab 1: Orders & GST Tax Invoices */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
                <h3 className="font-serif text-lg font-bold text-[#141210]">
                  Order Fulfillment &amp; GST Invoicing
                </h3>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-[#6E675F] hover:text-[#141210] flex items-center cursor-pointer"
                >
                  <RefreshCw size={12} className="mr-1" /> Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#6E675F] py-8 text-center">No client orders recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F5] text-[#141210] uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                      <tr>
                        <th className="py-3 px-3">Order #</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Fulfillment</th>
                        <th className="py-3 px-3">Tax Invoice</th>
                        <th className="py-3 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA] text-[#3D3833]">
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td className="py-3 px-3 font-mono font-bold text-[#141210]">
                            #{o.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium">{o.customer.name}</div>
                            <div className="text-[10px] text-[#6E675F]">{o.shippingAddress.city}, {o.shippingAddress.state} ({o.shippingAddress.stateCode})</div>
                          </td>
                          <td className="py-3 px-3 font-serif font-bold text-[#141210]">
                            ₹{(o.grandTotalPaise / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold ${
                              o.paymentStatus === 'paid' ? 'bg-[#166534]/10 text-[#166534]' : 'bg-[#991B1B]/10 text-[#991B1B]'
                            }`}>
                              {o.paymentMethod.toUpperCase()} &middot; {o.paymentStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleStatusChange(o._id, e.target.value)}
                              className="bg-[#FAF8F5] border border-[#E7E2DA] px-2 py-1 rounded text-xs text-[#141210] focus:outline-none"
                            >
                              <option value="pending_payment">Pending Payment</option>
                              <option value="pending_confirmation">Pending Confirmation</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-3">
                            <a
                              href={`/api/orders/${o._id}/invoice`}
                              download
                              className="inline-flex items-center px-2.5 py-1 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] rounded text-[10px] uppercase tracking-wider font-medium"
                            >
                              <FileText size={11} className="mr-1" /> PDF
                            </a>
                          </td>
                          <td className="py-3 px-3">
                            {o.paymentMethod === 'cod' && !o.cashCollected && (
                              <button
                                onClick={() => handleMarkCashCollected(o._id)}
                                className="px-2 py-1 bg-[#166534] text-white rounded text-[10px] uppercase font-medium hover:bg-[#15803d] cursor-pointer"
                              >
                                Mark Cash Collected
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Products Catalog Table & Add Product Action */}
          {activeTab === 'products' && (
            <div className="bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E7E2DA] gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#141210]">
                    Atelier Garments Catalog ({products.length})
                  </h3>
                  <p className="text-xs text-[#6E675F]">
                    Automatic GST slab calculation: &le; ₹2,500 attracts 5% GST; &gt; ₹2,500 attracts 18% GST.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadAdminData}
                    className="text-xs text-[#6E675F] hover:text-[#141210] flex items-center cursor-pointer px-3 py-2 border border-[#E7E2DA] rounded-sm"
                  >
                    <RefreshCw size={12} className="mr-1" /> Refresh
                  </button>
                  <button
                    onClick={() => setProductModalOpen(true)}
                    className="px-4 py-2 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium rounded-sm flex items-center transition-colors cursor-pointer shadow-luxury-sm"
                  >
                    <Plus size={14} className="mr-1.5" /> Add New Garment
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-[#141210] uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                    <tr>
                      <th className="py-3 px-3">Garment</th>
                      <th className="py-3 px-3">Collection</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">HSN</th>
                      <th className="py-3 px-3">Taxable Base</th>
                      <th className="py-3 px-3">GST Slab</th>
                      <th className="py-3 px-3">Total (incl. GST)</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2DA] text-[#3D3833]">
                    {products.map((p) => {
                      const baseRupees = p.basePricePaise / 100;
                      const inclRupees = baseRupees * (1 + p.gstRate);
                      return (
                        <tr key={p._id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-3">
                              {p.images && p.images[0] && (
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  className="w-9 h-11 object-cover rounded-sm border border-[#E7E2DA] shrink-0"
                                />
                              )}
                              <div>
                                <span className="font-semibold text-[#141210] block line-clamp-1">{p.title}</span>
                                <span className="text-[10px] text-[#6E675F]">{p.fabric}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#6E675F]">{p.collectionName}</td>
                          <td className="py-3 px-3">
                            <span className="bg-[#FAF8F5] border border-[#E7E2DA] px-2 py-0.5 rounded text-[10px] uppercase font-medium">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono">{p.hsn}</td>
                          <td className="py-3 px-3 font-medium">₹{baseRupees.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.gstRate === 0.05 ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'
                            }`}>
                              {(p.gstRate * 100).toFixed(0)}% GST
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-[#141210]">₹{inclRupees.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.title)}
                              className="p-1.5 text-[#6E675F] hover:text-[#991B1B] hover:bg-[#991B1B]/10 rounded transition-colors cursor-pointer"
                              title="Delete Garment"
                              aria-label={`Delete ${p.title}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Categories Management */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              {/* Add Category Form */}
              <div className="bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm">
                <h3 className="font-serif text-lg font-bold text-[#141210] pb-2 border-b border-[#E7E2DA] flex items-center">
                  <Tag size={16} className="text-[#C59B27] mr-2" /> Add New Apparel Category
                </h3>
                <p className="text-xs text-[#6E675F] mt-1 mb-4">
                  Categories added here instantly show up in the Shop silhouette filter bar and product creation menus.
                </p>

                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-[#3D3833] font-medium mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Festive Kurta Sets"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs text-[#3D3833] font-medium mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g. Contemporary festive handloom separates"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-xs text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={catSubmitting}
                      className="w-full py-2.5 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {catSubmitting ? 'Adding...' : '+ Add'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories List */}
              <div className="bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA]">
                  <h3 className="font-serif text-lg font-bold text-[#141210]">
                    Active Atelier Categories ({categories.length})
                  </h3>
                  <button
                    onClick={loadAdminData}
                    className="text-xs text-[#6E675F] hover:text-[#141210] flex items-center cursor-pointer"
                  >
                    <RefreshCw size={12} className="mr-1" /> Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F5] text-[#141210] uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                      <tr>
                        <th className="py-3 px-3">Category Name</th>
                        <th className="py-3 px-3">Filter Slug</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA] text-[#3D3833]">
                      {categories.map((c) => (
                        <tr key={c._id || c.slug} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#141210]">{c.name}</td>
                          <td className="py-3 px-3 font-mono text-[#C59B27]">?category={c.slug}</td>
                          <td className="py-3 px-3 text-[#6E675F]">{c.description || '—'}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteCategory(c._id, c.name)}
                              className="px-2.5 py-1 text-[#991B1B] hover:bg-[#991B1B]/10 border border-[#991B1B]/30 rounded text-[10px] uppercase font-medium transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Pincode COD Allow/Deny Manager */}
          {activeTab === 'pincodes' && (
            <div className="bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#141210] pb-3 border-b border-[#E7E2DA]">
                Postal Serviceability &amp; COD Surcharge Whitelist
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-[#141210] uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                    <tr>
                      <th className="py-3 px-3">Pincode</th>
                      <th className="py-3 px-3">City / Hub</th>
                      <th className="py-3 px-3">State Code</th>
                      <th className="py-3 px-3">COD Status</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2DA] text-[#3D3833]">
                    {pincodes.map((pin) => (
                      <tr key={pin.pincode}>
                        <td className="py-3 px-3 font-mono font-bold text-[#141210]">{pin.pincode}</td>
                        <td className="py-3 px-3">{pin.city}, {pin.state}</td>
                        <td className="py-3 px-3 font-mono">{pin.stateCode}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pin.isCodAllowed ? 'bg-[#166534]/10 text-[#166534]' : 'bg-[#991B1B]/10 text-[#991B1B]'
                          }`}>
                            {pin.isCodAllowed ? 'COD Allowed' : 'Prepaid Only'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleTogglePincodeCod(pin.pincode, pin.isCodAllowed)}
                            className="px-2.5 py-1 border border-[#141210] rounded text-[10px] uppercase tracking-wider hover:bg-[#141210] hover:text-white transition-colors cursor-pointer"
                          >
                            {pin.isCodAllowed ? 'Deny COD' : 'Allow COD'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Analytics */}
          {activeTab === 'analytics' && analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-[#E7E2DA] rounded-sm shadow-luxury-sm">
                <span className="text-[10px] uppercase tracking-couture text-[#6E675F] block mb-1">Total Paid Revenue</span>
                <span className="font-serif text-2xl font-bold text-[#141210]">
                  ₹{analytics.totalRevenueRupees.toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] text-[#166534] mt-1">{analytics.paidOrdersCount} completed transactions</p>
              </div>

              <div className="p-6 bg-white border border-[#E7E2DA] rounded-sm shadow-luxury-sm">
                <span className="text-[10px] uppercase tracking-couture text-[#6E675F] block mb-1">Prepaid Orders</span>
                <span className="font-serif text-2xl font-bold text-[#141210]">{analytics.prepaidCount}</span>
                <p className="text-[10px] text-[#C59B27] mt-1">Razorpay Secured</p>
              </div>

              <div className="p-6 bg-white border border-[#E7E2DA] rounded-sm shadow-luxury-sm">
                <span className="text-[10px] uppercase tracking-couture text-[#6E675F] block mb-1">COD Orders</span>
                <span className="font-serif text-2xl font-bold text-[#141210]">{analytics.codCount}</span>
                <p className="text-[10px] text-[#6E675F] mt-1">Phone OTP Verified</p>
              </div>

              <div className="p-6 bg-white border border-[#E7E2DA] rounded-sm shadow-luxury-sm">
                <span className="text-[10px] uppercase tracking-couture text-[#6E675F] block mb-1">Active Garments</span>
                <span className="font-serif text-2xl font-bold text-[#141210]">{analytics.productsCount}</span>
                <p className="text-[10px] text-[#6E675F] mt-1">Across Atelier Collections</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add New Garment */}
        {productModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              onClick={() => setProductModalOpen(false)}
              className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm"
            />
            <div className="relative bg-white border border-[#E7E2DA] rounded-sm max-w-2xl w-full p-6 sm:p-8 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E2DA]">
                <div>
                  <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block">
                    Garment Cataloging
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#141210]">Add New Atelier Creation</h2>
                </div>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-1.5 text-[#6E675F] hover:text-[#141210] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="mt-6 space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block text-[#3D3833] font-medium mb-1">Garment Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="e.g. Imperial Zari Brocade Lehenga"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Collection */}
                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">Couture Collection *</label>
                    <select
                      value={newProduct.collectionName}
                      onChange={(e) => setNewProduct({ ...newProduct, collectionName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
                    >
                      <option value="The Royal Noor">The Royal Noor (Bridal)</option>
                      <option value="Aaranya Metamorphosis">Aaranya Metamorphosis</option>
                      <option value="Vanya Imperial Silk">Vanya Imperial Silk</option>
                      <option value="Atelier Pret">Atelier Pret &amp; Separates</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">Category (Silhouette) *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing & GST Slab Automatic Calculation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">
                      Taxable Base Price (₹ Rupees) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProduct.basePriceRupees}
                      onChange={(e) => setNewProduct({ ...newProduct, basePriceRupees: e.target.value })}
                      placeholder="e.g. 85000"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">HSN Code</label>
                    <input
                      type="text"
                      value={newProduct.hsn}
                      onChange={(e) => setNewProduct({ ...newProduct, hsn: e.target.value })}
                      placeholder="6204"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                {/* GST Dynamic Indicator */}
                {previewPriceNum > 0 && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#C59B27]/40 rounded-sm flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#141210]">
                        GST Slab: {(previewGstRate * 100).toFixed(0)}% GST
                      </span>
                      <p className="text-[10px] text-[#6E675F]">
                        {previewPriceNum <= 2500 ? 'Low-value apparel slab (<= ₹2,500)' : 'Standard couture slab (> ₹2,500)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#6E675F] block">GST: +₹{previewGstAmount.toLocaleString('en-IN')}</span>
                      <span className="font-serif font-bold text-[#141210]">
                        Client Price: ₹{previewInclusiveTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Fabric & Craft Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">Handloom Fabric *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.fabric}
                      onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                      placeholder="e.g. Pure Mulberry Silk with Antique Zari"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#3D3833] font-medium mb-1">Artisan Craft Hours</label>
                    <input
                      type="number"
                      value={newProduct.craftHours}
                      onChange={(e) => setNewProduct({ ...newProduct, craftHours: e.target.value })}
                      placeholder="240"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[#3D3833] font-medium mb-1">Editorial Image URL *</label>
                  <input
                    type="url"
                    required
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                  />
                  {newProduct.imageUrl && (
                    <div className="mt-2 flex items-center space-x-3">
                      <img
                        src={newProduct.imageUrl}
                        alt="Preview"
                        className="w-12 h-16 object-cover rounded-sm border border-[#E7E2DA]"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                      <span className="text-[10px] text-[#6E675F]">Image preview</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#3D3833] font-medium mb-1">Curatorial Description</label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Heirloom masterpiece handcrafted by master karigars..."
                    className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                {/* Featured checkbox */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                    className="accent-[#C59B27]"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-[#141210] cursor-pointer">
                    Feature on Homepage Runway Arrivals
                  </label>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-[#E7E2DA] flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-5 py-2.5 border border-[#141210] text-[#141210] rounded-sm uppercase tracking-couture font-medium hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={productSubmitting}
                    className="px-6 py-2.5 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] rounded-sm uppercase tracking-couture font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {productSubmitting ? 'Cataloging Garment...' : 'Publish to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Admin;
