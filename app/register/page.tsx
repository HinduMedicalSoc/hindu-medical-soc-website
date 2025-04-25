'use client';

import React, { useState } from 'react';
import StripePayment from '@/components/StripePayment';

// Define types for our payment flow
interface PaymentStatus {
  status: string;
  transactionId: string;
}

interface PaymentResult {
  payment_status: string;
  transaction_id: string;
  [key: string]: any; // For any other fields returned
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isStudent?: string;
  affiliation?: string;
  cityState?: string;
  [key: string]: string | undefined;
}



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

  const studentPrice = 5000; //price in cents
  const nonStudentPrice = 10000; //price in cents

  
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
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
    const newErrors: FormErrors = {};
    
    // Check each field for emptiness
    Object.keys(formData).forEach(field => {
      if (!formData[field as keyof typeof formData].trim()) {
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

  


  const [clientSecret, setClientSecret] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // 1. Create payment intent data
      const paymentIntentData = {
        amount: formData.isStudent === 'Yes' ? studentPrice : nonStudentPrice,
        email: formData.email
      };

      // 2. Create payment intent using our local API
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentIntentData)
      });

      const paymentIntentResult = await paymentIntentResponse.json();
      
      if (paymentIntentResponse.ok && paymentIntentResult.clientSecret) {
        // Store the client secret and show payment modal
        setClientSecret(paymentIntentResult.clientSecret);
        setFormSubmitted(true);
        setShowPayment(true);
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again.');
    }
  };
  
  // Handle payment completion
  const handlePaymentComplete = async (result: PaymentResult) => {
    // Set payment status for display
    setPaymentStatus({
      status: result.payment_status,
      transactionId: result.transaction_id
    });
    
    // Hide payment modal
    setShowPayment(false);
    
    // Only submit form data to Google Forms if payment was successful
    if (result.payment_status === 'succeeded') {
      try {
        // Submit the form data to Google Forms after successful payment
        const formBody = new URLSearchParams();
        formBody.append('entry.924934748', formData.firstName);
        formBody.append('entry.1912724324', formData.lastName);
        formBody.append('entry.1518749685', formData.email);
        formBody.append('entry.36522193', formData.phone);
        formBody.append('entry.757408178', formData.isStudent);
        formBody.append('entry.813638862', formData.affiliation);
        formBody.append('entry.272697809', formData.cityState);
        // You could add the transaction ID to a custom field if needed
        
        await fetch(
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
        
        // Reset form only after successful submission
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
        console.error('Error submitting form:', error);
        // Even if form submission fails, we still show payment success
        // Could add specific error handling here
      }
    }
  };

  const price = formData.isStudent === 'Yes' ? studentPrice : nonStudentPrice;

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



        <div className="flex justify-center mb-6">
          <a 
            href="https://forms.gle/NSukmmaApizQrAYY6" 
            className="bg-[#00192f] text-white font-bold py-2 px-6 rounded-full hover:bg-blue-800 transition duration-300 flex items-center"
          >
            Submit Travel Details
          </a>
        </div>

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
        {/* Payment status messages */}
        {paymentStatus && (
          <div className={`mt-6 p-4 rounded ${paymentStatus.status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <h3 className="font-bold text-lg">
              {paymentStatus.status === 'succeeded' ? 'Payment Successful!' : 'Payment Failed'}
            </h3>
            <p>
              {paymentStatus.status === 'succeeded' 
                ? `Thank you for registering for the Svasthya conference. Your transaction ID is: ${paymentStatus.transactionId}` 
                : 'There was an issue with your payment. Please try again or contact us for assistance.'}
            </p>
          </div>
        )}
        
        {/* Stripe Payment Component */}
        <StripePayment 
          amount={price} 
          email={formData.email}
          clientSecret={clientSecret}
          showPayment={showPayment}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </main>
  );
}