import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const ItemSoldDashboard = () => {
  const [pageSize, setPageSize] = useState(10);
  const [menuData, setMenuData] = useState([]);
  
  useEffect(() => {
    const fetchMenuData = async () => {
      const userId = sessionStorage.getItem("userID");
      try {
        const response = await axios.get(`http://localhost:5000/api/vendor/menu-items/${userId}`);
        setMenuData(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    fetchMenuData();
  }, []);

  const generateColors = (count) => {
    return Array(count).fill().map((_, i) => {
      const hue = (i * (360 / count)) % 360;
      const saturation = 35 + (i % 2) * 10;
      const lightness = 45 + (i % 3) * 5;  
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  };

  const sortedData = [...menuData].sort((a, b) => b.UnitsSold - a.UnitsSold);
  const topItems = sortedData.slice(0, pageSize);
  const colors = generateColors(topItems.length);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Items Sales Distribution</h2>
        <select 
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded p-1"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={15}>Top 15</option>
          <option value={20}>Top 20</option>
        </select>
      </div>
      {menuData.length > 0 ? (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topItems}
                dataKey="UnitsSold"
                nameKey="Item"
                cx="50%"
                cy="50%"
                outerRadius={150}
                labelLine={false}
                label={CustomLabel}
              >
                {topItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center">
          <p>Loading data...</p>
        </div>
      )}
    </div>
  );
};

export default ItemSoldDashboard;