import "./styles/AcceleratorSeries.css";

const tracks = ["UI/UX Expert", "Full Stack Developer", "Data Analyst"];

const AcceleratorSeries = () => {
    return (
        <section className="accelerator-series" id="accelerator-series">
            <div className="accelerator-series-inner">
                <h2>What Is The 3-Day Tech Accelerator Series?</h2>
                <p>
                    This is an intensive, practical, and career-oriented masterclass series designed for ambitious individuals who want to break into tech — fast and correctly. Each skill is taught in its own focused 3-Day Masterclass:
                </p>
                <div className="series-tags" aria-label="Available tracks">
                    {tracks.map((track) => (
                        <span key={track} className="series-tag">
                            {track}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AcceleratorSeries;
