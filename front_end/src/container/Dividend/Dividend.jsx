import {useState, React} from 'react';
import { AppWrap, MotionWrap } from '../../Wrapper';
import {motion} from 'framer-motion';
import { images } from '../../constants';
import {BigNumber, ethers} from "ethers";
import Auction_abi from "../../Auction_abi.json";
import './Dividend.scss';

const Dividend = () => {

  const contractAddress = '0x917Fc2fE978474CbC3F0e6A7B31D238c5DCD2Ed0';

  //UI part
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  //etherJS part
  const [rentInWei, setRentInWei] = useState(null);

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

//Jenny deposited her monthly rent of $750, which will be converted to wei first, then send to the contract
  const dividendDeposit = async () => {
    let exchangeRate2 = await contract.usdToWeiRate();
    let dividendInWei = BigNumber.from((75000*exchangeRate2).toString());
    console.log(dividendInWei);
    setRentInWei(dividendInWei);
    await contract.dividendDeposit({value: dividendInWei});
  }

  // Withdraw Dividend
  const withdrawDividend = async () => {
    await contract.withdrawDividend();
}


  return (
    <div>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <h1 className='head-text'> <span>Get Monthly Dividend</span> </h1>
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
                  <span><img src={images.Jenny}/><p className='bold-text'>Jenny</p></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"Hey, I just paid my rent $750, by ETH."</p>
                  </div>
                </div>
              </div>
          </motion.div>
          <br/>
          <motion.div
            whileInView={ {x: [-100, 0], opacity: [0, 1]} }
            transition={ {duration: 1} }
            className='app__header-info'
          >
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.John}/><p className='bold-text'>John</p></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to collect my monthly dividend."</p>
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
            <h1>Step 2a - Pay Rent</h1>
            <button className="button" onClick={dividendDeposit}>Pay Rent</button>
            <h1>Step 2b - Get Dividend</h1>
            <button className="button"onClick={withdrawDividend}>Get Dividend</button>
          </motion.div>
        </div>
        
      </div>
    </div>
  )
}

export default AppWrap(
  MotionWrap(Dividend, 'dividend'),
  'dividend',
  'app__whitebg',
);