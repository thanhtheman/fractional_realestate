import React from 'react';
import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../Wrapper';
import './Footer.scss';
const Footer = () => {
  return (
    <>
      <h2 className='head-text'>Have a coffee & chat with me</h2>
      <div className='app__footer-cards'>
        <div className='app__footer-card'>
          <img src={images.mobile} alt="phone" />
          <a href="647 233 4472" className='p-text'> 647 233 4472</a>
        </div>

        <div className='app__footer-card'>
          <img src={images.email} alt="email" />
          <a href="email" className='p-text'> thanhb.quach@gmail.com</a>
        </div>

        <div className='app__footer-card'>
          <img src={images.linkedin} alt="linkedin" />
          <a href="https://www.linkedin.com/in/thanh-quach1/" className='p-text'> Thanh Quach</a>
        </div>

        <div className='app__footer-card'>
          <img src={images.github} alt="github" />
          <a href="https://github.com/thanhtheman/fractional_realestate" className='p-text'> My github repo</a>
        </div>

        <div className="copyright">
          <p className="p-text">@2022 Thanh Quach</p>
          <p className="p-text">All rights reserved</p>
        </div>
      </div>
    </>
  );
}

export default AppWrap(
  MotionWrap(Footer, 'footer'),
  'footer',
  'app__whitebg',
);