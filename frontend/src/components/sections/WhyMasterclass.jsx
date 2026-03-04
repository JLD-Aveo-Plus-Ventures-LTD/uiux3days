import "./styles/WhyMasterclass.css";
import productQualityImage from "../../assets/images/product_quality.png";

const benefits = [
    "Break out of the tutorial loop: Stop just watching videos and learn how to actually execute real world projects.",
    "Become a problem solver: Companies do not just hire people who can click around in Figma, Excel, or React. They hire professionals who solve actual business problems.",
    "Master the core tech pillars: Build a solid foundation in either UI UX Design, Data Analysis, or Full Stack Development.",
    "Learn from senior experts: Get direct access to industry professionals so you can ask questions and get real time feedback.",
    "Prove your new skills: Earn a Certificate of Completion to show future employers and clients that you are ready for the job.",
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
