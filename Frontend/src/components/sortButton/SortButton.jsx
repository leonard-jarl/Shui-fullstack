import "./sortbutton.css";

const SortButton = ({ sortOrder, onToggleSort }) => {
  let label;
  if (sortOrder === "descending") {
    label = "Newest";
  } else {
    label = "Oldest";
  }
  return (
    <button className="sort-button" onClick={onToggleSort}>
      Sort by date: {label}
    </button>
  );
};

export default SortButton;
