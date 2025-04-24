'use client';

import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stayPref: '',
    travelMethod: '',
    arrivalDetails: '',
    departureDetails: '',
    confSuggestions: '',
    stayPrefOther: '',
    travelMethodOther: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSfyZGfAYmaH_Aueg_rqGRv7jnIRnk6ItdaMbfvZe95cZ7zdiw/formResponse';
    const formBody = new URLSearchParams();
  
    // Handle "Other" for stayPref
    if (formData.stayPref === 'Other') {
      formBody.append('entry.1600575531', '__other_option__');
      formBody.append('entry.1600575531.other_option_response', formData.stayPrefOther);
    } else {
      formBody.append('entry.1600575531', formData.stayPref);
    }
  
    // Handle "Other" for travelMethod
    if (formData.travelMethod === 'Other') {
      formBody.append('entry.79012805', '__other_option__');
      formBody.append('entry.79012805.other_option_response', formData.travelMethodOther);
    } else {
      formBody.append('entry.79012805', formData.travelMethod);
    }
  
    // The rest as before
    formBody.append('entry.400326312', formData.firstName);
    formBody.append('entry.1981204620', formData.lastName);
    formBody.append('entry.25691616', formData.email);
    formBody.append('entry.251825236', formData.phone);
    formBody.append('entry.1468105925', formData.arrivalDetails);
    formBody.append('entry.501134014', formData.departureDetails);
    formBody.append('entry.827130365', formData.confSuggestions);
  
    try {
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formBody,
      });
      setIsSubmitting(false);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('Submission failed. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen bg-[#be9448] flex items-center justify-center p-6">
      <div className="bg-white text-[#003366] p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Svasthya 2025 Travel Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1">First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Email used to register *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">
              Are you comfortable staying at a family's home from the organization? *
            </label>
            <select
              name="stayPref"
              value={formData.stayPref}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Other">Other</option>
            </select>
            {formData.stayPref === 'Other' && (
              <input
                type="text"
                name="stayPrefOther"
                value={formData.stayPrefOther}
                onChange={handleChange}
                placeholder="Please specify"
                className="w-full border p-2 mt-2 rounded"
              />
            )}
          </div>

          <div>
            <label className="block mb-1">Travel Method *</label>
            <select
              name="travelMethod"
              value={formData.travelMethod}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select an option</option>
              <option value="Driving">Driving</option>
              <option value="Flying">Flying</option>
              <option value="Other">Other</option>
            </select>
            {formData.travelMethod === 'Other' && (
              <input
                type="text"
                name="travelMethodOther"
                value={formData.travelMethodOther}
                onChange={handleChange}
                placeholder="Please specify"
                className="w-full border p-2 mt-2 rounded"
              />
            )}
          </div>

          <div>
            <label className="block mb-1">Arrival Flight details (Arrival time and Flight number)</label>
            <input
              name="arrivalDetails"
              value={formData.arrivalDetails}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Departure Flight details (Departure time and Flight number)</label>
            <input
              name="departureDetails"
              value={formData.departureDetails}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">What would you like to see at the conference?</label>
            <textarea
              name="confSuggestions"
              value={formData.confSuggestions}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded text-white font-semibold ${
              isSubmitting ? 'bg-gray-400' : 'bg-[#003366] hover:bg-[#001d33]'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
