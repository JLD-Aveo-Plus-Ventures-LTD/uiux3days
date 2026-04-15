import "./styles/AcceleratoClasses.css";
import uiuxImage from "../../assets/images/uiux.jpg";
import dataAnalysisImage from "../../assets/images/data_analysis.jpg";
import fullstackImage from "../../assets/images/fullstack.jpg";

const classes = [
    {
        title: "5-Day UI/UX Design Masterclass",
        subtitle: "Master practical UI/UX workflows used by modern product teams.",
        bullets: [
            "Watch us build a professional Mobile App and Website live from scratch, so you see exactly how it’s done.",
            "Designed specifically for creators who feel stuck and want to break out of the \"beginner\" loop.",
            "Learn the \"uncommon\" strategies smart designers use to work 2x faster than everyone else.",
            "We reveal the specific, invisible mistakes that are keeping your designs looking amateur.",
            "Get direct access to senior industry experts to ask questions and get real-time feedback.",
            "Earn a Certificate of Completion to prove you have mastered the professional workflow."
        ],
        imageSrc: uiuxImage,
        imageAlt: "UI/UX masterclass preview",
    },
    {
        title: "5-Day Data Analysis Masterclass",
        subtitle: "Turn raw datasets into clear, business-ready insights.",
        bullets: [
            "Watch us turn raw datasets into clear, business ready insights live, so you see exactly how a real analyst works.",
            "Designed specifically for beginners who feel overwhelmed by messy data and want to break out of the tutorial loop.",
            "Learn the uncommon strategies smart analysts use to clean and structure data using analyst best practices in half the time.",
            "We reveal the specific mistakes that make reports confusing, and show you how to perform exploratory analysis and build practical dashboards instead.",
            "Get direct access to senior data experts so you can learn how to present findings using reporting formats that real business teams actually trust.",
            "Earn a Certificate of Completion to prove you have mastered the professional data workflow."
        ],
        imageSrc: dataAnalysisImage,
        imageAlt: "Data analysis masterclass preview",
    },
    {
        title: "5-Day Full Stack Development Masterclass",
        subtitle: "Build complete web features across frontend and backend.",
        bullets: [
            "Watch us build complete web features across the frontend and backend live from scratch, so you see exactly how the full picture comes together.",
            "Designed specifically for coders who feel stuck building isolated parts and want to break out of the beginner loop.",
            "Learn the uncommon strategies smart engineers use to create maintainable frontend components and pages much faster than average developers.",
            "We reveal the specific, invisible mistakes that break apps, and show you exactly how to integrate APIs, backend logic, and data flow correctly.",
            "Get direct access to senior developers to ask questions and master the reality of deployment, debugging, and production readiness.",
            "Earn a Certificate of Completion to prove you have mastered the professional full stack workflow."
        ],
        imageSrc: fullstackImage,
        imageAlt: "Full stack development masterclass preview",
    },
];

const AcceleratoClasses = () => {
    return (
        <section className="accelerator-classes" id="masterclass-tracks">
            <div className="accelerator-classes-inner">
                {classes.map((course, index) => (
                    <article
                        key={course.title}
                        className={`class-item ${index % 2 === 1 ? "reverse" : ""}`}
                    >
                        <div className="class-copy">
                            <h3>{course.title}</h3>
                            <p>{course.subtitle}</p>
                            <ul>
                                {course.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="class-visual">
                            <img src={course.imageSrc} alt={course.imageAlt} loading="lazy" />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default AcceleratoClasses;
