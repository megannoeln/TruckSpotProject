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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-rows-2 gap-6">
          {/* Big card takes 2 columns */}
          <div className="lg:col-span-2">
            <BigCard title="1st Upcoming Event"/>
          </div>
          {/* Each medium card takes 1 column */}
          <div className="lg:col-span-1">
            <MediumCard title="2nd Upcoming Event"/>
          </div>
          <div className="lg:cold-span-1">
            <MediumCard title="3rd Upcoming Event"/>
          </div>
        </div>
      </div>  
    </>
    
  )
}

export default home
