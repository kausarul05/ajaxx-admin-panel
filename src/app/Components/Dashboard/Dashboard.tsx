import React from 'react';

export default function Dashboard() {
    const stats = [
        { title: 'Total User', value: '25,648' },
        { title: 'Subscribers', value: '58,320' },
        { title: 'Total Earning', value: '$52,567.53' },
    ];

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
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earning Summary Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Earning Summary</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Revenue</span>
                            </div>
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                                +4% Monthly
                            </div>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="space-y-4">
                        {/* Y-axis labels */}
                        <div className="flex items-end h-48">
                            <div className="flex flex-col justify-between h-full mr-4 text-sm text-gray-500">
                                <span>20k</span>
                                <span>15k</span>
                                <span>10k</span>
                                <span>05k</span>
                                <span>00k</span>
                            </div>

                            {/* Bars placeholder */}
                            <div className="flex-1 flex items-end justify-between">
                                {months.map((month, index) => (
                                    <div key={month} className="flex flex-col items-center">
                                        <div
                                            className="bg-blue-500 rounded-t w-8 mb-2"
                                            style={{
                                                height: `${20 + Math.random() * 60}%`,
                                                minHeight: '20px'
                                            }}
                                        ></div>
                                        <span className="text-xs text-gray-500">{month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">User</h2>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">No</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Name</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Email</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Registration Date</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Subscriptions</th>
                                    <th className="text-left text-sm font-medium text-gray-500 pb-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100">
                                        <td className="py-4 text-sm text-gray-900">{user.id}</td>
                                        <td className="py-4 text-sm text-gray-900">{user.name}</td>
                                        <td className="py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-4 text-sm text-gray-600">{user.registrationDate}</td>
                                        <td className="py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.subscription === 'Gold Protection'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : user.subscription === 'Silver Protection'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.subscription}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}