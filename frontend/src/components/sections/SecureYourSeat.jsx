import "./styles/SecureYourSeat.css";
import watchVideo from "../../assets/images/watch-video.png";
import fillForm from "../../assets/images/fill-form.png";
import bookInterview from "../../assets/images/book-interview.png";

const SecureYourSeat = () => {
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
            description: "Book your interview slot on the next page.",
        },
    ];

    return (
        <div className="secure-seat-container">
            <h1 className="secure-seat-title">How to Secure Your Seat</h1>

            <div className="steps-container">
                {steps.map((step) => (
                    <a key={step.id} href="#">
                        {" "}
                        <div className="step-card">
                            <img src={step.icon} className="icon-circle" />
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">
                                {step.description}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SecureYourSeat;
