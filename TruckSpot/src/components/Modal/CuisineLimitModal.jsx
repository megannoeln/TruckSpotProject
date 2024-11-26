// components/CuisineLimits/CuisineLimitModal.jsx
import React from "react";

const CuisineLimitModal = ({
  show,
  onClose,
  newCuisineLimit,
  setNewCuisineLimit,
  handleAddCuisineLimit,
  cuisineTypes,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add Cuisine Limit</h3>
        <form onSubmit={handleAddCuisineLimit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Type
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={newCuisineLimit.cuisineTypeId}
                onChange={(e) =>
                  setNewCuisineLimit({
                    ...newCuisineLimit,
                    cuisineTypeId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select cuisine type</option>
                {Array.isArray(cuisineTypes) &&
                  cuisineTypes.map((cuisine) => {
                    return (
                      <option
                        key={cuisine.intCuisineTypeID}
                        value={cuisine.intCuisineTypeID}
                      >
                        {cuisine.strCuisineType}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Limit
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded-md"
                value={newCuisineLimit.limit}
                onChange={(e) =>
                  setNewCuisineLimit({
                    ...newCuisineLimit,
                    limit: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CuisineLimitModal;
