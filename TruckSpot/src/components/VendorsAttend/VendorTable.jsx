import React from "react";
import { useState } from "react";
import VendorProfileModal from "../Modal/VendorProfileModal";
const VendorTable = ({ vendors }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const handleVendorClick = (vendor) => {
    console.log("Selected vendor data:", vendor); // Debug log
    setSelectedVendor(vendor);
  };

  return (
    <>
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Vendor Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Food Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
              <tr
                key={index}
                onClick={() => handleVendorClick(vendor)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm">{vendor.VendorName}</td>
                <td className="px-6 py-4 text-sm">{vendor.FoodType}</td>
                <td className="px-6 py-4 text-sm">{vendor.VendorPhone}</td>
                <td className="px-6 py-4 text-sm">{vendor.VendorEmail}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-sm text-center text-gray-500"
              >
                No vendors registered yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <VendorProfileModal
        vendor={selectedVendor}
        show={selectedVendor !== null}
        onClose={() => setSelectedVendor(null)}
      />
    </>
  );
};

export default VendorTable;
