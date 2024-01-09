import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

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
      <div>
        <div className="App">Block Number: {blockNumber}</div>
        <br></br>
        <div className="App"><b>Block Details</b></div>
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
  
            <li>transactions:</li>
          </ul>
        </div>
        
      </div>
    );
}

//<div className=""><pre>{JSON.stringify(block, null, 4)}</pre></div>
//miner: <a href="#" onClick={() => openMinerBalance(properties.miner)}>{properties.miner}</a>


export default App;
