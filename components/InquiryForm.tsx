import React, { useState } from "react";

const InquiryForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show loading state while submitting
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Prepare the data to send
    const inquiryData = {
      name,
      email,
      message,
    };

    try {
      // Send the data to your API
      const response = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      // If successful, show success message and close the form
      setSuccess(true);
      onClose();
    } catch (error) {
      // Handle error
      setError(error.message || "Something went wrong");
    } finally {
      // Hide loading state after submission
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto"
      style={{ maxWidth: "700px" }} // Adjust for larger form size
    >
      <h3 className="text-3xl text-black font-bold mb-6 text-center">
        Contact Us
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-3 border rounded-lg text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border rounded-lg text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Message Field */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-3 border rounded-lg text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here"
            rows={5}
            required
          />
        </div>

        {/* Error / Success Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-500 text-center">
            <p>Your inquiry has been submitted successfully!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
