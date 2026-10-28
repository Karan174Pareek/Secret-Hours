import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageTransition from '../motion/PageTransition';

export const Policies = () => {
  const location = useLocation();
  const path = location.pathname.split('/').pop() || 'shipping';

  const [activeTab, setActiveTab] = useState(
    path === 'returns' ? 'returns' : path === 'privacy' ? 'privacy' : path === 'terms' ? 'terms' : 'shipping'
  );

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-1">
              Atelier Governance &amp; Compliance
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141210]">
              Legal, Policies &amp; Disclosures
            </h1>
          </div>

          {/* Policy Navigation Tabs */}
          <div className="flex border-b border-[#E7E2DA] justify-center space-x-6 text-xs uppercase tracking-couture font-medium mb-12 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'shipping' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F] hover:text-[#141210]'
              }`}
            >
              Shipping &amp; Delivery
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'returns' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F] hover:text-[#141210]'
              }`}
            >
              Returns &amp; Cancellations
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F] hover:text-[#141210]'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'terms' ? 'border-b-2 border-[#C59B27] text-[#141210] font-bold' : 'text-[#6E675F] hover:text-[#141210]'
              }`}
            >
              Terms of Service
            </button>
          </div>

          {/* Policy Document Card */}
          <div className="bg-white border border-[#E7E2DA] rounded-sm p-8 sm:p-12 shadow-luxury-sm text-xs sm:text-sm text-[#3D3833] leading-relaxed space-y-6">
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#141210]">Shipping &amp; White-Glove Delivery Policy</h2>
                <p>
                  At ZARIYA Atelier, every couture garment represents hundreds of artisan hours. To ensure your heirloom arrives in pristine condition, all shipments are packed in unbleached cotton muslin garment bags and placed inside water-resistant, tamper-proof archival outer boxes.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Domestic Delivery Timelines (India)</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#6E675F]">
                  <li><strong>Pret &amp; Ready-to-Wear:</strong> Dispatched within 48 to 72 business hours. Transit takes 2 to 4 business days.</li>
                  <li><strong>Haute Couture &amp; Bridal Ensembles:</strong> Handcrafted to client specifications. Dispatched within 2 to 4 weeks with weekly atelier status updates.</li>
                </ul>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Insurance &amp; White-Glove Transit</h3>
                <p>
                  All shipments are 100% insured against loss or transit damage at no extra charge to the client. Packages require a signed proof-of-delivery or verified OTP hand-off.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#141210]">Returns, Alterations &amp; Cancellation Policy</h2>
                <p>
                  Due to the handcrafted, limited-edition nature of Indian haute couture and the high value of natural mulberry silk and electroplated zari, standard off-the-rack return models do not apply to bespoke garments.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Complimentary Bespoke Alterations</h3>
                <p>
                  We offer one round of complimentary bespoke fit alterations on all couture ensembles within 14 days of delivery. Clients may either visit our Hauz Khas atelier or arrange complimentary reverse courier pickup.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Cancellation Window</h3>
                <p>
                  Orders may be cancelled within 24 hours of placement for a 100% immediate refund to the original payment source. Once fabric cutting or zari embroidery has commenced after 24 hours, cancellations cannot be accepted.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Damaged or Defective Items</h3>
                <p>
                  In the rare event that an item arrives damaged in transit, please notify our concierge within 48 hours of delivery at concierge@zariyaatelier.com with photographic evidence for immediate replacement or full refund.
                </p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#141210]">Privacy Policy &amp; Data Confidentiality</h2>
                <p>
                  Zariya Haute Couture Private Limited ("ZARIYA", "we", "our") respects client confidentiality. We collect personal information (name, delivery address, phone, email, and optional B2B GSTIN) solely for order processing, GST compliance, and atelier concierge communication.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Payment Security</h3>
                <p>
                  We never store client credit card numbers, CVVs, or netbanking passwords on our servers. All transactions are processed through Razorpay's PCI-DSS Level 1 compliant secure payment gateway.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Zero Third-Party Data Sharing</h3>
                <p>
                  We do not sell, rent, or lease client lists or behavioral data to third-party advertisers. Data is shared strictly with regulatory tax authorities (GST e-invoicing portals) and our licensed logistics partners.
                </p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#141210]">Terms of Service</h2>
                <p>
                  These Terms govern your use of the ZARIYA Atelier digital store. By purchasing or booking an atelier consultation, you agree to these terms.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Pricing, Slabs &amp; Indian GST</h3>
                <p>
                  All product prices are quoted with explicit GST breakdowns in compliance with Central and State Goods and Services Tax Acts. Slabs are governed by taxable value per piece (5% for taxable value &le; ₹2,500; 18% for &gt; ₹2,500). Official Section 31 tax invoices with sequential FY numbers are issued for every completed transaction.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Intellectual Property</h3>
                <p>
                  All textile weave motifs, garment pattern geometries, 3D shader code, photographs, and branding are the exclusive proprietary property of Zariya Haute Couture Private Limited.
                </p>
                <h3 className="font-serif text-base font-bold text-[#141210] pt-2">Jurisdiction</h3>
                <p>
                  Any disputes arising in connection with transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts of Siliguri, West Bengal, India.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Policies;
