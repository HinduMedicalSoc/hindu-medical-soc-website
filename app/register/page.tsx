'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isStudent: '',
    affiliation: '',
    cityState: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check each field for emptiness
    Object.keys(formData).forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation - simple check for minimum length
    if (formData.phone && formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const formBody = new URLSearchParams();
    formBody.append('entry.924934748', formData.firstName);  // First Name
    formBody.append('entry.1912724324', formData.lastName);  // Last Name
    formBody.append('entry.1518749685', formData.email);  // Email
    formBody.append('entry.36522193', formData.phone);  // Phone Number
    formBody.append('entry.757408178', formData.isStudent);  // Are you a student?
    formBody.append('entry.813638862', formData.affiliation);  // Affiliation
    formBody.append('entry.272697809', formData.cityState);  // City/State

    try {
      const response = await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSd5SUUCSsosYhsO5cCWsQPToe3lIybEK6uKNCnuGWAzE3AHGA/formResponse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
          mode: 'no-cors',
        }
      );

      // Note: With mode: 'no-cors', response status is always 0
      // so we can't really check response.ok
      alert('Form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isStudent: '',
        affiliation: '',
        cityState: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <main className="min-h-screen bg-[#be9448] px-4 py-10 text-white">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-lg text-[#00192f]">
        {/* Centered Title */}
        <h1 className="text-4xl font-bold mb-2 text-center">Svasthya - HMSA National Conference 2025</h1>

        <p className="mb-4">
          The Hindu Medical Society of America (HMSA) is a community of medical students,
          residents, and professionals committed to practicing medicine through the principles
          of Hindu Dharma. By offering opportunities for Networking, Sewa (selfless service),
          Education, and Research, HMSA empowers its members to integrate these values into
          their medical careers, fostering a compassionate and informed healthcare community.
        </p>
        <p className="mb-4">
          Our national conference, <strong>Svasthya</strong>, provides a platform for individuals
          in healthcare to connect, discuss the integration of Hindu values in healthcare, and
          share their work with one another. The Svasthya 2025 national conference will take
          place from <strong>July 12–13</strong> in <strong>San Antonio, Texas</strong> at <strong>Aum Ashram</strong>.
        </p>
        <p className="mb-4 text-sm italic">
          None of the details entered on this form will be listed/available publicly without your
          permission. If you have any questions or concerns, contact us at{' '}
          <a className="underline" href="mailto:hindumedicalsoc@gmail.com">hindumedicalsoc@gmail.com</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-center">Eligible participants:</h2>
        <ul className="list-disc list-inside mb-6 text-center">
          <li>Undergrads (3rd year and above) on pre-health pathway</li>
          <li>Gap year students for healthcare pathways</li>
          <li>Students in healthcare-related professional schools</li>
          <li>Healthcare professionals and professors</li>
        </ul>

        {/* Actual Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${errors.firstName ? 'border-red-500' : ''}`}
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${errors.lastName ? 'border-red-500' : ''}`}
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${errors.phone ? 'border-red-500' : ''}`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Are you a student? */}
          <div>
            <label className="block mb-1 font-medium">
              Are you a student? (in university or professional school) <span className="text-red-500">*</span>
            </label>
            <select
              name="isStudent"
              value={formData.isStudent}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${errors.isStudent ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.isStudent && (
              <p className="text-red-500 text-sm mt-1">{errors.isStudent}</p>
            )}
          </div>

          {/* Affiliation */}
          <div>
            <label className="block mb-1 font-medium">
              Name of Institution/Practice <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${errors.affiliation ? 'border-red-500' : ''}`}
              required
            />
            {errors.affiliation && (
              <p className="text-red-500 text-sm mt-1">{errors.affiliation}</p>
            )}
          </div>

          {/* City and State */}
          <div>
            <label className="block mb-1 font-medium">
              City/State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cityState"
              value={formData.cityState}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${errors.cityState ? 'border-red-500' : ''}`}
              required
            />
            {errors.cityState && (
              <p className="text-red-500 text-sm mt-1">{errors.cityState}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 bg-hmsa-blue text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}