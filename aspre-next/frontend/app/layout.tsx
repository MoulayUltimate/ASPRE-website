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
        'Vectric Aspire 12, CNC software, 3D carving software, CNC design, Aspire license, woodworking software',
    openGraph: {
        title: 'Vectric Aspire 12 - Full Lifetime License',
        description:
            'Professional 3D CNC design software. Instant delivery. Save $1,876 today!',
        type: 'website',
        images: ['/images/og-image.jpg'],
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
