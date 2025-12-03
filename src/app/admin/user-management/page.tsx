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

interface ApiResponseData {
    total?: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    results?: User[];
    data?: User[];
    count?: number;
}

interface ApiResponse {
    data?: ApiResponseData;
    error?: string | { [key: string]: unknown };
    success?: boolean;
    message?: string;
}

// Helper function to safely extract error message
const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
        const errorObj = error as Record<string, unknown>;
        // Try to extract message from common error formats
        if ('message' in errorObj && typeof errorObj.message === 'string') {
            return errorObj.message;
        }
        if ('detail' in errorObj && typeof errorObj.detail === 'string') {
            return errorObj.detail;
        }
        if ('error' in errorObj && typeof errorObj.error === 'string') {
            return errorObj.error;
        }
        // Stringify the object if it has properties
        if (Object.keys(errorObj).length > 0) {
            return JSON.stringify(errorObj);
        }
    }
    return 'An error occurred';
};

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const itemsPerPage = 10;

    // Fetch users from API with search
    const fetchUsers = async (page: number, search: string = '') => {
        try {
            setLoading(true);
            // Build query parameters
            let endpoint = `/accounts/user_all/?page=${page}&page_size=${itemsPerPage}`;
            
            if (search) {
                endpoint += `&search=${encodeURIComponent(search)}`;
            }

            const response = await apiRequest<ApiResponse>("GET", endpoint, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            // Safely handle the response
            if (response && typeof response === 'object') {
                // Check for error first
                if ('error' in response && response.error) {
                    const errorMsg = getErrorMessage(response.error);
                    console.error('API Error:', errorMsg);
                    toast.error(errorMsg);
                    setUsers([]);
                    setTotalItems(0);
                    setTotalPages(0);
                    return;
                }

                // Extract data from response
                const responseData = response.data || response;
                
                // Now handle the actual data structure
                if (responseData && typeof responseData === 'object') {
                    // Extract users array from different possible properties
                    let usersArray: User[] = [];
                    const dataObj = responseData as Record<string, unknown>;
                    
                    if ('results' in dataObj && Array.isArray(dataObj.results)) {
                        usersArray = dataObj.results as User[];
                    } else if ('data' in dataObj && Array.isArray(dataObj.data)) {
                        usersArray = dataObj.data as User[];
                    } else if (Array.isArray(responseData)) {
                        usersArray = responseData as User[];
                    }
                    
                    setUsers(usersArray);
                    
                    // Extract total count
                    const total = (dataObj.total as number) || (dataObj.count as number) || usersArray.length;
                    setTotalItems(total);
                    
                    // Extract total pages
                    const pages = (dataObj.total_pages as number) || Math.ceil(total / itemsPerPage);
                    setTotalPages(pages);
                    
                    // Extract current page
                    const current = (dataObj.page as number) || page;
                    setCurrentPage(current);
                } else {
                    console.error('Invalid data format');
                    toast.error('Invalid data format received');
                    setUsers([]);
                    setTotalItems(0);
                    setTotalPages(0);
                }
            } else {
                console.error('Invalid response format');
                toast.error('Invalid response from server');
                setUsers([]);
                setTotalItems(0);
                setTotalPages(0);
            }
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            console.error('Failed to fetch users:', errorMsg);
            toast.error(`Failed to load users: ${errorMsg}`);
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
            const response = await apiRequest<ApiResponse>("POST", `/accounts/BlockUser/${userId}/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            console.log('Block response:', response);
            
            // Safely extract response message
            let message = 'User blocked successfully';
            if (response && typeof response === 'object') {
                const responseObj = response as Record<string, unknown>;
                
                if ('error' in responseObj && responseObj.error) {
                    message = getErrorMessage(responseObj.error);
                } else if ('data' in responseObj && responseObj.data && typeof responseObj.data === 'object') {
                    const dataObj = responseObj.data as Record<string, unknown>;
                    if ('detail' in dataObj && typeof dataObj.detail === 'string') {
                        message = dataObj.detail;
                    }
                } else if ('detail' in responseObj) {
                    message = typeof responseObj.detail === 'string' ? responseObj.detail : 'User blocked successfully';
                } else if ('message' in responseObj && responseObj.message) {
                    message = typeof responseObj.message === 'string' ? responseObj.message : 'User blocked successfully';
                }
            }
            
            // Update local state
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: false } : user
                )
            );
            
            toast.success(message);
            
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            console.error('Failed to block user:', errorMsg);
            toast.error(`Failed to block user: ${errorMsg}`);
        } finally {
            setActionLoading(null);
        }
    };

    // Unblock user function
    const handleUnblock = async (userId: number) => {
        try {
            setActionLoading(userId);
            const response = await apiRequest<ApiResponse>("POST", `/accounts/BlockUser/${userId}/unblock/`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            
            console.log('Unblock response:', response);
            
            // Safely extract response message
            let message = 'User unblocked successfully';
            if (response && typeof response === 'object') {
                const responseObj = response as Record<string, unknown>;
                
                if ('error' in responseObj && responseObj.error) {
                    message = getErrorMessage(responseObj.error);
                } else if ('data' in responseObj && responseObj.data && typeof responseObj.data === 'object') {
                    const dataObj = responseObj.data as Record<string, unknown>;
                    if ('detail' in dataObj && typeof dataObj.detail === 'string') {
                        message = dataObj.detail;
                    }
                } else if ('detail' in responseObj) {
                    message = typeof responseObj.detail === 'string' ? responseObj.detail : 'User unblocked successfully';
                } else if ('message' in responseObj && responseObj.message) {
                    message = typeof responseObj.message === 'string' ? responseObj.message : 'User unblocked successfully';
                }
            }
            
            // Update local state
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, is_active: true } : user
                )
            );
            
            toast.success(message);
            
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            console.error('Failed to unblock user:', errorMsg);
            toast.error(`Failed to unblock user: ${errorMsg}`);
        } finally {
            setActionLoading(null);
        }
    };

    // Initial load and when page changes
    useEffect(() => {
        fetchUsers(currentPage, searchTerm);
    }, [currentPage]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                fetchUsers(1, searchTerm);
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = (): number[] => {
        const pageNumbers: number[] = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get display name
    const getDisplayName = (user: User): string => {
        return user.Fullname || user.email.split('@')[0] || 'Unknown User';
    };

    // Calculate display values
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="min-h-screen p-6">
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
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-white">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-white">
                                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                                        </td>
                                    </tr>
                                ) : (
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