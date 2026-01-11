
import HeroSection from '@/components/home/HeroSection';
import ProductShowcase from '@/components/home/ProductShowcase';
import CouponBanner from '@/components/home/CouponBanner';
import StatsCounter from '@/components/home/StatsCounter';
import VideoShowcase from '@/components/home/VideoShowcase';
import TrustpilotReviews from '@/components/home/TrustpilotReviews';
import PricingBreakdown from '@/components/home/PricingBreakdown';
import ProductSection from '@/components/home/ProductSection';
import VideoTutorials from '@/components/home/VideoTutorials';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FAQSection from '@/components/home/FAQSection';

export default function Home() {
    return (
        <>


            {/* Hero Section */}
            <HeroSection />

            {/* Product Offer Section */}
            <section className="section">
                <div className="container text-center">
                    {/* Section Title */}
                    <h2 style={{ color: 'var(--gray-900)', fontSize: '3rem', marginBottom: '1rem' }}>
                        Still Paying <span className="price-retail" style={{ textDecoration: 'line-through', color: 'var(--gray-400)' }}>$1,995</span> for Aspire 12?
                    </h2>
                    <p style={{ color: 'var(--gray-600)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                        Discover how <strong style={{ color: '#00b67a' }}>8,347 smart CNC professionals</strong> are getting the
                        exact same Vectric Aspire 12 software for <strong style={{ color: '#ff6b35' }}>$1,876 less</strong> – without
                        sacrificing a single feature.
                    </p>

                    {/* Coupon Banner */}
                    <CouponBanner />

                    {/* Product Section */}
                    <ProductSection />

                    {/* Stats Counter */}
                    <StatsCounter />
                </div>
            </section>

            <div className="section-divider" />

            {/* Video Showcase */}
            <VideoShowcase />

            <div className="section-divider" />

            {/* Trustpilot Reviews */}
            <TrustpilotReviews />

            <div className="section-divider" />

            {/* Pricing Breakdown */}
            <PricingBreakdown />

            <div className="section-divider" />

            {/* Video Tutorials */}
            <VideoTutorials />

            <div className="section-divider" />

            {/* Why Choose Us */}
            <WhyChooseUs />

            <div className="section-divider" />

            {/* FAQ Section */}
            <FAQSection />
        </>
    );
}
