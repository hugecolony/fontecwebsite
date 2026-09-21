import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number | null | undefined): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;

  if (num == null || isNaN(num)) {
    return 'Rs. 0';
  }

  // Format number with commas for thousands
  const formattedNumber = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

  return `Rs. ${formattedNumber}`;
}
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function getDiscountPercent(
  regularPrice: string,
  salePrice: string
): number {
  const regular = parseFloat(regularPrice);
  const sale = parseFloat(salePrice);
  if (!regular || !sale) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}