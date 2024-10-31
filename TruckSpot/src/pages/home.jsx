import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SeachBox from '../components/SearchBox/SeachBox'

import BigCard from '../components/Cards/BigCard'
import MediumCard from '../components/Cards/MediumCard'

function home() {
  return (
    <>
      <Navbar/>
      <SeachBox/>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 px-40 py-5 gap-8">
          {/* Big card takes 2 columns */}
          <div className="col-span-2">
            <BigCard title="1st Upcoming Event"/>
          </div>
          {/* Each medium card takes 1 column */}
          <div>
            <MediumCard title="2nd Upcoming Event"/>
          </div>
          <div>
            <MediumCard title="3rd Upcoming Event"/>
          </div>
      </div>  
    </>
    
  )
}

export default home
