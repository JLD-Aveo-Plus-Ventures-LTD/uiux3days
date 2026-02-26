import AcceleratoClasses from "./sections/AcceleratoClasses.jsx";
import AcceleratorSeries from "./sections/AcceleratorSeries.jsx";
import BookingForm from "./sections/BookingForm.jsx";
import ElevateSkills from "./sections/ElevateSkills.jsx";
import Footer from "./sections/Footer.jsx";
import HeroSection from "./sections/HeroSection.jsx";
import Navbar from "./sections/Navbar.jsx";
import SecureYourSeat from "./sections/SecureYourSeat.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import WhyMasterclass from "./sections/WhyMasterclass.jsx";

function LandingPage() {
    return (
        <main className="landing-page">
            <Navbar />
            <HeroSection />
            <SecureYourSeat />
            <AcceleratorSeries />
            <AcceleratoClasses />
            <WhyMasterclass />
            <BookingForm />
            <Testimonials />
            <ElevateSkills />
            <Footer />
        </main>
    );
}

export default LandingPage;
