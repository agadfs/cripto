import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Coin from './pages/coin';
import { Provider } from 'react-redux'
import store from './redux/store';
import { MetaMaskProvider } from "@metamask/sdk-react";
import Wallet from './components/Wallet';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "MetaMask Account",
          url: window.location.href,
        },
        
      }}
    >
      <BrowserRouter>
      <Wallet/>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/:id" element={<Coin />} />
        </Routes>
      </BrowserRouter>
    </MetaMaskProvider>
  </Provider>

);

