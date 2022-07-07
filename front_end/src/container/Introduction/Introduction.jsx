import { motion } from 'framer-motion';
import React from 'react';
import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../Wrapper';
import './Introduction.scss';

const Introduction = () => {
  return (
    <div>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <h1 className='head-text'> <span>Introduction</span> </h1>
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
                <span><img src={images.John}/> <p className='bold-text'>John</p></span>
                <div style={{ marginLeft: 20 }}>
                  <p>"I wish I could own a piece of this condo.<br/> 
                  Too bad, I don't have hundreds of thousands of dollars..."</p>
                </div>
              </div>
            </div>
        </motion.div>
        <br />
        <motion.div
          whileInView={ {x: [-100, 0], opacity: [0, 1]} }
          transition={ {duration: 1} }
          className='app__header-info'
        >
            <div className='app__header-badge'>
              <div className='badge-cmp app__flex'>
                <span><img src={images.Dave}/><p className='bold-text'>Dave</p></span>
                <div style={{ marginLeft: 20 }}>
                  <p>"Hey John, this is Dave - the DeFi real estate operator. I just "tokenized" this property - Token Name: RPT.<br/>
                  <br/>
                  Total supply is 350 tokens at $5 each, that's our downpayment $1750 to buy the property!<br/> 
                  <br/>
                  Owing a token means ownership, depending on how many tokens you buy, you are proportionally entitled to the monthly rent cash flow estimated at $750 after all expenses!"
                  </p>
                </div>
              </div>
            </div>
        </motion.div>
      </div>

      <motion.img
          whileInView={ {scale: [0, 1]} }
          transition={ {duration: 1, ease: 'easeInOut'} }
          src={images.condo}
          alt='profile_condo'
        />
    </div>
    </div>
  )
}

export default AppWrap(
  MotionWrap(Introduction, 'introduction'),
  'introduction',
  'app__whitebg',
);