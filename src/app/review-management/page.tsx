'use client'

import { Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import userImage from "@/../public/images/profile.jpg"

export default function ReviewManagement() {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Rakib",
            comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job! I've been using this data broker website for a while",
            rating: 5
        },
        {
            id: 2,
            name: "Rakib",
            comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job! I've been using this data broker website for a while",
            rating: 5
        },
        {
            id: 3,
            name: "Rakib",
            comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job! I've been using this data broker website for a while",
            rating: 5
        },
        {
            id: 4,
            name: "Rakib",
            comment: "I've been using this data broker website for a while, and I couldn't be happier! It makes saving and organizing data so much easier. The process is seamless, and everything works perfectly. Great job! I've been using this data broker website for a while",
            rating: 5
        },
    ]);

    const handleDelete = (reviewId: number) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setReviews(reviews.filter(review => review.id !== reviewId));
        }
    };

    return (
        <div className="min-h-screen bg-[#0A2131] p-6">
            <div className='bg-[#0D314B] p-6 rounded-lg'>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Review Management</h1>
                </div>

                {/* Reviews Grid - Simple layout like the image */}
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="rounded-lg border border-[#007ED6] p-6"
                        >
                            {/* Review Header with Delete Button */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src={userImage}
                                        alt='user photo'
                                        width={80}
                                        height={40}
                                        className='w-10 h-10 object-fill rounded-full'
                                    />
                                    <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                                </div>
                            </div>

                            {/* Review Comment - Simple text like in the image */}
                            <div className="text-white">
                                <p className="leading-relaxed text-sm font-semibold">{review.comment}</p>
                            </div>

                            <div className='flex items-center justify-between gap-1 mt-5'>
                                <div className='flex gap-1'>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Image
                                            key={i}
                                            src='https://upload.wikimedia.org/wikipedia/commons/4/44/Plain_Yellow_Star.png'
                                            alt='star'
                                            width={80}
                                            height={40}
                                            className='w-4 h-4'
                                        />
                                    ))}
                                </div>

                                <button onClick={() => handleDelete(review.id)} className="p-2 rounded-full border cursor-pointer border-[#EB4335] hover:bg-[#12446a]">
                                    <Trash size={16} className="text-[#EB4335]" />
                                </button>
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
        </div>
    );
}