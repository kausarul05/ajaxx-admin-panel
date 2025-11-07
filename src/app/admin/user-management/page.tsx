'use client'

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import userImage from "@/../public/images/profile.jpg"
import Image from 'next/image';
import { apiRequest } from '@/app/lib/api';

interface User {
    id: number;
    Fullname: string;
    email: string;
    date_joined: string;
}

interface ApiResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: User[];
}

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubscription] = useState('all');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;


    // Fetch users from API
    const fetchUsers = async (page: number) => {
        try {
            setLoading(true);
            const data: ApiResponse = await apiRequest("GET", `/accounts/user_all/?page=${page}&page_size=${itemsPerPage}`, null, {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            setUsers(data.results);
            setTotalItems(data.total);
            setTotalPages(data.total_pages);
            setCurrentPage(data.page);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Filter users based on search term and subscription filter
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                (user.Fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesSubscription = filterSubscription === 'all';
            return matchesSearch && matchesSubscription;
        });
    }, [users, searchTerm, filterSubscription]);

    // Calculate pagination values for current filtered results
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
            // The useEffect will trigger the API call with the new page
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

    // Format date to match your design
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get display name (use Fullname if available, otherwise use email)
    const getDisplayName = (user: User) => {
        return user.Fullname || user.email.split('@')[0] || 'Unknown User';
    };

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
                                {loading ? (
                                    // Loading state
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-white">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : currentUsers.length === 0 ? (
                                    // No users state
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-white">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    // Users data
                                    currentUsers.map((user, index) => (
                                        <tr key={user.id} className="">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                <div className='flex items-center gap-3'>
                                                    <Image
                                                        src={userImage}
                                                        alt={getDisplayName(user)}
                                                        width={120}
                                                        height={60}
                                                        className='w-10 h-10 object-fill rounded'
                                                    />
                                                    {getDisplayName(user)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F9FAFB]">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {formatDate(user.date_joined)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold text-[#F9FAFB]`}
                                                >
                                                    Basic Protection
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
                                    ))
                                )}
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
                            <div className="flex items-center space-x-3">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className={`w-10 h-10 font-bold text-sm rounded transition-colors cursor-pointer ${currentPage === 1 || loading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <ChevronLeft size={24} color='black' className='font-bold mx-auto' />
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        disabled={loading}
                                        className={`w-10 h-10 font-bold text-sm rounded transition-colors cursor-pointer ${currentPage === page
                                            ? 'bg-[#245FE7] text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0 || loading}
                                    className={`w-10 h-10 font-bold cursor-pointer text-sm rounded transition-colors ${currentPage === totalPages || totalPages === 0 || loading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <ChevronRight size={24} color='black' className='font-bold mx-auto' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}