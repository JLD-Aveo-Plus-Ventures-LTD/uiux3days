import "./styles/Testimonials.css";

const testimonials = [
    {
        name: "Peggy Onyinyechi Otto",
        // role: "UI/UX Learner",
        rating: 5,
        quote: "“Coach David’s UI/UX training at JLD Institute has been truly exceptional! His engaging teaching style simplifies complex concepts, making learning enjoyable. By breaking down intricate ideas, he fosters a positive, supportive learning environment. Under his guidance, I’ve gained confidence in my skills, and I know I will improve even more. I highly recommend this program to anyone eager to grow in UI/UX design. Thank you, Coach David, for this incredible training!”",
    },
    {
        name: "Odeshile Rukayat Omobolanle",
        // role: "Data Analyst Trainee",
        rating: 5,
        quote: "“This UI/UX class has been an insightful and rewarding journey! From understanding user experience fundamentals to working on my first portfolio project, I’ve learned so much. Initially, I was unsure about my direction in UI/UX, but practical exercises, like redesigning the Spotify app, have helped me improve. The process has had challenges, like mastering new tools, but the learning experience has been incredible. I’m excited to refine my skills and grow further!”",
    },
    {
        name: "Hillz",
        // role: "Career Switcher",
        rating: 5,
        quote: "“I had an incredible experience with the UI/UX design course at JLD Aveo Institute. As a beginner, I gained hands-on knowledge in wireframing, prototyping, and using tools like Figma. The real-world projects boosted my confidence”",
    },
];

const Testimonials = () => {
    return (
        <section className="testimonials-section" id="testimonials">
            <div className="testimonials-inner">
                <h2>Stories from real people</h2>

                <div className="testimonials-grid">
                    {testimonials.map((item, index) => (
                        <article className="testimonial-card" key={`${item.name}-${index}`}>
                            <h3>{item.name}</h3>
                            {item.role ? <p className="testimonial-role">{item.role}</p> : null}
                            <p className="testimonial-stars" aria-label={`${item.rating} star rating`}>
                                {"★".repeat(item.rating)}
                            </p>
                            <div className="testimonial-divider" aria-hidden="true"></div>
                            <p className="testimonial-quote">{item.quote}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
