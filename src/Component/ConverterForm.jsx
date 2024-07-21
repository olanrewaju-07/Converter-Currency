import React, { useEffect, useState } from "react";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ConverterSelect from "./ConverterSelect";

const ConverterForm = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [result, setResult] = useState("")
  const [isLoadaing, setIsLoading] = useState(false)

  //swaping fromCurrency to Tocurrency
  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  //Function to get the exchange rate update the result..
  const getExchangeRate = async () => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency} `;

    setIsLoading(true)

    try {
      const response = await fetch(API_URL);
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text}`);
      }

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      const rate = (data.conversion_rate * amount).toFixed(2);

      // setting the rate amount to our result p tag
      setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`)
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error.message);
    } finally{
      setIsLoading(false)
    }
  };
  // Function for the button to click to get the exchange rate
  const handleFormSubmit = (e) => {
    e.preventDefault();
    getExchangeRate();
  };

  //Fetching exchange rate on the initail rendering
  useEffect(() => getExchangeRate, [])

  return (
    <div>
      <form className="converter-form" onClick={handleFormSubmit}>
        {/* Display the coversion result */}
        <p className="exchange-change-result">{isLoadaing ?"Getting exchange rate...": result}</p>
        <div className="form-group">
          <label className="form-label">Enter Amount</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-currency-group">
          <div className="form-section">
            <label className="form-label">From</label>
            <ConverterSelect
              selectedCurrency={fromCurrency}
              handleCurrency={(e) => setFromCurrency(e.target.value)}
            />
          </div>

          <div className="swap-icon" onClick={handleSwapCurrency}>
            <SwapHorizIcon className="swap-icon" />
          </div>

          <div className="form-section">
            <label className="form-label">To</label>
            <ConverterSelect
              selectedCurrency={toCurrency}
              handleCurrency={(e) => setToCurrency(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className={`${isLoadaing ?"loading":""} submit-button`}>
          Get Exchange Rate
        </button>
      </form>
    </div>
  );
};

export default ConverterForm;
