import React from 'react'
import './Footer.css'
import footer_logo from '../Assests/logo_big.png'
import instagram_icon from '../Assests/instagram_icon.png'
import pintrest_icon from '../Assests/pintester_icon.png'
import whatsapp_icon from '../Assests/whatsapp_icon.png'


const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="Footer Logo" />
        <p>SHOPPER</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icon-container">
          <img src={instagram_icon} alt="Instagram" />
          </div>
            <div className="footer-icon-container">
          <img src={pintrest_icon} alt="Pinterest" />
            
          </div>
          <div className="footer-icon-container">
          <img src={whatsapp_icon} alt="WhatsApp" />
           </div>
      </div>
      <div className="footer-copyright">
        <hr/>
        <p>© 2023 Shopper. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
