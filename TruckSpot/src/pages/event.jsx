import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SeachBox from '../components/SearchBox/SeachBox'
import SmallCard from '../components/Cards/SmallCard'
import { services } from '../data/fakedata'

function event() {
  return (
    <>
        <Navbar/>
        <SeachBox/>

        <div className='grid lg:grid-cols-5 md:grid-cols-2 px-40 py-5 gap-8'>
          {services.map((item, index) => 
            /* Will change the services to event to get event detail and ID to show in cards for now I use fake API data to show */
            <SmallCard key={index} item={item}/>
          )}

        </div>
    </>
  )
}

export default event