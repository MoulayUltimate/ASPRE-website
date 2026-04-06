import Link from 'next/link';

export default function ShippingPolicy() {
    return (
        <div className="section">
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Shipping Policy</h1>
                    <div className="card">
                        <h3>Digital Delivery</h3>
                        <p>
                            Vectric Aspire 12 is a digital software product. No physical product (CD, DVD, or Box) will be shipped to your physical address.
                        </p>

                        <h3>Delivery Time</h3>
                        <p>
                            <strong>Instant Delivery:</strong> Upon successful payment, you will receive an automated email containing your unique license key and a secure download link for the software. This process typically takes 1-5 minutes.
                        </p>

                        <h3>Delivery Method</h3>
                        <p>
                            The email will be sent to the email address you provided during checkout. Please ensure your email address is entered correctly.
                        </p>

                        <h3>Not Received?</h3>
                        <p>
                            If you have not received your license email within 10 minutes of purchase, please check your Spam or Junk folder. If it is not there, please contact our support team at contact@3daspire.com, and we will resend your license details immediately.
                        </p>

                        <h3>System Requirements</h3>
                        <p>
                            Please ensure your computer meets the minimum system requirements for Vectric Aspire 12 before purchasing. The software is compatible with Windows 10 and Windows 11 (64-bit).
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
