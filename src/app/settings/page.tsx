"use client";
import React, { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "password"

  return (
    <div className="min-h-screen bg-[#0A2131] text-white p-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="mb-8 w-[400px] bg-[#0D314B] h-full p-4 rounded-lg">
          <div className="mb-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`text-white font-semibold cursor-pointer mt-2 w-full text-start p-2 rounded ${
                activeTab === "profile" ? "bg-[#007ED6]" : ""
              }`}
            >
              Profile Information
            </button>
          </div>
          <div>
            <button
              onClick={() => setActiveTab("password")}
              className={`text-white font-semibold cursor-pointer mt-2 w-full text-start p-2 rounded ${
                activeTab === "password" ? "bg-[#007ED6]" : ""
              }`}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#0D314B] w-full rounded-lg border border-[#1b4b70] p-6">
          {activeTab === "profile" && (
            <div>
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

              {/* Country & City */}
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

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  placeholder="Enter Your Bio"
                  rows={4}
                  className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button className="bg-[#007ED6] hover:bg-[#006bb3] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter Current Password"
                  className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full bg-[#0A2131] border border-[#1b4b70] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#007ED6] placeholder-gray-400"
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-[#007ED6] hover:bg-[#006bb3] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
