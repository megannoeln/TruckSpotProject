// components/Feedback/FeedbackSection.jsx
import React from 'react';

const FeedbackSection = ({ feedbacks }) => (
  <div className="max-w-6xl mx-auto mt-16">
    <h2 className="text-2xl font-semibold mb-6">Vendor Feedback</h2>
    <div className="grid gap-6">
      {feedbacks.map((feedback, index) => (
        <div key={index} className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{feedback.VendorName}</h3>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < feedback.Rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-2">{feedback.Comment}</p>
          <div className="flex justify-end mt-4">
            <p className="text-sm font-medium text-green-600">
              Revenue: ${feedback.TotalRevenue}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FeedbackSection;