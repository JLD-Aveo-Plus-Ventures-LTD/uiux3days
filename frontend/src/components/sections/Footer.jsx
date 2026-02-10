import "./styles/Footer.css";
import Logo from "../../assets/images/logo.png";
import facebook from "../../assets/images/facebook.png";
import instagram from "../../assets/images/instagram.png";
import twitter from "../../assets/images/twitter.png";
import linkedin from "../../assets/images/linkedin.png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo and Brand */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src={Logo} alt="" />
                        <span className="brand-name"></span>
                    </div>
                    <div className="footer-divider"></div>
                </div>

                {/* Footer Links */}
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-heading">About JLD</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="https://jldaveoplus.com/">Company Overview</a>
                            </li>
                            <li>
                                <a href="#careers">Careers</a>
                            </li>
                            <li>
                                <a href="#press">Press & Media</a>
                            </li>
                            <li>
                                <a href="#testimonials">Testimonials</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">Resources</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="https://jldaveoplus.com/blog/">Blog</a>
                            </li>
                            <li>
                                <a href="#help">Help Center</a>
                            </li>
                            <li>
                                <a href="#webinars">Webinars & Events</a>
                            </li>
                            <li>
                                <a href="#courses">Course Materials</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">Support & Contact</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="https://jldaveoplus.com/contact/">Contact Us</a>
                            </li>
                            <li>
                                <a href="#support">Technical Support</a>
                            </li>
                            <li>
                                <a href="#feedback">Feedback</a>
                            </li>
                            <li>
                                <a href="#community">Community Forum</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-heading">Connect</h3>
                        <ul className="footer-links social-links">
                            <li>
                                <a href="https://www.instagram.com/jld_aveoplus/" className="social-link">
                                    <img src={instagram} alt="" />
                                    <span>Instagram</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/JLDAveoPlus/" className="social-link">
                                    <img src={facebook} alt="" />
                                    <span>Facebook</span>
                                </a>
                            </li>
                            {/* <li>
                                <a href="https://www.youtube.com/@jldinstitute" className="social-link">
                                    <img src={twitter} alt="" />
                                    <span>YouTube </span>
                                </a>
                            </li> */}
                            <li>
                                <a href="https://www.linkedin.com/company/jldaveoplus" className="social-link">
                                    <img src={linkedin} alt="" />
                                    <span>LinkedIn</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p className="copyright">
                        ©2026 JLD - All rights reserved.
                    </p>
                    <div className="footer-legal">
                        <a href="#terms">Term of use</a>
                        <a href="#privacy">Privacy policy</a>
                        <a href="#security">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
