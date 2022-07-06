import {useState, React} from 'react';
import { AppWrap, MotionWrap } from '../../Wrapper';
import {motion} from 'framer-motion';
import { images } from '../../constants';
import {BigNumber, ethers} from "ethers";
import Auction_abi from "../../Auction_abi.json";
import './SellToken.scss';

const SellToken = () => {

  const contractAddress = '0x917Fc2fE978474CbC3F0e6A7B31D238c5DCD2Ed0';


  //UI part
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

   //For the form
   const [inputs, setInputs] = useState({});
   
  //etherJS part
  const [usdToEther, setUsdToEther] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [ethFloorPrice, setEthFloorPrice] = useState(null);
  const [ethAmount, setEthAmount] = useState(null);
  const [ethAuctionAmount, setEthAuctionAmount] = useState(null);
  const [bidIncrement, setBidIncrement] = useState(null);
  const [highestBindingBid, setHighestBindingBid] = useState(null);
  const [ethBidAmount, setBidAmount] = useState(null);


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
    convertBidAmount();
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
      await contract.setFloorPriceAndQuantitySales(_floorPriceUSD, inputs.numberOfTokenSales, _bidIncrementUSD, 10978483, 10978495);
    }

    const checkEndBlock = async () => {
      let _checkEndBlock = await contract.endBlock();
      console.log(BigNumber.from(_checkEndBlock).toString());
    }

    // Get basic information of the auction
    const convertFloorPriceToWei = async () => {
      let price1 = await contract.floorPriceInWei();
      let price2 = BigNumber.from((price1).toString());
      const ethFloorPrice = ethers.utils.formatUnits(price2, 18);
      setEthFloorPrice(ethFloorPrice);
      bidIncrement =  await contract.bidIncrement();
      setBidIncrement(bidIncrement);
      console.log(bidIncrement.toString());
      highestBindingBid = await contract.highestBindingBid();;
      setHighestBindingBid(highestBindingBid);
      console.log(highestBindingBid.toString());
    }
  
    const convertBidAmount = async () => {
      let exchangeRate6 = await contract.usdToWeiRate();
      let quantityTokenSales2 = await contract.quantityRPTSales();
      let ethBidAmountInWei = BigNumber.from((inputs.bidPriceUSD*100*quantityTokenSales2*exchangeRate6).toString());
      ethBidAmount = ethers.utils.formatUnits(ethBidAmountInWei, 18);
      setBidAmount(ethBidAmount);
    }

    const submitBid = async () => {
      let exchangeRate7 = await contract.usdToWeiRate();
      let quantityTokenSales2 = await contract.quantityRPTSales()
      let rawNumber = inputs.bidPriceUSD*100*quantityTokenSales2*exchangeRate7;
      console.log(rawNumber);
      await contract.submitBids({ value: rawNumber.toString() });
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
            <h1>Step 1: Connect Wallet</h1>
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
            <button className="button" onClick={checkEndBlock}>end block</button>
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
                    <p>"I want to bid $12 per token."</p>
                  </div>
                </div>
              </div>
              <br/>
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.Lisa}/></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to bid $20 per token"</p>
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
            <h1>Step 1: Connect Wallet</h1>
            <button className='button' onClick={connectWalletHandler}>{connButtonText}</button>
            <h4>Address: {defaultAccount}</h4>
            <br/>
            <h1>Step 2: Auction Details </h1>
            <button className='button' onClick={convertFloorPriceToWei}>Get Details</button>
            <h3>{`The floor price is $${inputs.floorPriceUSD} USD per token`}</h3>
            <h3>{`The number of tokens is ${inputs.numberOfTokenSales}`}</h3>
            <h3>{`The USD bid increment is $${inputs.bidIncrementUSD}`}</h3>
            <h3>{`In total ETH: ${ethFloorPrice} for ${inputs.numberOfTokenSales} tokens`}</h3>
            <h3>{`The bid increment is ${bidIncrement} ETH`}</h3>
            <h3>{`The highest binding bid is ${highestBindingBid} ETH`}</h3>
            <br/>
            <h1>Step 3: Submit Bid</h1>
            <form onSubmit={handleSubmit}>
              <fieldset>
              <label>Your Best Bid per Token (USD)</label>
              <br/>
              <input type="number" name="bidPriceUSD" value={inputs.bidPriceUSD} onChange ={handleChange}/>
              
              <input className= 'button' type="submit"/>
              </fieldset>
            </form>
            <p>{`1 USD = ${usdToEther} Ether`}</p>
            <h3>{`Your Bid in ETH is ${ethBidAmount}`}</h3>
            <button className="button" onClick={submitBid}>Place Bid</button>
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