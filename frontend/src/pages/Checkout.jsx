import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  User,
  X,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageTransition from '../motion/PageTransition';
import { m, AnimatePresence } from 'motion/react';
import { modalScaleVariant } from '../motion/variants';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Step flow: 1. Address -> 2. Shipping -> 3. Payment -> 4. Review
  const [currentStep, setCurrentStep] = useState(1);

  // Form states start genuinely empty per security guidelines
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    buyerGstin: '', // Optional B2B
  });

  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'West Bengal',
    stateCode: '19',
    pincode: '',
  });

  // Payment Selection: 'razorpay' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Dynamic Server-Calculated Taxes
  const [taxBreakdown, setTaxBreakdown] = useState(null);
  const [loadingTaxes, setLoadingTaxes] = useState(false);

  // COD Status & Serviceability
  const [pincodeServiceable, setPincodeServiceable] = useState(true);
  const [codAllowed, setCodAllowed] = useState(true);

  // COD Phone OTP Modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpDevHint, setOtpDevHint] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Re-calculate verified server taxes whenever address state or payment method changes
  useEffect(() => {
    if (cartItems.length > 0) {
      calculateLiveTaxes();
    }
  }, [address.stateCode, paymentMethod, cartItems]);

  const calculateLiveTaxes = async () => {
    setLoadingTaxes(true);
    try {
      const res = await fetch('/api/orders/calculate-taxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          pincode: address.pincode,
          stateCode: address.stateCode,
          isPrepaid: paymentMethod === 'razorpay',
          isCod: paymentMethod === 'cod',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTaxBreakdown(data.taxes);
      }
    } catch (e) {
      console.error('Failed to calculate live taxes', e);
    } finally {
      setLoadingTaxes(false);
    }
  };

  // Pincode Autocomplete & Validation
  const handlePincodeBlur = async () => {
    const pin = address.pincode.trim();
    if (/^\d{6}$/.test(pin)) {
      try {
        const res = await fetch(`/api/pincodes/check/${pin}`);
        const data = await res.json();
        if (data.success) {
          setAddress((prev) => ({
            ...prev,
            city: data.city,
            state: data.state,
            stateCode: data.stateCode,
          }));
          setPincodeServiceable(data.isServiceable);
          setCodAllowed(data.isCodAllowed);
          if (!data.isCodAllowed && paymentMethod === 'cod') {
            setPaymentMethod('razorpay');
          }
        }
      } catch (err) {
        console.warn('Pincode lookup error', err);
      }
    }
  };

  // 1. Submit Prepaid Razorpay Order
  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    setOrderError('');

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shippingAddress: address,
          items: cartItems,
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate order.');
      }

      // Check if Razorpay test mode or mock mode
      if (orderData.isMock || !window.Razorpay) {
        // Load razorpay script dynamically if not yet on page
        const loadScript = () =>
          new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });

        const scriptLoaded = await loadScript();

        if (scriptLoaded && window.Razorpay && !orderData.isMock) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: 'INR',
            name: 'ZARIYA Atelier',
            description: `Payment for Order #${orderData.orderNumber}`,
            order_id: orderData.orderId,
            prefill: {
              name: customer.name,
              email: customer.email,
              contact: customer.phone,
            },
            theme: { color: '#C59B27' },
            handler: async function (response) {
              await verifyPaymentOnServer({
                localOrderId: orderData.localOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Dev / Mock flow: Simulate payment verification directly
          const mockPaymentId = `pay_mock_${Date.now()}`;
          const mockSignature = 'mock_valid_signature';
          await verifyPaymentOnServer({
            localOrderId: orderData.localOrderId,
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: mockSignature,
          });
          return;
        }
      }
    } catch (err) {
      setOrderError(err.message || 'Payment initiation failed. Please check details.');
      setIsProcessing(false);
    }
  };

  const verifyPaymentOnServer = async (payload) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/order/confirmation/${data.orderNumber}`);
      } else {
        throw new Error(data.message || 'Payment verification failed.');
      }
    } catch (err) {
      setOrderError(err.message);
      setIsProcessing(false);
    }
  };

  // 2. Submit COD Order (Trigger Phone OTP)
  const handleInitiateCod = async () => {
    setOtpError('');
    setOtpSending(true);

    try {
      const res = await fetch('/api/payments/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customer.phone,
          pincode: address.pincode,
          totalPaise: taxBreakdown ? taxBreakdown.grandTotalPaise : 0,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      if (data.devCode) {
        setOtpDevHint(data.devCode);
      }
      setOtpModalOpen(true);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // Verify COD OTP and Place Order
  const handleConfirmCod = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setOtpVerifying(true);
    setOtpError('');

    try {
      const res = await fetch('/api/payments/confirm-cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shippingAddress: address,
          items: cartItems,
          otpCode: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      setOtpModalOpen(false);
      navigate(`/order/confirmation/${data.orderNumber}`);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!customer.name || !customer.email || !customer.phone) {
      setOrderError('Please complete all contact and customer fields.');
      setCurrentStep(1);
      return;
    }
    if (!address.addressLine1 || !address.city || !address.pincode) {
      setOrderError('Please complete your delivery address details.');
      setCurrentStep(1);
      return;
    }

    if (paymentMethod === 'razorpay') {
      handleRazorpayCheckout();
    } else {
      handleInitiateCod();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#FAF8F5] py-24 flex items-center justify-center text-center">
        <div>
          <h2 className="font-serif text-2xl text-[#141210]">No Items in Bag</h2>
          <Link to="/shop" className="mt-4 inline-block text-xs uppercase tracking-couture text-[#C59B27] underline">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Step Indicator */}
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-1">
              Secure Atelier Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141210]">
              Delivery, Tax Invoice &amp; Payment
            </h1>

            {/* Step Breadcrumbs */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center font-medium ${
                  currentStep === 1 ? 'text-[#141210] font-bold' : 'text-[#6E675F]'
                }`}
              >
                1. Delivery Details
              </button>
              <ChevronRight size={14} className="text-[#A8A29E]" />
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`flex items-center font-medium ${
                  currentStep === 2 ? 'text-[#141210] font-bold' : 'text-[#6E675F]'
                }`}
              >
                2. Payment Method
              </button>
            </div>
          </div>

          {orderError && (
            <div className="mb-6 p-4 bg-[#991B1B]/10 border border-[#991B1B]/30 rounded-sm text-xs text-[#991B1B] flex items-center">
              <AlertCircle size={16} className="mr-2 shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-7 bg-white border border-[#E7E2DA] rounded-sm p-6 sm:p-8 shadow-luxury-sm space-y-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Step 1: Customer Contact */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#141210] pb-2 border-b border-[#E7E2DA] flex items-center">
                      <User size={16} className="text-[#C59B27] mr-2" /> 1. Client Credentials
                    </h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[#3D3833] font-medium mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="e.g. Priyadarshini Rao"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">Email (for Invoice PDF) *</label>
                        <input
                          type="email"
                          required
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          placeholder="e.g. client@domain.com"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">Phone Number (10 digits) *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="e.g. 9871234567"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[#3D3833] font-medium mb-1">
                          Buyer GSTIN (Optional &middot; For B2B Input Tax Credit)
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          value={customer.buyerGstin}
                          onChange={(e) => setCustomer({ ...customer, buyerGstin: e.target.value.toUpperCase() })}
                          placeholder="e.g. 27AAAAA0000A1Z5"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 1b: Shipping Address */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#141210] pb-2 border-b border-[#E7E2DA] flex items-center">
                      <MapPin size={16} className="text-[#C59B27] mr-2" /> 2. Delivery Address (Place of Supply)
                    </h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[#3D3833] font-medium mb-1">Address Line 1 (Villa / Flat / Street) *</label>
                        <input
                          type="text"
                          required
                          value={address.addressLine1}
                          onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                          placeholder="e.g. 42 Royal Palms, Golf Links"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">6-Digit Pincode *</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          onBlur={handlePincodeBlur}
                          placeholder="e.g. 734001"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">City / Region *</label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="e.g. Siliguri"
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">State *</label>
                        <select
                          value={address.stateCode}
                          onChange={(e) => {
                            const code = e.target.value;
                            setAddress({
                              ...address,
                              stateCode: code,
                              state: e.target.options[e.target.selectedIndex].text.split(' (')[0],
                            });
                          }}
                          className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[#141210] rounded-sm focus:outline-none focus:border-[#C59B27] cursor-pointer"
                        >
                          <option value="19">West Bengal (State Code: 19)</option>
                          <option value="07">Delhi (State Code: 07)</option>
                          <option value="27">Maharashtra (State Code: 27)</option>
                          <option value="29">Karnataka (State Code: 29)</option>
                          <option value="08">Rajasthan (State Code: 08)</option>
                          <option value="09">Uttar Pradesh (State Code: 09)</option>
                          <option value="36">Telangana (State Code: 36)</option>
                          <option value="33">Tamil Nadu (State Code: 33)</option>
                          <option value="24">Gujarat (State Code: 24)</option>
                          <option value="03">Punjab (State Code: 03)</option>
                          <option value="06">Haryana (State Code: 06)</option>
                          <option value="10">Bihar (State Code: 10)</option>
                          <option value="11">Sikkim (State Code: 11)</option>
                          <option value="18">Assam (State Code: 18)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#3D3833] font-medium mb-1">Supply Classification</label>
                        <div className="px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2DA] text-[11px] text-[#6E675F] rounded-sm font-medium">
                          {address.stateCode === '19' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (!customer.name || !customer.email || !customer.phone || !address.addressLine1 || !address.pincode) {
                          setOrderError('Please fill out all required contact and address fields.');
                          return;
                        }
                        setOrderError('');
                        setCurrentStep(2);
                      }}
                      className="w-full py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium transition-colors shadow-luxury-md flex items-center justify-center cursor-pointer"
                    >
                      Continue to Payment Method <ArrowRight size={15} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#141210] pb-2 border-b border-[#E7E2DA] flex items-center">
                      <CreditCard size={16} className="text-[#C59B27] mr-2" /> Select Payment Method
                    </h2>

                    <div className="mt-6 space-y-4">
                      {/* Option 1: Razorpay Prepaid */}
                      <label
                        className={`block p-4 border rounded-sm cursor-pointer transition-all ${
                          paymentMethod === 'razorpay'
                            ? 'border-[#C59B27] bg-[#C59B27]/5 ring-1 ring-[#C59B27]'
                            : 'border-[#E7E2DA] hover:border-[#C59B27]/50'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={() => setPaymentMethod('razorpay')}
                            className="mt-1 accent-[#C59B27]"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-sm font-bold text-[#141210]">
                                Razorpay Secure (Prepaid)
                              </span>
                              <span className="text-[10px] uppercase tracking-couture font-bold bg-[#C59B27] text-white px-2.5 py-0.5 rounded-full">
                                5% Instant Savings
                              </span>
                            </div>
                            <p className="text-xs text-[#6E675F] mt-1 leading-relaxed">
                              UPI (GPay, PhonePe, Paytm), Netbanking (All Indian Banks), Credit / Debit Cards. 256-Bit SSL Encrypted.
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* Option 2: Cash on Delivery */}
                      <label
                        className={`block p-4 border rounded-sm transition-all ${
                          !codAllowed
                            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                            : paymentMethod === 'cod'
                            ? 'border-[#C59B27] bg-[#C59B27]/5 ring-1 ring-[#C59B27] cursor-pointer'
                            : 'border-[#E7E2DA] hover:border-[#C59B27]/50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            disabled={!codAllowed}
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="mt-1 accent-[#C59B27]"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-sm font-bold text-[#141210]">
                                Cash on Delivery (COD)
                              </span>
                              <span className="text-xs text-[#6E675F]">₹150 Verification Surcharge</span>
                            </div>
                            <p className="text-xs text-[#6E675F] mt-1 leading-relaxed">
                              Requires 6-digit phone OTP authentication before confirmation. Pay cash upon white-glove arrival.
                            </p>
                            {!codAllowed && (
                              <p className="text-[11px] text-[#991B1B] mt-1 font-medium">
                                COD is unavailable for postal pincode {address.pincode}.
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Summary & Order Trigger */}
                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 bg-transparent border border-[#141210] text-[#141210] text-xs uppercase tracking-couture font-medium hover:bg-[#141210] hover:text-[#FAF8F5] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || otpSending}
                      className="flex-1 py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium transition-colors shadow-luxury-md flex items-center justify-center cursor-pointer disabled:opacity-70"
                    >
                      {isProcessing || otpSending ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          <span>Processing Atelier Order...</span>
                        </>
                      ) : paymentMethod === 'razorpay' ? (
                        <>
                          <Lock size={15} className="mr-2" /> Pay with Razorpay Secure
                        </>
                      ) : (
                        <>
                          <Phone size={15} className="mr-2" /> Verify Phone OTP &amp; Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live GST Order Breakdown */}
            <div className="lg:col-span-5 bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-5 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-[#141210] pb-3 border-b border-[#E7E2DA]">
                Live Tax Invoice Summary
              </h2>

              {/* Items Miniature List */}
              <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-[#E7E2DA]/60">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded-sm bg-[#F4F0EB]" />
                      <div>
                        <p className="font-serif font-medium text-[#141210] line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-[#6E675F]">Size: {item.size} &middot; Qty: {item.qty} &middot; HSN {item.hsn}</p>
                      </div>
                    </div>
                    <span className="font-medium text-[#141210]">
                      ₹{(((item.basePricePaise * (1 + item.gstRate)) / 100) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial & GST Breakdown from Server */}
              {taxBreakdown ? (
                <div className="space-y-2 text-xs text-[#6E675F] pt-3 border-t border-[#E7E2DA]">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal (Net of Discount):</span>
                    <span className="font-medium text-[#141210]">
                      ₹{(taxBreakdown.subtotalTaxablePaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {taxBreakdown.discountPaise > 0 && (
                    <div className="flex justify-between text-[#166534]">
                      <span>Prepaid 5% Incentive:</span>
                      <span className="font-medium">
                        -₹{(taxBreakdown.discountPaise / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {taxBreakdown.isIntraState ? (
                    <>
                      <div className="flex justify-between">
                        <span>CGST (Intra-State 50%):</span>
                        <span className="font-medium text-[#141210]">
                          ₹{(taxBreakdown.cgstTotalPaise / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST (Intra-State 50%):</span>
                        <span className="font-medium text-[#141210]">
                          ₹{(taxBreakdown.sgstTotalPaise / 100).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>IGST (Inter-State 100%):</span>
                      <span className="font-medium text-[#141210]">
                        ₹{(taxBreakdown.igstTotalPaise / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {taxBreakdown.codFeePaise > 0 && (
                    <div className="flex justify-between">
                      <span>COD Handling Fee (incl. GST):</span>
                      <span className="font-medium text-[#141210]">
                        ₹{((taxBreakdown.codFeePaise + taxBreakdown.codFeeGstPaise) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>White-Glove Insured Delivery:</span>
                    <span className="text-[#166534] font-medium">Complimentary</span>
                  </div>

                  <div className="pt-3 border-t border-[#E7E2DA] flex justify-between text-base font-serif font-bold text-[#141210]">
                    <span>Total Payable:</span>
                    <span>₹{(taxBreakdown.grandTotalPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[#6E675F]">
                  <Loader2 size={16} className="animate-spin inline mr-2 text-[#C59B27]" />
                  <span>Computing GST rates on server...</span>
                </div>
              )}

              {/* Legal & GSTIN Compliance Assurance */}
              <div className="pt-2 border-t border-[#E7E2DA] space-y-1.5 text-[10px] text-[#6E675F]">
                <p className="flex items-center">
                  <ShieldCheck size={13} className="text-[#C59B27] mr-1.5 shrink-0" />
                  <span>Official GST Tax Invoice with Section 31 Compliance</span>
                </p>
                <p className="pl-4">Seller GSTIN: 19AAAAZ0000A1Z5 &middot; Place of Supply: {address.state} ({address.stateCode})</p>
              </div>
            </div>
          </div>
        </div>

        {/* COD Phone OTP Verification Modal */}
        <AnimatePresence>
          {otpModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOtpModalOpen(false)}
                className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm"
              />
              <m.div
                variants={modalScaleVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white rounded-sm border border-[#E7E2DA] max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl text-center"
              >
                <div className="w-12 h-12 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] mx-auto mb-4">
                  <Phone size={22} strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#141210]">Verify Cash on Delivery</h3>
                <p className="text-xs text-[#6E675F] mt-2">
                  We have dispatched a 6-digit verification code to <br />
                  <strong className="text-[#141210]">+91 {customer.phone}</strong>
                </p>

                {otpDevHint && (
                  <div className="my-4 p-2.5 bg-[#C59B27]/10 border border-[#C59B27]/40 rounded-sm text-xs font-mono text-[#141210]">
                    [DEV MODE PASSCODE]: <strong>{otpDevHint}</strong>
                  </div>
                )}

                <form onSubmit={handleConfirmCod} className="mt-6 space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 border border-[#E7E2DA] rounded-sm focus:outline-none focus:border-[#C59B27]"
                  />

                  {otpError && (
                    <p className="text-xs text-[#991B1B] font-medium">{otpError}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpModalOpen(false)}
                      className="flex-1 py-3 border border-[#141210] text-[#141210] text-xs uppercase tracking-couture font-medium hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={otpVerifying}
                      className="flex-1 py-3 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium transition-colors cursor-pointer"
                    >
                      {otpVerifying ? 'Confirming...' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Checkout;
