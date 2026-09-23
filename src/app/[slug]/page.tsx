import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

const WP_BASE_URL = 'https://fontecmobiles.com';

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

async function getWPPageBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const pages = await res.json();
    if (Array.isArray(pages) && pages.length > 0) {
      return pages[0];
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch WP page for slug: ${slug}`, error);
    return null;
  }
}

function decodeHtmlEntities(str: string) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWPPageBySlug(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  const title = decodeHtmlEntities(page.title?.rendered || 'Fontec Mobiles');
  const excerpt = decodeHtmlEntities(page.excerpt?.rendered || '').replace(/<[^>]*>/g, '').slice(0, 160);

  return {
    title: `${title} | Fontec Mobiles`,
    description: excerpt || `${title} page on Fontec Mobiles.`,
  };
}

export default async function DynamicWPPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  const page = await getWPPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const title = decodeHtmlEntities(page.title?.rendered || '');
  const content = page.content?.rendered || '';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {page.date && (
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Last updated: {new Date(page.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_a]:text-red-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}
