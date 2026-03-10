import { useRef, useState, useEffect } from "react";
import "./styles/HeroSection.css";
import videoSrc from "../../assets/videos/landing_video.mp4";
import videoPoster from "../../assets/images/video-bg.png";

const HeroSection = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.muted = true;
        video.defaultMuted = true;

        const startVideo = async () => {
            try {
                await video.play();
            } catch {
                setIsPlaying(false);
            }
        };

        startVideo();
    }, []);

    const handleVideoClick = async () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        if (video.paused) {
            setIsPlaying(true);

            try {
                await video.play();
            } catch {
                setIsPlaying(false);
            }
        } else {
            video.pause();
            setIsPlaying(false);
        }

        setShowIcon(true);
        setTimeout(() => setShowIcon(false), 800);
    };

    const handlePlayVideo = () => {
        setIsPlaying(true);
    };

    const handlePauseVideo = () => {
        setIsPlaying(false);
    };

    return (
        <section className="hero-container" id="hero">
            <div className="main-content">
                <h1 className="hero-title">The 3-Day Tech Accelerator Masterclass</h1>
                <p className="description">
                    Three High-Income Skills. Three Power-Packed Masterclasses. Three Days Each.
                </p>
                <div className="event-date">
                    <span className="date-label">Event Date: LIVE;</span>
                    <span className="date-value">March 23rd - 25th, 2026</span>
                </div>
                {/* <a href="#booking-form" className="hero-cta">
                    APPLY NOW & SECURE YOUR SEAT
                </a> */}
            </div>

            <div className="video-section">
                <div className="video-background">
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        className="video-preview"
                        poster={videoPoster}
                        preload="auto"
                        autoPlay
                        muted
                        loop
                        controls
                        playsInline
                        onPlay={handlePlayVideo}
                        onPause={handlePauseVideo}
                        aria-hidden="true"
                    />
                    <div className="video-click-overlay" onClick={handleVideoClick} aria-hidden="true"></div>
                    <div className="grid-overlay" aria-hidden="true"></div>
                    <div className="gradient-orb orb-1" aria-hidden="true"></div>
                    <div className="gradient-orb orb-2" aria-hidden="true"></div>

                    {showIcon && (
                        <div className="play-pause-overlay" aria-hidden="true">
                            <span className="icon-display">
                                {isPlaying ? "⏸" : "▶"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
