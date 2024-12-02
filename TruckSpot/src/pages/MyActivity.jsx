import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import { Link } from "react-router-dom";
import axios from "axios";
import EventTable from "../components/EventTable/EventTable";

function MyActivity({ event }) {
  const storedUserType = sessionStorage.getItem("userType");

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 gap-40">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className=" rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">My Activity</h2>
                {storedUserType === "2" && (
                  <Link to="/addevent">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                      Add an event
                    </button>
                  </Link>
                )}
              </div>

              <EventTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyActivity;
