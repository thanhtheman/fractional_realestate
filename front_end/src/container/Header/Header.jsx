import React from 'react';
import { motion } from 'framer-motion';
import { images } from '../../constants';
import { AppWrap } from '../../Wrapper';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import './Header.scss';

const Header = () => {
  return (
    <div id='home' className='app__header app__flex'>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <div className='app_header-badge'>
          <div className='badge-cmp app__flex'>
            <span><img src="https://img.icons8.com/fluency/48/000000/tornado.png"/></span>
            <div style={{ marginLeft: 20 }}>
              <h4 className='head-text'> Real Property <span>Token</span></h4>
              <p className='p-text'>Real estate investment powered by Blockchain.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileInView={ {opacity: [0, 1]} }
        transition={ {duration: 0.5, delayChildren: 0.5} }
        className='app__header-img'
      >
        <img src={images.profile} alt="profile" />
        <motion.img
          whileInView={ {scale: [0, 1]} }
          transition={ {duration: 1, ease: 'easeInOut'} }
          className='overlay_circle'
          src={images.circle}
          alt='profile_circle'
        />
      </motion.div>
    </div>
  )
}

export default Header;