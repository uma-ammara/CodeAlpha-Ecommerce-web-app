import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assests/breadcrum_arrow.png'

const Breadcrums = (props) => {
    const {Product} = props;
  return (
    <div className='breadcrums'>
      HOME <img src={arrow_icon} alt="arrow" /> SHOP <img src={arrow_icon} alt="arrow" /> {Product.category} <img src={arrow_icon} alt="arrow" /> {Product.name}
    </div>
  )
}

export default Breadcrums
