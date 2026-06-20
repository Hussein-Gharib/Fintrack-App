export const currencies = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "LBP", label: "LBP - Lebanese Pound" },
  { code: "SAR", label: "SAR - Saudi Riyal" },
  { code: "AED", label: "AED - UAE Dirham" },
];

export const getCurrency = () => {
  return localStorage.getItem("currency") || "USD";
};

export const setCurrency = (currency) => {
  localStorage.setItem("currency", currency);
};

export const formatMoney = (amount, currency = getCurrency()) => {
  return Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "LBP" ? 0 : 2,
  });
};