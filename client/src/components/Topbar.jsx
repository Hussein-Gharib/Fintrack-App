import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { currencies, getCurrency, setCurrency } from "../utils/currency";

function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(getCurrency());
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Hussein" };

  const handleCurrencyChange = (e) => {
    const nextCurrency = e.target.value;
    setSelectedCurrency(nextCurrency);
    setCurrency(nextCurrency);
    window.dispatchEvent(new Event("currencyChanged"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <header className="mobile-brandbar">
        <div className="mobile-brand">
          <div className="brand-orb small">FT</div>
          <strong>FinTrack</strong>
        </div>
        <button className="icon-button" type="button" aria-label="Notifications">◔</button>
      </header>

      <header className="topbar">
        <div className="topbar-copy">
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

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
    </>
  );
}

export default Topbar;
