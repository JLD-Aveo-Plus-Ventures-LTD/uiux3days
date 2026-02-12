import {
    Link,
} from "react-router-dom";
import "./styles/Navbar.css";
import Logo from "../../assets/images/logo.png";

const Navbar = () => {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/">
                    <img src={Logo} alt="Logo" />
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
