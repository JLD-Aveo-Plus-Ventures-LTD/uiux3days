import { Link, useSearchParams } from "react-router-dom";
import Navbar from "./sections/Navbar.jsx";
import Footer from "./sections/Footer.jsx";
import "./sections/styles/RegistrationSuccessPage.css";

const WHATSAPP_GROUP_URL =
    "https://chat.whatsapp.com/HVvtUAdwpu9CToJja1qBwa?mode=gi_t";

function RegistrationSuccessPage() {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get("leadId");

    return (
        <>
            <Navbar />
            <main className="registration-success-main">
                <section className="registration-success-section">
                    <div className="registration-success-card">
                        <p className="registration-success-eyebrow">Success</p>
                        <h1>Congratulations, your registration is successful.</h1>
                        <p className="registration-success-message">
                            Next step: Join the WhatsApp group for updates,
                            onboarding details, and important announcements.
                        </p>
                        {leadId ? (
                            <p className="registration-success-leadid">
                                Registration ID: <strong>{leadId}</strong>
                            </p>
                        ) : null}

                        <div className="registration-success-actions">
                            <a
                                href={WHATSAPP_GROUP_URL}
                                className="registration-success-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join WhatsApp Group
                            </a>
                            <Link to="/" className="registration-success-secondary">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default RegistrationSuccessPage;
