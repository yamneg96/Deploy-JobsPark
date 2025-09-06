import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function CompletedJobModal() {
  const [jobData, setJobData] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  // Fetch job data (simulate for now)
  useEffect(() => {
    const mockJob = {
      title: "Electrician",
      description: "Wiring issue fixed",
      price: "100 ETB",
      location: "Kebele 04, College",
      status: "Completed"
    };
    setJobData(mockJob);
  }, []);

  const handleStarClick = (index) => {
    setRating(index + 1);
    setSubmitted(true);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setScreenshot(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-70 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full p-8">
        <h2 className="text-3xl font-bold text-center text-black mb-8">Completed Job</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
          {/* Left Column: Job Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Job Details</h3>
            {jobData ? (
              <>
                <p><strong>Job:</strong> {jobData.title}</p>
                <p><strong>Description:</strong> {jobData.description}</p>
                <p><strong>Price:</strong> {jobData.price}</p>
                <p><strong>Location:</strong> {jobData.location}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    {jobData.status}
                  </span>
                </p>
              </>
            ) : (
              <p>Loading job details...</p>
            )}
          </div>

          {/* Center Column: Review */}
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">Rate the Job</h3>
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`cursor-pointer text-3xl ${
                    index < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(index)}
                />
              ))}
            </div>
            {submitted && (
              <p className="text-green-600 text-sm mt-2">✅ Thank you for your feedback!</p>
            )}
          </div>

          {/* Right Column: Upload Screenshot */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Upload Payment Screenshot</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {screenshot && (
              <div className="mt-2">
                <img
                  src={screenshot}
                  alt="Uploaded Screenshot"
                  className="w-full h-auto rounded shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Terms Link */}
        <div className="text-center mt-8">
          <Link
            to="/terms-and-agreements"
            className="text-blue-700 font-bold hover:underline"
          >
            Read the <span className="italic">terms and agreements</span> here.
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompletedJobModal;
