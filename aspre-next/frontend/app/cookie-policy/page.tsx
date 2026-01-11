import Link from 'next/link';

export default function CookiePolicy() {
    return (
        <div className="section">
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Cookie Policy</h1>
                    <div className="card">
                        <p>Last updated: January 2025</p>

                        <h3>1. What Are Cookies</h3>
                        <p>
                            Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                        </p>

                        <h3>2. How We Use Cookies</h3>
                        <p>
                            We use cookies for a number of different purposes. Some cookies are necessary for technical reasons; some enable a personalized experience for both visitors and registered users; and some allow the display of advertising from selected third party networks.
                        </p>

                        <h3>3. Types of Cookies We Use</h3>
                        <ul>
                            <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
                            <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</li>
                            <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
                        </ul>

                        <h3>4. Controlling Cookies</h3>
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies.
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
