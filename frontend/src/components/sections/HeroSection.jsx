import React, { useState } from "react";
import "./styles/HeroSection.css";
import AiIcon from "../../assets/images/AI.png";
import videoSrc from "../../assets/videos/landing_page_video.mp4";

const HeroSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayVideo = () => {
        setIsPlaying(true);
        // Video play logic would go here
        console.log("Playing video...");
    };

    const handleCloseVideo = () => {
        setIsPlaying(false);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
    };

    const handleThumbnailClick = () => {
        setIsPlaying(true);
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
                        LIVE: February 23rd – 27th, 2026
                    </span>
                </div>
            </main>
            <div className="video-section">
                <div className="video-background">
                    {/* Video Thumbnail Background */}
                    <video
                        src={videoSrc}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            inset: 0,
                            zIndex: 5,
                            borderRadius: 'inherit'
                        }}
                    />

                    <div className="grid-overlay" style={{ zIndex: 10 }}></div>
                    <div className="gradient-orb orb-1" style={{ zIndex: 10 }}></div>
                    <div className="gradient-orb orb-2" style={{ zIndex: 10 }}></div>

                    {!isPlaying ? (
                        <div className="video-info" style={{ zIndex: 15 }}>
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
                    ) : (
                        <>
                            <video
                                src={videoSrc}
                                controls
                                autoPlay
                                onEnded={handleVideoEnd}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    inset: 0,
                                    zIndex: 20,
                                    borderRadius: 'inherit'
                                }}
                            />
                            <button
                                onClick={handleCloseVideo}
                                aria-label="Close video"
                                className="close-button"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
