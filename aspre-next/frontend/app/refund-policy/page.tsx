import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <div className="section">
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Refund Policy</h1>
                    <div className="card">
                        <h3>30-Day Money-Back Guarantee</h3>
                        <p>
                            We want you to be completely satisfied with your purchase of Vectric Aspire 12. If you are not satisfied with the software for any reason, we offer a full refund within 30 days of your purchase date.
                        </p>

                        <h3>Eligibility for Refund</h3>
                        <p>
                            To be eligible for a refund, your request must be made within 30 days of the original purchase date. We may ask for a reason for your refund request to help us improve our products and services, but providing a reason is not mandatory for the refund to be processed.
                        </p>

                        <h3>How to Request a Refund</h3>
                        <p>
                            To request a refund, please contact our support team at support@3daspire.com with your order number and the email address used for the purchase. Our team will process your request within 24-48 hours.
                        </p>

                        <h3>Refund Processing</h3>
                        <p>
                            Once your refund is approved, it will be processed, and a credit will automatically be applied to your credit card or original method of payment, typically within 5-10 business days, depending on your bank's processing times.
                        </p>

                        <h3>License Deactivation</h3>
                        <p>
                            Upon issuance of a refund, the license key associated with your order will be deactivated and will no longer function. You must uninstall the software from all devices where it has been installed.
                        </p>
                    </div>

                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <Link href="/" className="btn btn-secondary">Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
