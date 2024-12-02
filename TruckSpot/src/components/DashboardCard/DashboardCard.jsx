import React from "react";

function DashboardCard({ title, data, isCurrency = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 font-bold">{title}</p>
      {typeof data === "object" ? (
        <div className="flex justify-between items-center mt-2">
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <h3 className="text-xl font-semibold">
            {isCurrency ? `$${data.revenue.toLocaleString()}` : data.revenue}
          </h3>
        </div>
      ) : (
        <h3 className="text-3xl font-semibold mt-2">{data}</h3>
      )}
    </div>
  );
}

export default DashboardCard;
