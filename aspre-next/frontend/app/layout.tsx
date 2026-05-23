import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import ChatWidget from '@/components/chat/ChatWidget';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['600', '700', '800', '900'],
    variable: '--font-poppins',
    display: 'swap',
});

export const runtime = 'edge';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.3daspire.com'),
    title: 'Vectric Aspire 12 - Full Lifetime License | Save $1,876 Today',
    description:
        'Get Vectric Aspire 12 professional 3D CNC design software with full lifetime license. Instant delivery, trusted by 8,000+ CNC professionals. Save $1,876 today!',
    keywords:
        'Vectric Aspire 12, CNC software, 3D carving software, CNC design, Aspire license, woodworking software, vectric aspire lifetime license, buy vectric aspire 12',
    alternates: {
        canonical: 'https://www.3daspire.com/',
    },
    openGraph: {
        title: 'Vectric Aspire 12 - Full Lifetime License | Save $1,876 Today',
        description:
            'Professional 3D CNC design software with full lifetime license. Trusted by 8,347+ CNC professionals. Instant delivery. Save $1,876 today!',
        type: 'website',
        url: 'https://www.3daspire.com/',
        siteName: '3daspire.com',
        locale: 'en_US',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Vectric Aspire 12 - Full Lifetime License',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vectric Aspire 12 - Full Lifetime License | Save $1,876 Today',
        description:
            'Professional 3D CNC design software. Trusted by 8,347+ CNC professionals. Instant delivery. Save $1,876 today!',
        images: ['/images/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: [
            '0ExB-H4z2ro44xPk-SN7slO5FnjoNg3tbEeUtayT2Z0',
            'uQJetlDsCI1q7T7vvAm8OuhjjaUj4845YNrTFBczRco'
        ],
    },
    icons: {
        icon: '/images/favicon.png',
    },
};

// JSON-LD structured data — boosts AI search engine citations (GEO)
const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '3daspire.com',
    url: 'https://www.3daspire.com',
    logo: 'https://www.3daspire.com/images/favicon.png',
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@3daspire.com',
        contactType: 'customer support',
        availableLanguage: 'English',
    },
    sameAs: ['https://www.trustpilot.com/review/3daspire.com'],
};

const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '3daspire.com',
    url: 'https://www.3daspire.com',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.3daspire.com/?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Vectric Aspire 12 – Full Lifetime License',
    description:
        'Professional 3D CNC design and carving software with full lifetime license. Includes 3D modeling, toolpath generation, rotary machining, and 300+ post processors. Compatible with all major CNC routers.',
    brand: { '@type': 'Brand', name: 'Vectric' },
    offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '97',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: '3daspire.com' },
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '8347',
        bestRating: '5',
        worstRating: '1',
    },
    category: 'CNC Software',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'DesignApplication',
};

const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Is this a real Aspire 12 license?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. This is a 100% genuine, full-featured Vectric Aspire 12 license with access to all professional features including 3D modeling, toolpath generation, rotary machining, and more. The software is fully functional with no limitations or trial periods.',
            },
        },
        {
            '@type': 'Question',
            name: 'How is my Vectric Aspire 12 license delivered?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Your license key and download link are sent directly to your email within 1-2 minutes after payment confirmation. The email includes your license key, installation instructions, and download links.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does Vectric Aspire 12 work on Windows 10 and Windows 11?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Aspire 12 is fully compatible with Windows 10 and Windows 11 (both 32-bit and 64-bit versions). Minimum requirements: 2GB RAM (8GB recommended), 500MB disk space, and an OpenGL 2.0 compatible graphics card.',
            },
        },
        {
            '@type': 'Question',
            name: 'What CNC machines are supported by Aspire 12?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Aspire 12 works with virtually all CNC routers, mills, and carving machines. It includes post processors for over 300 machine types including ShopBot, Laguna, AXYZ, Multicam, Techno, BobCAD, Mach3, LinuxCNC, and many more.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the refund policy for Vectric Aspire 12?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase for any reason, contact us within 30 days for a full refund. No questions asked.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long does delivery of the Aspire 12 license take?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'License delivery is instant. You will receive your license key and download link via email within 1-2 minutes after payment confirmation. Orders are processed 24/7.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can Aspire 12 be used for commercial projects?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. This is a full commercial license. You can use Aspire 12 to create and sell products, run a business, or take on client projects. There are no restrictions on commercial use.',
            },
        },
        {
            '@type': 'Question',
            name: 'What support is available for installing Aspire 12?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A complete step-by-step installation video guide and dedicated email support are included. Our team is available to assist with any installation questions or technical issues. Most customers complete installation in under 10 minutes.',
            },
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <head>
                {/* Google tag (gtag.js) */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-18041209286"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18041209286');
              gtag('config', 'G-SW7ZNTQKEC');

              function gtag_report_conversion(url) {
                var loaded = false;
                var callback = function () {
                  if (!loaded) {
                    loaded = true;
                    if (typeof(url) != 'undefined') {
                      window.location = url;
                    }
                  }
                };

                // Fallback timeout: redirect after 1 second if gtag callback doesn't fire
                setTimeout(callback, 1000);

                gtag('event', 'conversion', {
                    'send_to': 'AW-18041209286/9lB6CKrxwZccEMaD3JpD',
                    'value': 1.0,
                    'currency': 'EUR',
                    'event_callback': callback
                });
                return false;
              }
            `,
                    }}
                />
                {/* Font Awesome */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                {/* JSON-LD Structured Data — GEO + Rich Results */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
                />
            </head>
            <body>
                <CartProvider>
                    <ConditionalLayout>
                        {children}
                        <AnalyticsTracker />
                        <ChatWidget />
                    </ConditionalLayout>
                </CartProvider>
            </body>
        </html>
    );
}
