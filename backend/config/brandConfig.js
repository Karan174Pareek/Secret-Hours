/**
 * Brand Configuration for ZARIYA Atelier
 * Editable singleton for brand copy, legal identity, and seller GST credentials.
 */

export const brandConfig = {
  name: "ZARIYA Atelier",
  legalName: "Zariya Haute Couture Private Limited",
  tagline: "Architectural Minimalism Reimagined in Heritage Silk & Zari",
  gstin: process.env.SELLER_GSTIN || "19AAAAZ0000A1Z5",
  state: "West Bengal",
  stateCode: process.env.SELLER_STATE_CODE || "19",
  pan: "AAAAZ0000A",
  cin: "U17299WB2026PTC987654",
  address: {
    line1: "The Atelier, Sevoke Road, Near Vega Circle",
    line2: "Siliguri Commercial District",
    city: "Siliguri",
    state: "West Bengal",
    pincode: "734001",
    country: "India",
  },
  contact: {
    conciergeEmail: "concierge@zariyaatelier.com",
    carePhone: "+91 98712 34567",
    pressEmail: "press@zariyaatelier.com",
    hours: "Monday to Saturday, 10:30 AM – 7:30 PM IST",
  },
  prepaidIncentive: {
    enabled: true,
    discountPercentage: 5, // 5% instant discount on prepaid Razorpay orders to nudge away from COD
    freeShipping: true,
  },
  codPolicy: {
    enabled: true,
    maxAmountPaise: 5000000, // Maximum Rs 50,000 for COD
    flatFeePaise: 15000, // Rs 150 handling fee
  },
  social: {
    instagram: "https://instagram.com/zariyaatelier",
    pinterest: "https://pinterest.com/zariyaatelier",
    facebook: "https://facebook.com/zariyaatelier",
  }
};
