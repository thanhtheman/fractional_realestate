import { motion } from 'framer-motion';
import React from 'react';
import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../Wrapper';
import './Introduction.scss';

const Introduction = () => {
  return (
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
                <p>Real estate investment powered by Blockchain <br/> 
                fsdfsdfsdfsdfsdfsdfsdffdsfsdfsdfsdfsdfsdfsdfsdfsd.</p>
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
              <span><img src={images.Dave}/></span>
              <div style={{ marginLeft: 20 }}>
                <p>Real estate investment powered by Blockchain <br/> 
                fsdfsdfsdfsdfsdfsdfsdffdsfsdfsdfsdfsdfsdfsdfsdfsd.</p>
              </div>
            </div>
          </div>
      </motion.div>
      </div>

      <motion.img
          whileInView={ {scale: [0, 1]} }
          transition={ {duration: 1, ease: 'easeInOut'} }
          className='overlay_house'
          src={images.house}
          alt='profile_house'
        />
    </div>
  )
}

export default AppWrap(
  MotionWrap(Introduction),
  'introduction',
  'app__whitebg',
);