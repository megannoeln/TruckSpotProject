import React, { useState } from 'react';

const UpdateUnitsModal = ({ isOpen, onClose, onSubmit, itemName }) => {
  const [unitsSold, setUnitsSold] = useState('');

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Update Units Sold for {itemName}</h3>
        <input
          type="number"
          value={unitsSold}
          onChange={(e) => setUnitsSold(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter units sold"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button 
            onClick={() => onSubmit(itemName, parseInt(unitsSold))} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUnitsModal;