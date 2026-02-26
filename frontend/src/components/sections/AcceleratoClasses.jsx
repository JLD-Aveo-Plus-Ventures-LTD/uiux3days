import "./styles/AcceleratoClasses.css";
import uiuxImage from "../../assets/images/uiux.jpg";
import dataAnalysisImage from "../../assets/images/data_analysis.jpg";
import fullstackImage from "../../assets/images/fullstack.jpg";

const classes = [
    {
        title: "3-Day UI/UX Design Masterclass",
        subtitle: "Master practical UI/UX workflows used by modern product teams.",
        bullets: [
            "Design clean, modern interfaces with clear visual hierarchy",
            "Apply color, typography, and spacing with confidence",
            "Build portfolio-ready screens from wireframe to polished UI",
        ],
        imageSrc: uiuxImage,
        imageAlt: "UI/UX masterclass preview",
    },
    {
        title: "3-Day Data Analysis Masterclass",
        subtitle: "Turn raw datasets into clear, business-ready insights.",
        bullets: [
            "Clean and structure data using analyst best practices",
            "Perform exploratory analysis and build practical dashboards",
            "Present findings using reporting formats teams trust",
        ],
        imageSrc: dataAnalysisImage,
        imageAlt: "Data analysis masterclass preview",
    },
    {
        title: "3-Day Full Stack Development Masterclass",
        subtitle: "Build complete web features across frontend and backend.",
        bullets: [
            "Create maintainable frontend components and pages",
            "Integrate APIs, backend logic, and data flow correctly",
            "Understand deployment, debugging, and production readiness",
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
