import React from 'react';
import { Header, Introduction, BuyToken, Dividend, SellToken, Footer } from './container';
import Navbar from './components/Navbar/Navbar';
import './App.scss';


function App() {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <Introduction />
      <BuyToken />
      <Dividend />
      <SellToken />
      <Footer />
    </div>
  );
}

export default App;
