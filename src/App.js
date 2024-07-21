import React from 'react'
import "./App.css"
import "./index.css"
import ConverterForm from './Component/ConverterForm';

const App = () => {
  return (
    <div className="currency-converter">
      <h2 className="converter-title">Currency Converter</h2>
      <ConverterForm />
    </div>
  );
}

export default App