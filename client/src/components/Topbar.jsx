import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currencies, getCurrency, setCurrency } from "../utils/currency";

function Topbar({ title, subtitle }) {
  const navigate = useNavigate();

  const [selectedCurrency, setSelectedCurrency] = useState(getCurrency());

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Hussein",
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency);

    window.dispatchEvent(new Event("currencyChanged"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Overview</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>

      <div className="topbar-actions">
        <div className="currency-select">
          <label>Currency</label>
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
        </div>

        <div className="topbar-user">
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{user.name}</strong>
            <p>Personal account</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;