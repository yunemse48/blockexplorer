// BalanceLookup.js
import React, { useState } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY, // Your Alchemy API Key
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

export const BalanceLookup = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const fetchBalance = async () => {
    try {
        const balanceWei = await alchemy.core.getBalance(address);
        const balanceEther = Utils.formatEther(balanceWei);
      setBalance(balanceEther);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error fetching balance');
    }
  };

  return (
    <div className="App">
      <h2>Check Address Balance</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Address"
      />
      <button onClick={fetchBalance}>Check Balance</button>
      {balance && <p>Balance: {balance} ETH</p>}
    </div>
  );
};