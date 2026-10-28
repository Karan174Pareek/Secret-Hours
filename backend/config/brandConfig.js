/**
 * Brand Configuration for ZARIYA Atelier
 * Editable singleton for brand copy, legal identity, and seller GST credentials.
 */

export const brandConfig = {
  name: "SECRET HOURS",
  legalName: "Secret Hours Apparel Private Limited",
  tagline: "We have a secret to tell. Can you keep a secret?",
  secondaryTagline: "A secret society of self-expression.",
  brandHook: "Your secret. Your style. Your hours.",
  packagingNote: "We trust you with our secret.",
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
    conciergeEmail: "concierge@secrethours.com",
    carePhone: "+91 98712 34567",
    pressEmail: "press@secrethours.com",
    hours: "Monday to Saturday, 10:30 AM – 7:30 PM IST",
  },
  prepaidIncentive: {
    enabled: true,
    discountPercentage: 5,
    freeShipping: true,
  },
  codPolicy: {
    enabled: true,
    maxAmountPaise: 5000000,
    flatFeePaise: 15000,
  },
  social: {
    instagram: "https://instagram.com/secrethours",
    pinterest: "https://pinterest.com/secrethours",
    facebook: "https://facebook.com/secrethours",
  }
};
