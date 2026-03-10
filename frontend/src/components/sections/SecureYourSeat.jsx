import "./styles/SecureYourSeat.css";
import watchVideo from "../../assets/images/watch-video.png";
import fillForm from "../../assets/images/fill-form.png";
import bookInterview from "../../assets/images/book-interview.png";

const steps = [
    {
        id: 1,
        icon: watchVideo,
        title: "STEP 1",
        description: "Watch the 2-minute breakdown video above.",
    },
    {
        id: 2,
        icon: fillForm,
        title: "STEP 2",
        description: "Fill out the application form below.",
    },
    {
        id: 3,
        icon: bookInterview,
        title: "STEP 3",
        ctaLabel: "Join the Waitlist",
        ctaHref: "https://chat.whatsapp.com/HVvtUAdwpu9CToJja1qBwa?mode=gi_t",
    },
];

const SecureYourSeat = () => {
    return (
        <section className="secure-seat-container" id="how-it-works">
            <h2 className="secure-seat-title">Watch First, Then Decide</h2>

            <div className="steps-container">
                {steps.map((step) => (
                    <article key={step.id} className="step-card">
                        <img src={step.icon} className="icon-circle" alt={step.title} />
                        <h3 className="step-title">{step.title}</h3>
                        {step.description && <p className="step-description">{step.description}</p>}
                        {step.ctaHref && (
                            <a
                                href={step.ctaHref}
                                className="step-waitlist-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {step.ctaLabel}
                            </a>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
};

export default SecureYourSeat;
