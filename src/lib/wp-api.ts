// lib/wc-api.ts

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  count?: number;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
}

const WP_URL = 'https://fontecmobiles.com';

/**
 * Fetches top-level product categories from WooCommerce with server-side caching.
 * @param perPage Number of categories to fetch (default: 20)
 * @returns Array of filtered WooCommerce categories
 */
export async function fetchTopCategories(perPage = 20): Promise<WPCategory[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/store/v1/products/categories?parent=0&per_page=${perPage}`,
      {
        // ⚡ Cache response on Next.js server for 1 hour (3600s)
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch WP categories. Status: ${res.status}`);
      return [];
    }

    const data: WPCategory[] = await res.json();

    // Exclude default/uncategorized entries
    return data.filter(
      (cat) =>
        cat.slug.toLowerCase() !== 'uncategorized' &&
        cat.name.toLowerCase() !== 'uncategorized'
    );
  } catch (error) {
    console.error('Error fetching categories in fetchTopCategories:', error);
    return [];
  }
}

/**
 * Fetches child categories for a given parent ID.
 * @param parentId ID of the parent category
 */
export async function fetchChildCategories(parentId: number): Promise<WPCategory[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/store/v1/products/categories?parent=${parentId}&per_page=50`,
      {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error(`Error fetching child categories for parent ${parentId}:`, error);
    return [];
  }
}