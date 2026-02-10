import "./styles/WhyMasterclass.css";

const WhyMasterclass = () => {
    const benefits = [
        {
            id: 1,
            text: "Watch us build a professional Mobile App and Website live from scratch, so you see exactly how it's done.",
        },
        {
            id: 2,
            text: "We reveal the specific, invisible mistakes that are keeping your designs looking amateur.",
        },
        {
            id: 3,
            text: 'Designed specifically for creators who feel stuck and want to break out of the "beginner" loop.',
        },
        {
            id: 4,
            text: "Get direct access to senior industry experts to ask questions and get real-time feedback.",
        },
        {
            id: 5,
            text: 'Learn the "uncommon" strategies smart designers use to work 2x faster than everyone else.',
        },
        {
            id: 6,
            text: "Earn a Certificate of Completion to prove you have mastered the professional workflow.",
        },
    ];

    return (
        <div className="masterclass-container">
            <h2 className="masterclass-title">Why This Masterclass</h2>

            <div className="benefits-grid">
                {benefits.map((benefit) => (
                    <div key={benefit.id} className="benefit-item">
                        <div className="checkmark-icon">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="#10B981"
                                    opacity="0.2"
                                />
                                <path
                                    d="M8 12L11 15L16 9"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className="benefit-text">{benefit.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhyMasterclass;
