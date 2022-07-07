import React from 'react';
import { BsLinkedin, BsGithub } from 'react-icons/bs';

const SocialMedia = () => {
  return (
    <div className='app__social'>
        <div>
            <a href="https://www.linkedin.com/in/thanh-quach1/"><BsLinkedin /></a>
        </div>
        <div>
            <a href="https://github.com/thanhtheman/fractional_realestate"><BsGithub /></a>
        </div>
    </div>
  )
}

export default SocialMedia