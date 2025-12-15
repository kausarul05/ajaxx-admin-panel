'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Save, X, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/app/lib/api';
import { toast } from 'react-toastify';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface FAQApiResponse {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: FAQ[];
}

export default function FAQManagement() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFAQs, setTotalFAQs] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        is_published: true
    });
    const [editFormData, setEditFormData] = useState<FAQ | null>(null);
    const pageSize = 10;

    // Fetch FAQs
    const fetchFAQs = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await apiRequest<FAQApiResponse>(
                "GET",
                `/service/faq/?page=${page}&page_size=${pageSize}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            // Safely handle the response
            if (response && typeof response === 'object') {
                // Check for results property
                if ('data' in response && response.data && 'results' in response.data && Array.isArray(response.data.results)) {
                    setFaqs(response.data.results);
                } else if ('results' in response && Array.isArray(response.results)) {
                    setFaqs(response.results);
                } else {
                    setFaqs([]);
                }

                // Check for count property (for total)
                if ('data' in response && response.data && 'count' in response.data && typeof response.data.count === 'number') {
                    setTotalFAQs(response.data.count);
                    setTotalPages(Math.ceil(response.data.count / pageSize));
                } else if ('count' in response && typeof response.count === 'number') {
                    setTotalFAQs(response.count);
                    setTotalPages(Math.ceil(response.count / pageSize));
                } else {
                    setTotalFAQs(faqs.length);
                    setTotalPages(1);
                }

                setCurrentPage(page);
            } else {
                setFaqs([]);
                setTotalPages(1);
                setTotalFAQs(0);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            toast.error("Failed to load FAQs");
            setFaqs([]);
            setTotalPages(1);
            setTotalFAQs(0);
            setCurrentPage(page);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs(1);
    }, []);

    // Handle form input changes for add
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form input changes for edit
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => prev ? {
            ...prev,
            [name]: value
        } : null);
    };

    // Handle checkbox change for add
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            is_published: e.target.checked
        }));
    };

    // Handle checkbox change for edit
    const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData(prev => prev ? {
            ...prev,
            is_published: e.target.checked
        } : null);
    };

    // Add new FAQ
    const handleAddFAQ = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const payload = {
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                is_published: formData.is_published
            };

            const response = await apiRequest(
                "POST",
                `/service/faq/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (response.id) {
                toast.success("FAQ added successfully");
                setShowAddForm(false);
                setFormData({
                    question: '',
                    answer: '',
                    is_published: true
                });
                fetchFAQs(currentPage);
            } else {
                throw new Error('Failed to add FAQ');
            }
        } catch (error) {
            console.error("Error adding FAQ:", error);
            toast.error("Failed to add FAQ");
        }
    };

    // Start editing FAQ
    const handleEdit = (faq: FAQ) => {
        setEditingId(faq.id);
        setEditFormData({ ...faq });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData(null);
    };

    // Update FAQ
    const handleUpdateFAQ = async (id: number) => {
        if (!editFormData) return;

        if (!editFormData.question.trim() || !editFormData.answer.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const payload = {
                question: editFormData.question.trim(),
                answer: editFormData.answer.trim(),
                is_published: editFormData.is_published
            };

            const response = await apiRequest(
                "PUT",
                `/service/faq/${id}/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            console.log("Update response:", response);

            if (response.id) {
                toast.success("FAQ updated successfully");
                setEditingId(null);
                setEditFormData(null);
                fetchFAQs(currentPage);
            } else {
                throw new Error('Failed to update FAQ');
            }
        } catch (error) {
            console.error("Error updating FAQ:", error);
            toast.error("Failed to update FAQ");
        }
    };

    // Delete FAQ
    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            const response = await apiRequest(
                "DELETE",
                `/service/faq/${id}/`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            console.log("Delete response:", response);

            // if (response) {
            toast.success("FAQ deleted successfully");
            // Refresh the current page or go to previous page if current page becomes empty
            if (faqs.length === 1 && currentPage > 1) {
                fetchFAQs(currentPage - 1);
            } else {
                fetchFAQs(currentPage);
            }
            // } else {
            //     throw new Error('Failed to delete FAQ');
            // }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            toast.error("Failed to delete FAQ");
        }
    };

    // Toggle FAQ publish status
    const handleTogglePublish = async (id: number, currentStatus: boolean) => {
        try {
            const payload = {
                is_published: !currentStatus
            };

            const response = await apiRequest(
                "PATCH",
                `/service/faq/${id}/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (response && typeof response === 'object' && 'success' in response && response.success) {
                toast.success(`FAQ ${!currentStatus ? 'published' : 'unpublished'} successfully`);
                fetchFAQs(currentPage);
            } else {
                throw new Error('Failed to update FAQ status');
            }
        } catch (error) {
            console.error("Error toggling FAQ status:", error);
            toast.error("Failed to update FAQ status");
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchFAQs(page);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A2131] p-6">
                <div className='bg-[#0D314B] p-6 rounded-lg'>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">FAQ Management</h1>
                    </div>
                    <div className="text-center py-12">
                        <div className="text-white">Loading FAQs...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A2131] p-6">
            <div className='bg-[#0D314B] p-6 rounded-lg'>
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">FAQ Management</h1>
                        <p className="text-gray-400 mt-2">
                            Showing {faqs.length} of {totalFAQs} FAQs
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#007ED6] text-white rounded-lg hover:bg-[#006bb3] transition-colors"
                    >
                        <Plus size={20} />
                        Add FAQ
                    </button>
                </div>

                {/* Add FAQ Form */}
                {showAddForm && (
                    <div className="mb-8 bg-[#0A2131] border border-[#007ED6] rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Add New FAQ</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="p-1 hover:bg-white/10 rounded"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddFAQ} className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Question *
                                </label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#092B41] border border-[#007ED6] rounded-lg focus:outline-none focus:border-[#007ED6] focus:ring-1 focus:ring-[#007ED6] text-white"
                                    placeholder="Enter question"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Answer *
                                </label>
                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full p-3 bg-[#092B41] border border-[#007ED6] rounded-lg focus:outline-none focus:border-[#007ED6] focus:ring-1 focus:ring-[#007ED6] text-white resize-none"
                                    placeholder="Enter answer"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4 text-[#007ED6] bg-gray-100 border-gray-300 rounded focus:ring-[#007ED6] focus:ring-2"
                                />
                                <label htmlFor="is_published" className="ml-2 text-sm text-white">
                                    Publish immediately
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#007ED6] text-white rounded-lg hover:bg-[#006bb3] transition-colors"
                                >
                                    <Plus size={20} />
                                    Add FAQ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* FAQs Table */}
                <div className="overflow-x-auto rounded-lg border border-[#007ED6]">
                    <table className="min-w-full">
                        <thead className="bg-[#092B41]">
                            <tr>
                                <th className="py-3 px-4 text-left text-white font-semibold">ID</th>
                                <th className="py-3 px-4 text-left text-white font-semibold">Question</th>
                                <th className="py-3 px-4 text-left text-white font-semibold">Answer</th>
                                <th className="py-3 px-4 text-left text-white font-semibold">Status</th>
                                <th className="py-3 px-4 text-left text-white font-semibold">Created</th>
                                <th className="py-3 px-4 text-left text-white font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1b4b70]">
                            {faqs.map((faq) => (
                                <tr key={faq.id} className="hover:bg-[#092B41]/50">
                                    <td className="py-3 px-4 text-gray-300">{faq.id}</td>
                                    <td className="py-3 px-4">
                                        {editingId === faq.id ? (
                                            <input
                                                type="text"
                                                name="question"
                                                value={editFormData?.question || ''}
                                                onChange={handleEditInputChange}
                                                className="w-full p-2 bg-[#0A2131] border border-[#007ED6] rounded text-white"
                                            />
                                        ) : (
                                            <div className="text-white">{faq.question}</div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editingId === faq.id ? (
                                            <textarea
                                                name="answer"
                                                value={editFormData?.answer || ''}
                                                onChange={handleEditInputChange}
                                                rows={2}
                                                className="w-full p-2 bg-[#0A2131] border border-[#007ED6] rounded text-white resize-none"
                                            />
                                        ) : (
                                            <div className="text-gray-300 max-w-md truncate">{faq.answer}</div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {editingId === faq.id ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`edit_published_${faq.id}`}
                                                    name="is_published"
                                                    checked={editFormData?.is_published || false}
                                                    onChange={handleEditCheckboxChange}
                                                    className="w-4 h-4 text-[#007ED6] bg-gray-100 border-gray-300 rounded focus:ring-[#007ED6] focus:ring-2"
                                                />
                                                <label htmlFor={`edit_published_${faq.id}`} className="ml-2 text-sm text-white">
                                                    Published
                                                </label>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleTogglePublish(faq.id, faq.is_published)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${faq.is_published
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    }`}
                                            >
                                                {faq.is_published ? (
                                                    <>
                                                        <Eye size={14} />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff size={14} />
                                                        Draft
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-gray-400 text-sm">
                                        {formatDate(faq.created_at)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {editingId === faq.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateFAQ(faq.id)}
                                                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
                                                        title="Save"
                                                    >
                                                        <Save size={16} className="text-white" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} className="text-gray-300" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(faq)}
                                                        className="p-2 rounded-lg border border-[#007ED6] hover:bg-[#007ED6]/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} className="text-[#007ED6]" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        className="p-2 rounded-lg border border-[#EB4335] hover:bg-[#EB4335]/10 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash size={16} className="text-[#EB4335]" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {faqs.length === 0 && !showAddForm && (
                    <div className="text-center py-12">
                        <div className="bg-[#0A2131] rounded-lg border border-[#007ED6] p-8 max-w-md mx-auto">
                            <svg
                                className="w-16 h-16 text-[#007ED6] mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-white mb-2">No FAQs Yet</h3>
                            <p className="text-gray-400 mb-4">Get started by adding your first FAQ.</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#007ED6] text-white rounded-lg hover:bg-[#006bb3] transition-colors mx-auto"
                            >
                                <Plus size={20} />
                                Add First FAQ
                            </button>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && faqs.length > 0 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-[#007ED6] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006bb3] transition-colors"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                        ? 'bg-[#007ED6] text-white'
                                        : 'bg-[#0A2131] text-white hover:bg-[#12446a] border border-[#1b4b70]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-[#007ED6] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#006bb3] transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Page Info */}
                {faqs.length > 0 && (
                    <div className="text-center mt-4 text-gray-400">
                        Page {currentPage} of {totalPages}
                    </div>
                )}
            </div>
        </div>
    );
}