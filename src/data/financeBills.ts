import { FinanceBillClause } from '../types';

export const FINANCE_BILL_CLAUSES: FinanceBillClause[] = [
  {
    id: "fb-1",
    title: "Eco Levy on Electronic & Plastic Products",
    category: "Environment & Trade",
    description: "Proposed 16% tax on electronic items, diapers, plastic packaging, and digital equipment.",
    impactOnCitizens: "Increased prices on household essentials, mobile phones, computers, and sanitary products.",
    billYear: "2024"
  },
  {
    id: "fb-2",
    title: "16% VAT on Bread & Agricultural Inputs",
    category: "Food & Agriculture",
    description: "Removal of VAT tax exemption on bread, animal feed, and agricultural fertilizers.",
    impactOnCitizens: "Higher cost of daily food for low-income households and increased production costs for farmers.",
    billYear: "2024"
  },
  {
    id: "fb-3",
    title: "2.5% Annual Motor Vehicle Circulation Tax",
    category: "Transport & Assets",
    description: "Annual tax calculated based on vehicle value with a minimum threshold of KES 5,000.",
    impactOnCitizens: "Substantial annual cash outlay for public transport operators (Matatus), personal vehicle owners, and logistics firms.",
    billYear: "2024"
  },
  {
    id: "fb-4",
    title: "Increased Excise Duty on Digital Financial Transfers",
    category: "Banking & Mobile Money",
    description: "Raised excise duty rate on mobile money transfers (M-Pesa) and banking transactions from 15% to 20%.",
    impactOnCitizens: "Increased cost for everyday digital payments, remittances, and small business transactions.",
    billYear: "2025"
  },
  {
    id: "fb-5",
    title: "Mandatory Housing Levy Withholding Adjustments",
    category: "Labor & Payroll",
    description: "Direct deduction of 1.5% from gross income matched by employers, expanded to self-employed sectors.",
    impactOnCitizens: "Reduced net take-home pay for formal workers and mandatory compliance for informal micro-enterprises.",
    billYear: "2025"
  }
];
