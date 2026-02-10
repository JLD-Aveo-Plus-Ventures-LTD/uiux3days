import "./styles/Navbar.css";
import Logo from "../../assets/images/logo.png";

const Navbar = () => {
    return (
        <header className="header">
            <div className="header-container">
                <img src={Logo} alt="Logo" />
            </div>
        </header>
    );
};

export default Navbar;
