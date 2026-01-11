'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';

import FlashSaleBanner from '@/components/home/FlashSaleBanner';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAdminPage) {
        // Admin pages: no header, no footer, no cart
        return <>{children}</>;
    }

    // Public pages: with header, footer, and cart
    return (
        <>
            <FlashSaleBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
        </>
    );
}
