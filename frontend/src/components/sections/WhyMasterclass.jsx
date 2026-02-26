import "./styles/WhyMasterclass.css";
import productQualityImage from "../../assets/images/product_quality.png";

const benefits = [
    "Structured curriculum focused on job-ready, practical skills.",
    "Live coaching with direct Q&A and real-time clarity.",
    "Hands-on assignments designed for portfolio growth.",
    "Actionable next-step roadmap after every session.",
    "Built for outcomes, not endless tutorial watching.",
];

const WhyMasterclass = () => {
    return (
        <section className="masterclass-container" id="why-masterclass">
            <div className="masterclass-inner">
                <div className="masterclass-copy">
                    <h2 className="masterclass-title">Why This Masterclass Is Different</h2>
                    <ul className="benefits-list">
                        {benefits.map((benefit) => (
                            <li key={benefit}>{benefit}</li>
                        ))}
                    </ul>
                </div>
                <div className="masterclass-visual">
                    <img
                        src={productQualityImage}
                        alt="Masterclass quality badge illustration"
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyMasterclass;
