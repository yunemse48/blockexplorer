import { Alchemy, Network } from 'alchemy-sdk';
import express from 'express';
import cors from 'cors';



const app = express();
const port = 3001; // Use a different port than your React app
app.use(cors());

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

const alchemy = new Alchemy(settings);

// Add your /miner-balance route here
app.get('/miner-balance', async (req, res) => {
    const minerAddress = req.query.address;
    // Use Alchemy SDK to get the balance
    const balance = await alchemy.core.getBalance(minerAddress);
  
    // Send an HTML response or perhaps a JSON response if you prefer
    res.send(`<html><body><h1>Balance of ${minerAddress}</h1><p>${balance}</p></body></html>`);
  });
  

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
