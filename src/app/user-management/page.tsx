'use client'

import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubscription, setFilterSubscription] = useState('all');
    const itemsPerPage = 10;

    const users = [
        {
            id: 1,
            name: 'Savannah Nguyen',
            email: 'demo59@gmail.com',
            registrationDate: 'January 20, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 2,
            name: 'Annette Black',
            email: 'demo59@gmail.com',
            registrationDate: 'February 15, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 3,
            name: 'Cody Fisher',
            email: 'demo59@gmail.com',
            registrationDate: 'March 10, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 4,
            name: 'Brooklyn Simmons',
            email: 'demo59@gmail.com',
            registrationDate: 'April 09, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 5,
            name: 'Ralph Edwards',
            email: 'demo59@gmail.com',
            registrationDate: 'May 12, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 6,
            name: 'Courtney Henry',
            email: 'demo59@gmail.com',
            registrationDate: 'June 12, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 7,
            name: 'Bessie Cooper',
            email: 'demo59@gmail.com',
            registrationDate: 'April 12, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 8,
            name: 'Esther Howard',
            email: 'demo59@gmail.com',
            registrationDate: 'April 12, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 9,
            name: 'Eleanor Pena',
            email: 'demo59@gmail.com',
            registrationDate: 'April 12, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 10,
            name: 'Cameron Williamson',
            email: 'demo59@gmail.com',
            registrationDate: 'April 12, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 11,
            name: 'Guy Hawkins',
            email: 'demo59@gmail.com',
            registrationDate: 'April 12, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 12,
            name: 'Jenny Wilson',
            email: 'demo59@gmail.com',
            registrationDate: 'June 22, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 13,
            name: 'Jacob Jones',
            email: 'demo59@gmail.com',
            registrationDate: 'July 04, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 14,
            name: 'Devon Lane',
            email: 'demo59@gmail.com',
            registrationDate: 'July 20, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 15,
            name: 'Kristin Watson',
            email: 'demo59@gmail.com',
            registrationDate: 'August 01, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 16,
            name: 'Floyd Miles',
            email: 'demo59@gmail.com',
            registrationDate: 'August 11, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 17,
            name: 'Wade Warren',
            email: 'demo59@gmail.com',
            registrationDate: 'August 22, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 18,
            name: 'Arlene McCoy',
            email: 'demo59@gmail.com',
            registrationDate: 'September 03, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 19,
            name: 'Darlene Robertson',
            email: 'demo59@gmail.com',
            registrationDate: 'September 10, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 20,
            name: 'Theresa Webb',
            email: 'demo59@gmail.com',
            registrationDate: 'September 22, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 21,
            name: 'Leslie Alexander',
            email: 'demo59@gmail.com',
            registrationDate: 'October 01, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 22,
            name: 'Marvin McKinney',
            email: 'demo59@gmail.com',
            registrationDate: 'October 10, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 23,
            name: 'Jerome Bell',
            email: 'demo59@gmail.com',
            registrationDate: 'October 18, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 24,
            name: 'Albert Flores',
            email: 'demo59@gmail.com',
            registrationDate: 'October 25, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 25,
            name: 'Eleanor Rigby',
            email: 'demo59@gmail.com',
            registrationDate: 'November 03, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 26,
            name: 'Phillip Nguyen',
            email: 'demo59@gmail.com',
            registrationDate: 'November 10, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 27,
            name: 'Angela Gray',
            email: 'demo59@gmail.com',
            registrationDate: 'November 20, 2025',
            subscription: 'Gold Protection',
        },
        {
            id: 28,
            name: 'Martha Craig',
            email: 'demo59@gmail.com',
            registrationDate: 'December 02, 2025',
            subscription: 'Silver Protection',
        },
        {
            id: 29,
            name: 'Harold King',
            email: 'demo59@gmail.com',
            registrationDate: 'December 10, 2025',
            subscription: 'Basic Protection',
        },
        {
            id: 30,
            name: 'Kathryn Murphy',
            email: 'demo59@gmail.com',
            registrationDate: 'December 20, 2025',
            subscription: 'Gold Protection',
        }
    ];
    ;

    // Filter users based on search term and subscription filter
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSubscription = filterSubscription === 'all' ||
                user.subscription === filterSubscription;
            return matchesSearch && matchesSubscription;
        });
    }, [users, searchTerm, filterSubscription]);

    // Calculate pagination values
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterSubscription]);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust if we're at the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const handleBlock = (userId: number) => {
        console.log(`Block user ${userId}`);
        // Add your block logic here
    };

    const handleRemove = (userId: number) => {
        console.log(`Remove user ${userId}`);
        // Add your remove logic here
    };

    const subscriptionTypes = ['all', 'Basic Protection', 'Silver Protection', 'Gold Protection'];

    return (
        <div className="min-h-screen  p-6">
            <div className='bg-[#0D314B] rounded-lg'>
                {/* Header */}
                <div className="flex justify-between items-center p-6">
                    <h1 className="text-[20px] font-semibold text-[#F9FAFB]">User Management</h1>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-[#007ED6] rounded-lg focus:ring-2 focus:ring-[#007ED6] focus:border-[#007ED6]"
                        />
                        <Search size={18} className='absolute right-4 top-3 cursor-pointer' />
                    </div>
                </div>



                {/* Table Container */}
                <div className="rounded-lg shadow-sm border border-[#007ED6] overflow-hidden">
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-[#007ED6]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        NO
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Registration Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Subscriptions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            {user.registrationDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold text-[#F9FAFB] `}
                                            >
                                                {user.subscription}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleBlock(user.id)}
                                                    className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors"
                                                >
                                                    Block
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(user.id)}
                                                    className="bg-[#551214] px-4 py-1 text-[#FE4D4F] rounded cursor-pointer font-medium transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-[#007ED6]">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                            {/* Showing results text */}
                            <div className="text-sm text-white">
                                Showing{' '}
                                <span className="font-medium">
                                    {totalItems === 0 ? 0 : startIndex + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(endIndex, totalItems)}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">{totalItems}</span> results
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-1">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 text-sm rounded transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${currentPage === totalPages || totalPages === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}