import { useState } from "react";
import "./styles/HeroSection.css";
import videoSrc from "../../assets/videos/landing_video.mp4";
import videoPoster from "../../assets/images/video-bg.png";

const HeroSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayVideo = () => setIsPlaying(true);
    const handleCloseVideo = () => setIsPlaying(false);

    return (
        <section className="hero-container" id="hero">
            <div className="main-content">
                <h1 className="hero-title">The 3-Day Tech Accelerator Masterclass</h1>
                <p className="description">
                    Three intensive sessions to help you become job-ready in UI/UX
                    Design, Data Analysis, or Full Stack Development.
                </p>
                <div className="event-date">
                    <span className="date-label">LIVE EVENT:</span>
                    <span className="date-value">March 10th - 13th, 2026</span>
                </div>
                {/* <a href="#booking-form" className="hero-cta">
                    APPLY NOW & SECURE YOUR SEAT
                </a> */}
            </div>

            <div className="video-section">
                <div className="video-background">
                    <video
                        src={videoSrc}
                        className="video-preview"
                        poster={videoPoster}
                        preload="metadata"
                        muted
                        playsInline
                        aria-hidden="true"
                    />
                    <div className="grid-overlay" aria-hidden="true"></div>
                    <div className="gradient-orb orb-1" aria-hidden="true"></div>
                    <div className="gradient-orb orb-2" aria-hidden="true"></div>

                    {!isPlaying ? (
                        <button
                            type="button"
                            className="video-info"
                            onClick={handlePlayVideo}
                            aria-label="Play introduction video"
                        >
                            <span className="play-icon">▶</span>
                            <span className="video-text">
                                <span className="video-title">Watch Introduction Video</span>
                                <span className="video-meta">4 mins</span>
                            </span>
                        </button>
                    ) : (
                        <>
                            <video
                                src={videoSrc}
                                controls
                                autoPlay
                                className="active-video"
                                onEnded={handleCloseVideo}
                            />
                            <button
                                type="button"
                                className="close-button"
                                onClick={handleCloseVideo}
                                aria-label="Close video"
                            >
                                ×
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
