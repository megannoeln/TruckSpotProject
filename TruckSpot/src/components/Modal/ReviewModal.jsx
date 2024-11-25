import React from 'react';


const ReviewModal = ({ show, onClose, onSubmit, review, setReview }) => {
    if (!show) return null;
   
    const StarRating = () => (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setReview(prev => ({...prev, rating: star}))}
            className={`text-2xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    );

    const handleChange = (field, value) => {
        console.log('Previous Review State:', review);
        setReview(prev => {
          const newState = {...prev, [field]: value};
          console.log('New Review State:', newState);
          return newState;
        });
      };
     
   
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Event Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Revenue ($)</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={review.revenue}
                onChange={(e) => handleChange('revenue', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <StarRating />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows="3"
                maxLength="500"
                value={review.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={onClose} className="btn btn-ghost">Cancel</button>
              <button onClick={onSubmit} className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
   };
   
   export default ReviewModal;