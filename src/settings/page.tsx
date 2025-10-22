import React from 'react'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0A2131] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Profile Information</h1>
          <button className="text-[#007ED6] hover:text-[#006bb3] text-sm font-medium mt-2">
            change Password
          </button>
        </div>

        <div className="bg-[#0D314B] rounded-lg border border-[#1b4b70] p-6">
          {/* Phone Profile Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Phone Profile</h2>
            
            {/* Display Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                placeholder="Enter Your Display Name"
                className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value="demo@gmail.com"
                readOnly
                className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Country & City Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] text-gray-300">
                  <option value="">Select Your Country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <select className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] text-gray-300">
                  <option value="">Select Your City</option>
                  <option value="new-york">New York</option>
                  <option value="london">London</option>
                  <option value="toronto">Toronto</option>
                </select>
              </div>
            </div>

            {/* Province & Gender Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Province</label>
                <select className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] text-gray-300">
                  <option value="">Select Your Province</option>
                  <option value="ontario">Ontario</option>
                  <option value="california">California</option>
                  <option value="london">London</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] text-gray-300">
                  <option value="">Select Your Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                placeholder="Enter Your Bio"
                rows={4}
                className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="bg-[#007ED6] hover:bg-[#006bb3] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}