'use client'

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import userImage from "@/../public/images/profile.jpg"
import Image from 'next/image';
import { apiRequest } from '@/app/lib/api';
import { toast } from 'react-toastify';

interface User {
    id: number;
    Fullname: string;
    email: string;
    date_joined: string;
    is_active?: boolean;
}

interface ApiResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: User[];
}

interface BlockResponse {
    detail: string;
}

interface DeleteResponse {
    detail: string;
}

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [actionLoading, setActionLoading] = useState<number | null>(null); // Track which user action is loading
    const itemsPerPage = 10;

    // Fetch users from API with search
    const fetchUsers = async (page: number, search: string = '') => {
        try {
            setLoading(true);
            // Build query parameters
            let endpoint = `/accounts/user_all/?page=${page}&page_size=${itemsPerPage}`;
            
            // Add search parameter if search term exists
            if (search) {
                endpoint += `&search=${encodeURIComponent(search)}`;
            }

            const data: ApiResponse = await apiRequest("GET", endpoint, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            setUsers(data.results);
            setTotalItems(data.total);
            setTotalPages(data.total_pages);
            setCurrentPage(data.page);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
            setTotalItems(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Block user function
    const handleBlock = async (userId: number) => {
        try {
            setActionLoading(userId);
            const response: BlockResponse = await apiRequest("POST", `/accounts/BlockUser/${userId}/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            console.log('Block response:', response);
            
            // Update local state to reflect the block status immediately
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: false } : user
                )
            );
            
            // Show success message
            toast.success(response.detail || 'User blocked successfully');
            
        } catch (error: any) {
            console.error('Failed to block user:', error);
            toast.error(error?.error || 'Failed to block user');
        } finally {
            setActionLoading(null);
        }
    };

    // Unblock user function
    const handleUnblock = async (userId: number) => {
        try {
            setActionLoading(userId);
            const response: BlockResponse = await apiRequest("POST", `/accounts/BlockUser/${userId}/unblock/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            console.log('Unblock response:', response);
            
            // Update local state to reflect the unblock status immediately
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: true } : user
                )
            );
            
            // Show success message
            toast.success(response.detail || 'User unblocked successfully');
            
        } catch (error: any) {
            console.error('Failed to unblock user:', error);
            toast.error(error?.error || 'Failed to unblock user');
        } finally {
            setActionLoading(null);
        }
    };

    // Remove user function
    const handleRemove = async (userId: number) => {
        if (!confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(userId);
            // Assuming your delete API endpoint - adjust if different
            const response: DeleteResponse = await apiRequest("DELETE", `/accounts/user_all/${userId}/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            console.log('Remove response:', response);
            
            // Remove user from local state immediately
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setTotalItems(prev => prev - 1);
            
            // Show success message
            toast.success(response.detail || 'User removed successfully');
            
            // If current page becomes empty, go to previous page
            if (users.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            
        } catch (error: any) {
            console.error('Failed to remove user:', error);
            toast.error(error?.error || 'Failed to remove user');
        } finally {
            setActionLoading(null);
        }
    };

    // Initial load and when page changes
    useEffect(() => {
        fetchUsers(currentPage, searchTerm);
    }, [currentPage]);

    // Debounced search - fetch new data when search term changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                fetchUsers(1, searchTerm);
            } else {
                setCurrentPage(1); // This will trigger the useEffect above
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

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

    // Calculate display values for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="min-h-screen  p-6">
            <div className='bg-[#0D314B] rounded-lg'>
                {/* Header */}
                <div className="flex justify-between items-center p-6">
                    <h1 className="text-[20px] font-semibold text-[#F9FAFB]">User Management</h1>
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search by name or email"
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
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Subscriptions
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Status
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
                                        <td colSpan={7} className="px-6 py-4 text-center text-white">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    // No users state
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-white">
                                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                                        </td>
                                    </tr>
                                ) : (
                                    // Users data - use the users from API directly
                                    users.map((user, index) => (
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
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold text-[#F9FAFB]`}
                                                >
                                                    Basic Protection
                                                </span>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                                        user.is_active === false 
                                                            ? 'bg-red-500/20 text-red-300 border border-red-500' 
                                                            : 'bg-green-500/20 text-green-300 border border-green-500'
                                                    }`}
                                                >
                                                    {user.is_active === false ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    {user.is_active === false ? (
                                                        // Show Unblock button for blocked users
                                                        <button
                                                            onClick={() => handleUnblock(user.id)}
                                                            disabled={actionLoading === user.id}
                                                            className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <>
                                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Unblocking...
                                                                </>
                                                            ) : (
                                                                'Unblock'
                                                            )}
                                                        </button>
                                                    ) : (
                                                        // Show Block button for active users
                                                        <button
                                                            onClick={() => handleBlock(user.id)}
                                                            disabled={actionLoading === user.id}
                                                            className="bg-[#0ABF9D4D] px-4 py-1 text-[#0ABF9D] rounded cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <>
                                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Blocking...
                                                                </>
                                                            ) : (
                                                                'Block'
                                                            )}
                                                        </button>
                                                    )}
                                                    {/* <button
                                                        onClick={() => handleRemove(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="bg-[#551214] px-4 py-1 text-[#FE4D4F] rounded cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Removing...
                                                            </>
                                                        ) : (
                                                            'Remove'
                                                        )}
                                                    </button> */}
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
                                    {endIndex}
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