import { useSearchParams } from "react-router-dom";
import Navbar from "./sections/Navbar.jsx";
import SelectInterviewSlot from "./sections/SelectInterviewSlot.jsx";
import Footer from "./sections/Footer.jsx";

function BookingPage() {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get("leadId");
    // const leadId = 10;

    // If leadId missing, show error message
    if (!leadId) {
        return (
            <>
                <Navbar />
                <main>
                    <section style={{ padding: "80px 20px" }}>
                        <div
                            className="container"
                            style={{ maxWidth: "700px", textAlign: "center" }}
                        >
                            <h2
                                style={{
                                    fontSize: "28px",
                                    marginBottom: "16px",
                                    color: "#0f172a",
                                }}
                            >
                                Booking not available
                            </h2>
                            <p
                                style={{
                                    fontSize: "16px",
                                    color: "#475569",
                                    lineHeight: "1.6",
                                }}
                            >
                                Your booking link is missing required details.
                                Please go back and submit your project form
                                again.
                            </p>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Page layout: Navbar → SelectInterviewSlot section → Footer
    return (
        <>
            <Navbar />
            <SelectInterviewSlot leadId={leadId} />
            <Footer />
        </>
    );
}

export default BookingPage;
