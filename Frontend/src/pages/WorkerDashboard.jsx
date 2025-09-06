import React from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function WorkerDashboard() {
  const jobs = [
    { title: "Software Engineer", company: "Tech Company", location: "Remote", postedDate: "2023-09-01", price: "$80 - $120/hr" },
    { title: "Product Manager", company: "Business Inc.", location: "New York, NY", postedDate: "2023-08-15", price: "$90 - $130/hr" },
    { title: "UX Designer", company: "Creative Agency", location: "San Francisco, CA", postedDate: "2023-07-30", price: "$70 - $110/hr" },
    { title: "Data Analyst", company: "Data Solutions", location: "Chicago, IL", postedDate: "2023-07-20", price: "$75 - $115/hr" },
    { title: "Marketing Specialist", company: "Marketing Pros", location: "Los Angeles, CA", postedDate: "2023-06-25", price: "$65 - $105/hr" },
    { title: "DevOps Engineer", company: "Cloud Services", location: "Austin, TX", postedDate: "2023-06-10", price: "$85 - $125/hr" },
    { title: "Sales Executive", company: "Sales Corp.", location: "Miami, FL", postedDate: "2023-05-05", price: "$90 - $130/hr" },
    { title: "Content Writer", company: "Content Creators", location: "Seattle, WA", postedDate: "2023-04-15", price: "$60 - $100/hr" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-b-lg">
        <div className="flex items-center font-bold text-xl text-black">
          
          <div className="w-10 h-10 bg-blue-500 rounded-full" />
          
          <span className="ml-2">JobsPark</span>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            to="/worker-profile"
            className="flex items-center text-black px-6 py-2 rounded-full bg-white hover:bg-gray-300 cursor-pointer shadow-md"
          >
            <FaUserCircle className="mr-2" /> Profile
          </Link>
        </div>
        <div className="flex items-center text-black px-6 py-2 rounded-full bg-white hover:bg-gray-300 cursor-pointer shadow-md">
          <button className="font-semibold">Log Out</button>
        </div>
      </header>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center my-8">
        <h1 className="text-3xl font-bold text-black mb-2">Worker Dashboard</h1>
        <p className="text-xl text-gray-600 p-2 m-2">
          Find Opportunities and Manage Your Job Opportunities
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center items-center gap-8 mx-auto my-8 flex-wrap">
        <div className="bg-white border-2 border-black rounded-lg p-4 w-50 text-center">
          <FaUsers className="text-3xl text-blue-500 mx-auto mb-2" />
          <h2 className="text-l font-semibold text-black">Available Workers</h2>
        </div>
        <div className="bg-white border-2 border-black rounded-lg p-4 w-50">
          <FaShieldAlt className="text-3xl text-orange-500 mx-auto mb-2" />
          <h2 className="text-black font-semibold text-l mb-2 text-center">Pending Jobs</h2>
        </div>
        <div className="bg-white border-2 border-black rounded-lg p-4 w-50">
          <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-2" />
          <h2 className="text-black font-semibold text-l mb-2 text-center">Completed Jobs</h2>
        </div>
        <div className="bg-white border-2 border-black rounded-lg p-4 w-50">
          <FaClock className="text-3xl text-purple-500 mx-auto mb-2" />
          <h2 className="text-black font-semibold text-l mb-2 text-center">Pending Jobs</h2>
        </div>
      </div>

      {/* Job Opportunities */}
      <div className="flex flex-col justify-center mx-auto p-6 bg-white max-w-6xl">
        <h2 className="text-2xl font-semibold text-black mb-4 text-center">Jobs for you</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {jobs.map((job, index) => (
            <div key={index} className="min-w-[350px] bg-white border-2 border-black rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-black">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {job.location}
              </p>
              <p className="text-gray-400 text-sm">Posted on: {job.postedDate}</p>
              <p className="text-gray-800 font-semibold mt-2">
                {job.price ? `Price: ${job.price}` : "Price: Not specified"}
              </p>
              <div className="flex justify-end">
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-center items-center gap-6 mt-8 flex-wrap">
        <Link to="/jobs" className="bg-blue-300 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md">
          <b>Browse Jobs</b>
        </Link>
        <button className="bg-purple-400 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-colors duration-300 shadow-md">
          <b>Notifications</b>
        </button>
        <Link to="/make-payment" className="bg-teal-500 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md">
          <b>Make Payment</b>
        </Link>
        <Link to="/post-job" className="bg-green-400 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md">
          <b>Post Jobs</b>
        </Link>
      </div>

      {/* Payment Info */}
      <div className="flex flex-col my-8 mx-6 border-green-500 border-2 p-4 rounded-lg bg-white relative">
        <div className="flex items-start">
          <FaCheckCircle className="text-3xl text-green-500 mr-2" />
          <p className="text-l text-black">
            Payment Up to date. Your fees are up to date, ensuring uninterrupted access to the platform. Keep it up!
          </p>
        </div>
        <div className="absolute right-4 top-4">
          <Link to="/payment-page" className="text-green-600 font-semibold flex items-center hover:underline">
            Make Payment
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;
