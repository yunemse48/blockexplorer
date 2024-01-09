import { Alchemy, Network, Utils } from 'alchemy-sdk';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { BalanceLookup } from './BalanceLookup';

import './App.css';
import './Buttons.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [properties, setProperties] = useState({});
  const [minerAddress, setMinerAddress] = useState("");
  const [transactions, setTransactions] = useState([]);


  /*useEffect(() => {
    async function getBlockNumber() {
      const number = await alchemy.core.getBlockNumber();
      setBlockNumber(number);
      return number;
    }

    async function getBlock(number) {
      const blockData = await alchemy.core.getBlock(number);
      setBlock(blockData);
    }

    // Fetch and set the block number
    getBlockNumber().then(number => {
      if (number != null) {
        getBlock(number);
      }
    });
  }, []);*/
  useEffect(() => {
    async function fetchData() {
      const number = await alchemy.core.getBlockNumber();
      setBlockNumber(number);
      if (number != null) {
        const block = await alchemy.core.getBlock(number);
        setBlock(block);
        if (block && block.miner) {
          setMinerAddress(block.miner); // Set miner address
        }
      }
    }
  
    fetchData();

    if (block) {
      const temp = {};
      for (const property in block) {
        if (property !== "miner" && property !== "transactions") {
          temp[property] = block[property];
        }
      }
      setProperties(temp);
      setTransactions(block.transactions);
    }
  }, [block]);

  // Logging the block to see the fetched data
  console.log(block);

  const fetchMinerBalance = async (minerAddress) => {
    try {
      const balanceWei = await alchemy.core.getBalance(minerAddress);
      const balanceEther = Utils.formatEther(balanceWei);
      return balanceEther;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error; // Rethrow the error for handling in the calling context
    }
  };

  const fetchTransactionDetails = async (transaction) => {
    try {
      const txDetails = await alchemy.core.getTransactionReceipt(transaction);
      return txDetails;
    } catch (error) {
      console.error('Error fetching TX details:', error);
      throw error; // Rethrow the error for handling in the calling context
    }
  };

  const openTransactionDetailsInNewTab = async (transaction) => {
    try {
      const txDetails = await fetchTransactionDetails(transaction);
  
      // Open a new window and write the balance data to it
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<p>Details for transaction <b>${transaction}:</b> <br></br><pre>${JSON.stringify(txDetails, null, 4)}</pre></p>`);
      newWindow.document.title = "Transaction Details";
  
    } catch (error) {
      console.error('Failed to open new tab with balance:', error);
      // Optionally, handle the error (e.g., show a notification to the user)
    }
  };

  const openMinerBalanceInNewTab = async (minerAddress) => {
    try {
      const balanceEther = await fetchMinerBalance(minerAddress);
  
      // Open a new window and write the balance data to it
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<p>Balance for <b>${minerAddress}:</b> <br></br>${balanceEther} ETH</p>`);
      newWindow.document.title = "Miner Balance";
  
    } catch (error) {
      console.error('Failed to open new tab with balance:', error);
      // Optionally, handle the error (e.g., show a notification to the user)
    }
  };
  
    return (
      <Router>
      <div>
        <div className="nav-buttons">
          {/* Add navigation links */}
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/balance-lookup" className="nav-button">Check Balance</Link>
        </div>

        <Switch>
          {/* Route for the home page (existing content) */}
          <Route exact path="/">
            <div>
              <br/><br/>
              <div className="App">Latest Block Number: {blockNumber}</div>
              <br />
              <div className="App"><b>Latest Block Details</b></div>
              <div className="">
                <ul>
                  {properties && Object.keys(properties).map(key => (
                    <li key={key}>{key}: {JSON.stringify(block[key])}</li>
                  ))}
                </ul>
                <ul>
                  <li key="miner">
                    <button onClick={() => openMinerBalanceInNewTab(minerAddress)} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                      {minerAddress}
                    </button>
                  </li>
                  <li>transactions:
                    <ul>
                      {transactions && transactions.map(transaction => (
                        <li key={transaction}>
                          <button onClick={() => openTransactionDetailsInNewTab(transaction)} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                            {transaction}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </Route>

          {/* New Route for Balance Lookup */}
          <Route path="/balance-lookup">
            <BalanceLookup />
          </Route>
        </Switch>
      </div>
    </Router>
    );
}

export const App2 = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/balance-lookup">Check Balance</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/balance-lookup">
            <BalanceLookup />
          </Route>
          {/* Other routes */}
        </Switch>
      </div>
    </Router>
  );
};

//<div className=""><pre>{JSON.stringify(block, null, 4)}</pre></div>
//miner: <a href="#" onClick={() => openMinerBalance(properties.miner)}>{properties.miner}</a>


export default App;

/*
<div>
        <div className="App">Latest Block Number: {blockNumber}</div>
        <br></br>
        <div className="App"><b>Latest Block Details</b></div>
        <div className="">
          <ul>
            {properties && Object.keys(properties).map(key => (
              <li key={key}>{key}: {JSON.stringify(block[key])}</li>
            ))}
          </ul>
          <ul>
            <li key="miner">
              <button onClick={() => openMinerBalanceInNewTab(minerAddress)} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                {minerAddress}
              </button>
            </li>
  
            <li>transactions:
              <ul>
                {transactions && transactions.map(transaction => (
                <li key={transaction}>
                  <button onClick={() => openTransactionDetailsInNewTab(transaction)} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    {transaction}
                  </button>
                </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        
      </div>
*/
