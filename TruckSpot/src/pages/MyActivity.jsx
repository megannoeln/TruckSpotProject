import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'
import axios from "axios";
import EventTable from "../components/EventTable/EventTable";

function MyActivity({ event }) {

    
  
    return (
    <>
        <Navbar/>
            <div className="container mx-auto px-4 py-8 gap-40">
                <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <SideBar/>
                    </div>
                    <div className="col-span-12 md:col-span-9">
            <div className=" rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">My Activity</h2>
            <EventTable/>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default MyActivity