import { Link } from "react-router-dom";
import "./logo.css";
import logo from "../../assets/logo/logo.svg";

function Logo() {
  return (
    <Link to="/">
      <img className="logo" src={logo} alt="Shui logo" />
    </Link>
  );
}

export default Logo;
