export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "ccm",
    name: "CCM Dashboard",
    description: "A resource for CCM members and community advocates, which provides data about CCM governance, grant funding, and performance, to support decision-making and evidence-based advocacy.",
    stripe_price_id: null,
    features: ["Contact information for CCM members", "Grant timelines", "Budgets and expenditures","Performance data"],
    url: "https://dataetc.org/projects/ccm",
    buttontext: "Open dashboard",
  },
  {
    id: "uqd",
    name: "UQD Dashboard",
    description:
      "This dashboard is a space to track the Unfunded Quality Demand, or UQD.  The UQD contains strategically focused and technically sound activities that can be funded throughout the three-year cycle through savings, efficiencies, or when additional resources become available during the cycle.",
    features: [
      "Track community priorities that weren't funded",
      "Advocacy tool for reprogramming and Portfolio Optimization",
    ],
    url: "https://dataetc.org/projects/uqd",
    buttontext: "Open dashboard",
  },
  {
    id: "rise",
    name: "RISE Report",
    description:
      "The Representation, Inclusion, Sustainability, and Equity (RISE) study was a global, independent, civil society-owned research project to assess the accountability of Country Coordinating Mechanisms (CCMs) to communities and civil society.",
    features: [
      "Findings from a global research study on CCMs",
      "Identifies barriers and pathways for community engagement",
      "Recommendations for strengthening CCM functioning",
    ],
    url: "https://www.dataetc.org/projects/rise/resources/RISE%20Report.pdf",
    buttontext: "Download report",
  },
]
