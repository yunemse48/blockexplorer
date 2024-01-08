import { Alchemy, Network } from 'alchemy-sdk';
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
 /*
function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    async function getBlock() {
      setBlock(await alchemy.core.getBlock(blockNumber));
    }

    getBlockNumber();
    getBlock();
  }, []);
  console.log(block);

  return (
  <div>
    <div className="App">Block Number: {blockNumber}</div>
  </div>
  );
}*/

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();

  useEffect(() => {
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
  }, []);

  // Logging the block to see the fetched data
  console.log(block);

  return (
    <div>
      <div className="App">Block Number: {blockNumber}</div>
      <br></br>
      <div className="App"><b>Block Details</b></div>
      <div className=""><pre>{JSON.stringify(block, null, 4)}</pre></div>
    </div>
  );
}



export default App;
