/**
 * Indian GST Engine Configuration
 * Rules governing apparel tax slabs, interstate vs intrastate splits, and ancillary service charges.
 */

export const gstConfig = {
  // Threshold tested on the pre-tax taxable value per piece (after line-item discounts)
  // Rs 2,500.00 = 250,000 paise
  slabThresholdPaise: 250000,

  // GST rates expressed as decimals (0.05 = 5%, 0.18 = 18%)
  rates: {
    low: {
      rate: 0.05,
      percentage: 5,
      cgstRate: 0.025,
      sgstRate: 0.025,
      igstRate: 0.05,
      description: "Apparel taxable value <= Rs 2,500 per piece",
    },
    standard: {
      rate: 0.18,
      percentage: 18,
      cgstRate: 0.09,
      sgstRate: 0.09,
      igstRate: 0.18,
      description: "Apparel taxable value > Rs 2,500 per piece",
    },
  },

  // Default HSN codes for fashion apparel
  defaultHsn: {
    woven: "6204", // Women's suits, dresses, skirts, ensembles (woven)
    embroidered: "6211", // Track suits, ski suits and swimwear, other garments (specialty couture)
    menswear: "6203", // Men's suits, ensembles, jackets, blazers, trousers
    shawlsScarves: "6214", // Shawls, scarves, mufflers, mantillas, veils
  },

  // NOTE: Apply the same GST treatment to shipping and COD handling fees as the goods.
  // The business owner should confirm with their Chartered Accountant (CA) whether shipping
  // qualifies as a composite supply bundled with apparel (attracting the principal rate)
  // or a standalone transportation service attracting standard 18% GST.
  applyGstToAncillaryFees: true,

  // Ancillary fee GST rate when treated separately (18% standard rate)
  ancillaryGstRate: 0.18,

  // Seller State defaults (can be overridden via process.env)
  sellerStateCode: process.env.SELLER_STATE_CODE || "19", // "19" = West Bengal (Siliguri)
  sellerGstin: process.env.SELLER_GSTIN || "19AAAAZ0000A1Z5",

  // State code dictionary (Indian GST 2-digit state codes)
  stateCodes: {
    "01": "Jammu & Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "26": "Dadra & Nagar Haveli and Daman & Diu",
    "27": "Maharashtra",
    "29": "Karnataka",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman & Nicobar Islands",
    "36": "Telangana",
    "37": "Andhra Pradesh",
    "38": "Ladakh",
  }
};
