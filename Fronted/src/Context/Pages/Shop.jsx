import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import Item from '../Components/Item/item'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Item />
      <Offers/>
      <NewCollections/>
      <NewsLetter />
    
    </div>
  )
}

export default Shop
