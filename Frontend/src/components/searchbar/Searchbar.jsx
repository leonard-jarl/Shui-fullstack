import "./searchbar.css";

function SearchBar({ value, onChange }) {
  return (
    <nav className="searchbar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by username..."
      />
    </nav>
  );
}

export default SearchBar;
