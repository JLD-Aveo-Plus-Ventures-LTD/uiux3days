import React, { useState } from "react";
import "./styles/HeroSection.css";
import AiIcon from "../../assets/images/AI.png";

const HeroSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayVideo = () => {
        setIsPlaying(true);
        // Video play logic would go here
        console.log("Playing video...");
    };

    return (
        <div className="hero-container">
            <main className="main-content">
                <div className="badge">
                    <img src={AiIcon} alt="Star" />
                    <span className="badge-text">
                        Join us to build a Mobile App & Website LIVE
                    </span>
                </div>

                <h1 className="hero-title">
                    The Smart Designer 3-Day Masterclass
                </h1>

                <p className="description">
                    Strictly for designers who are stuck and want something
                    different. Stop guessing. Fix your invisible mistakes, and
                    learn the strategy YouTube won't teach you.
                </p>

                <div className="event-date">
                    <span className="date-label">Event Date:</span>
                    <span className="date-value">
                        LIVE: March 6 – 8th, 2026
                    </span>
                </div>
            </main>
            <div className="video-section">
                <div className="video-background">
                    <div className="grid-overlay"></div>
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>

                    {!isPlaying ? (
                        <div className="video-info">
                            <svg
                                onClick={handlePlayVideo}
                                width="36"
                                height="36"
                                viewBox="0 0 32 32"
                                fill="none"
                                className="play-link"
                            >
                                <path d="M10 8L22 16L10 24V8z" fill="green" />
                            </svg>
                            <div className="video-text">
                                <div className="video-title">
                                    Watch introduction video
                                </div>
                                <div className="video-meta">
                                    <span>5 mins</span>
                                    <span className="dot">•</span>
                                    <span
                                        className="play-link"
                                        onClick={handlePlayVideo}
                                    >
                                        Play video
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
