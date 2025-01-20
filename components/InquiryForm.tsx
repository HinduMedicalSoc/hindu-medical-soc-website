import React, { useState } from "react";

const InquiryForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { name, email, message });
    onClose(); // Close the modal after submission
  };

  return (
    <div
      className='bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto'
      style={{ maxWidth: "700px" }} // Adjust for larger form size
    >
      <h3 className='text-3xl text-black font-bold mb-6 text-center'>
        Contact Us
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 font-medium mb-2'>
            Name
          </label>
          <input
            type='text'
            id='name'
            className='w-full p-3 border rounded-lg text-black' // Set text color to black
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter your name'
            required
          />
        </div>

        {/* Email Field */}
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 font-medium mb-2'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='w-full p-3 border rounded-lg text-black' // Set text color to black
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
        </div>

        {/* Message Field */}
        <div className='mb-4'>
          <label
            htmlFor='message'
            className='block text-gray-700 font-medium mb-2'>
            Message
          </label>
          <textarea
            id='message'
            className='w-full p-3 border rounded-lg text-black' // Set text color to black
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Write your message here'
            rows={5}
            required
          />
        </div>

        {/* Buttons */}
        <div className='flex justify-between'>
          <button
            type='button'
            className='bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition'
            onClick={onClose}>
            Cancel
          </button>
          <button
            type='submit'
            className='bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
