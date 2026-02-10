import LeadForm from "./LeadForm.jsx";
import BookingForm from "./sections/BookingForm.jsx";
import Footer from "./sections/Footer.jsx";
import HeroSection from "./sections/HeroSection.jsx";
import Navbar from "./sections/Navbar.jsx";
import SecureYourSeat from "./sections/SecureYourSeat.jsx";
import WhyMasterclass from "./sections/WhyMasterclass.jsx";

function LandingPage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <SecureYourSeat />
            <WhyMasterclass />
            <BookingForm />
            <Footer />
        </>
    );
}

export default LandingPage;
