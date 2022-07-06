import {useState, React} from 'react';
import { AppWrap, MotionWrap } from '../../Wrapper';
import {motion} from 'framer-motion';
import { images } from '../../constants';
import {BigNumber, ethers} from "ethers";
import Auction_abi from "../../Auction_abi.json";
import './SellToken.scss';

const SellToken = () => {

  const contractAddress = '0x6561cCE1a045858Af95087A05F7EcF66EcF6f021';

  //UI part
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

   //For the form
   const [inputs, setInputs] = useState({});
   const [ethAmount, setEthAmount] = useState(null);
   const [ethAuctionAmount, setEthAuctionAmount] = useState(null);


  //etherJS part
  const [usdToEther, setUsdToEther] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  //Connect Wallet

  const connectWalletHandler = () => {
    if(window.ethereum) {
        window.ethereum.request({method: "eth_requestAccounts"})
        .then(result => {
            accountChangedHandler(result[0]);
            setConnButtonText("Wallet Connected");
        })
    } else {
        setErrorMessage("Need to Install MetaMask");
    }
  }

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  }

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, Auction_abi, tempSigner);
    setContract(tempContract);
  }

  // Hanlding the forms
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    getUsdToEther();
    ethAuctionCalculation();
  }

  //USD to ETH exchange rate, provided by Chainlink Live Data Feed
  const getUsdToEther = async () => {
    let usdToWeiRate = await contract.usdToWeiRate();
    const usdToEther = ethers.utils.formatEther(usdToWeiRate);
    setUsdToEther(usdToEther);
  }


    //Auction functions

    const ethAuctionCalculation = async () => {
    let exchangeRate4 = await contract.usdToWeiRate();
    let ethAuctionAmountInWei = BigNumber.from(((inputs.numberOfTokenSales*inputs.floorPriceUSD*100)*exchangeRate4).toString());
    const ethAuctionAmount = ethers.utils.formatUnits(ethAuctionAmountInWei, 18);
    setEthAuctionAmount(ethAuctionAmount);
    } 

    const startAuction = async () => {
    let _floorPriceUSD = (inputs.floorPriceUSD*100*inputs.numberOfTokenSales);
    let _bidIncrementUSD = (inputs.bidIncrementUSD*100);
    await contract.setFloorPriceAndQuantitySales(_floorPriceUSD, inputs.numberOfTokenSales, _bidIncrementUSD, 10790017, 10790027);
    }

  return (
    <div>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <h1 className='head-text'> <span>Sell RPT Tokens</span> </h1>
      </motion.div>

      <div className='app__header app__flex'>
        <div>
          <motion.div
            whileInView={ {x: [-100, 0], opacity: [0, 1]} }
            transition={ {duration: 1} }
            className='app__header-info'
          >
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.John}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to sell 50 tokens."</p>
                  </div>
                </div>
              </div>
              <br/>
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.Dave}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"Sure, you can just fill out the form and run the auction."</p>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>

        <div>
          <motion.div
              whileInView={ {scale: [0, 1]} }
              transition={ {duration: 1, ease: 'easeInOut'} }
              className='app__execution-tasks'
          >
            <h1>Step 1 Connect Your Wallet</h1>
            <button className='button' onClick={connectWalletHandler}>{connButtonText}</button>
            <h4>Address: {defaultAccount}</h4>
            <br/>
            <h1>Step 2: Run Auction</h1>
            <form onSubmit={handleSubmit}>
              <fieldset>
              <label>Minimum Price-USD </label>
              <br/>
              <input type="number" name="floorPriceUSD" value={inputs.floorPriceUSD} onChange ={handleChange}/>
              <br/>
              <label>Number of Tokens</label>
              <br/>
              <input type="number" name="numberOfTokenSales" value={inputs.numberOfTokenSales} onChange ={handleChange}/>
              <br/>
              <label>Incremental Bid - USD</label>
              <br/>
              <input type="number" name="bidIncrementUSD" value={inputs.bidIncrementUSD} onChange ={handleChange}/>
              <input className= 'button' type="submit"/>
              </fieldset>
            </form>
            <p>{`1 USD = ${usdToEther} Ether`}</p>
            <h3>{`You are asking ${ethAuctionAmount} ETH for ${inputs.numberOfTokenSales}`}</h3>
            <button className="button" onClick={startAuction}>Start Auction</button>
          </motion.div>
        </div>
        
      </div>

      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <h1 className='head-text'> <span>Submit Bids</span> </h1>
      </motion.div>

      <div className='app__header app__flex'>
        <div>
          <motion.div
            whileInView={ {x: [-100, 0], opacity: [0, 1]} }
            transition={ {duration: 1} }
            className='app__header-info'
          >
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.Dave}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to bid $10 per token."</p>
                  </div>
                </div>
              </div>
              <br/>
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.Lisa}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to bid $12 per token"</p>
                  </div>
                </div>
              </div>
              <br/>
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.Jenny}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to bid $15 per token"</p>
                  </div>
                </div>
              </div>
          </motion.div>
        </div>

        <div>
          <motion.div
              whileInView={ {scale: [0, 1]} }
              transition={ {duration: 1, ease: 'easeInOut'} }
              className='app__execution-tasks'
          >
            <h1>Step 1 Connect Your Wallet</h1>
            <button className='button' onClick={connectWalletHandler}>{connButtonText}</button>
            <h4>Address: {defaultAccount}</h4>
            <br/>
            <h1>Step 2: Run Auction</h1>
            <form onSubmit={handleSubmit}>
              <fieldset>
              <label>Minimum Price-USD </label>
              <br/>
              <input type="number" name="floorPriceUSD" value={inputs.floorPriceUSD} onChange ={handleChange}/>
              <br/>
              <label>Number of Tokens</label>
              <br/>
              <input type="number" name="numberOfTokenSales" value={inputs.numberOfTokenSales} onChange ={handleChange}/>
              <br/>
              <label>Incremental Bid - USD</label>
              <br/>
              <input type="number" name="bidIncrementUSD" value={inputs.bidIncrementUSD} onChange ={handleChange}/>
              <input className= 'button' type="submit"/>
              </fieldset>
            </form>
            <p>{`1 USD = ${usdToEther} Ether`}</p>
            <h3>{`You are asking ${ethAuctionAmount} ETH for ${inputs.numberOfTokenSales}`}</h3>
            <button className="button" onClick={startAuction}>Start Auction</button>
          </motion.div>
        </div>
        
      </div>

    </div>
  )
}

export default AppWrap(
  MotionWrap(SellToken, 'sell token'),
  'sell token',
  'app__primarybg',
);