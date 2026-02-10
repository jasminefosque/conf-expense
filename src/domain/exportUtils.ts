import { formatCurrency, formatQuantity } from './formatters';
import type { PricingResult } from './types';

/**
 * Export line items as CSV
 */
export function exportToCSV(pricing: PricingResult): string {
  const lines: string[] = [];

  // Header
  lines.push('Name,Unit Cost,Quantity,Total Cost');

  // Line items
  for (const item of pricing.lineItems) {
    const name = `"${item.name}"`;
    const unitCost = formatCurrency(item.unitPrice);
    const quantity = formatQuantity(item.quantity, item.metadata?.forPeople);
    const total = formatCurrency(item.total);
    lines.push(`${name},${unitCost},${quantity},${total}`);
  }

  // Add empty line
  lines.push('');

  // Subtotals
  if (pricing.venueSubtotal > 0) {
    lines.push(`Venue Subtotal,,,${formatCurrency(pricing.venueSubtotal)}`);
  }
  if (pricing.addonsSubtotal > 0) {
    lines.push(`Add-ons Subtotal,,,${formatCurrency(pricing.addonsSubtotal)}`);
  }
  if (pricing.mealsSubtotal > 0) {
    lines.push(`Meals Subtotal,,,${formatCurrency(pricing.mealsSubtotal)}`);
  }

  lines.push(`Subtotal,,,${formatCurrency(pricing.subtotal)}`);

  // Applied promo
  if (pricing.appliedPromo) {
    lines.push(
      `Discount (${pricing.appliedPromo.code}),,,"-${formatCurrency(pricing.appliedPromo.discountAmount)}"`
    );
  }

  // Grand total
  lines.push(`Grand Total,,,${formatCurrency(pricing.grandTotal)}`);

  return lines.join('\n');
}

/**
 * Export plan data as JSON
 */
export function exportToJSON(pricing: PricingResult): string {
  return JSON.stringify(
    {
      lineItems: pricing.lineItems,
      subtotals: {
        venue: pricing.venueSubtotal,
        addons: pricing.addonsSubtotal,
        meals: pricing.mealsSubtotal,
        total: pricing.subtotal,
      },
      promo: pricing.appliedPromo,
      grandTotal: pricing.grandTotal,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

/**
 * Download a file with given content
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
