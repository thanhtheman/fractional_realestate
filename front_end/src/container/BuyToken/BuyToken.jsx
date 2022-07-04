import React from 'react';
import { AppWrap, MotionWrap } from '../../Wrapper';
import {motion} from 'framer-motion';

const Buytoken = () => {
  return (
    <div>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        
      >
        <h1 className='head-text'> Step 1 - Connect Your <span>Wallet</span></h1>
      </motion.div>

    <div className='app__execution-tasks'>


      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
      >
        <button className='button'>Connect Wallet</button>
      </motion.div>
      



    </div>

    </div>
  )
}

export default AppWrap(
  MotionWrap(Buytoken, 'buy token'),
  'buy token',
  'app__primarybg',
);