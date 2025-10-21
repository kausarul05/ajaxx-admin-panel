'use client'

import React, { useState } from 'react';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rakib",
      comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
    },
    {
      id: 2,
      name: "Rakib",
      comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
    },
    {
      id: 3,
      name: "Rakib",
      comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
    },
    {
      id: 4,
      name: "Rakib",
      comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job!",
    },
  ]);

  const handleDelete = (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
      </div>

      {/* Reviews Grid - Simple layout like the image */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            {/* Review Header with Delete Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Simple name display like in the image */}
                <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete review"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Review Comment - Simple text like in the image */}
            <div className="text-gray-700">
              <p className="leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-500">There are no reviews to display at the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
}