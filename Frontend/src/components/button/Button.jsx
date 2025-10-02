import "./button.css";
import button from "../../assets/graphic/button.svg";

function Button({ onClick }) {
  return (
    <button
      className="button"
      onClick={onClick}
      aria-label="Create a new message"
    >
      <img src={button} alt="Create a new message" />
    </button>
  );
}

export default Button;
