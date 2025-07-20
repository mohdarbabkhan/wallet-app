// lib/utils.js
export function formatDate(dateString:string) {
  // format date nicely
  // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseTransactionSMS(body: string) {
  // Patterns for amount
  const amountPatterns = [
    /(INR|Rs\.?|₹)\s?([\d,]+\.?\d*)/i,
    /amount of (INR|Rs\.?|₹)\s?([\d,]+\.?\d*)/i,
  ];

  // Patterns for type
  const incomeKeywords = /(credited|received|deposited|added)/i;
  const expenseKeywords = /(debited|sent|paid|payment|purchase|withdrawn|transferred|spent)/i;

  // Try to extract amount
  let amount: number | null = null;
  for (const pattern of amountPatterns) {
    const match = body.match(pattern);
    if (match) {
      amount = parseFloat(match[2].replace(/,/g, ''));
      break;
    }
  }
  if (!amount) return null;

  // Determine type
  let type: 'income' | 'expense' = 'expense';
  if (incomeKeywords.test(body)) type = 'income';
  else if (expenseKeywords.test(body)) type = 'expense';

  return { amount, type };
}