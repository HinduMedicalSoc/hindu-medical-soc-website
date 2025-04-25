'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise } from '@/config/stripe';

interface StripePaymentProps {
  amount: number;
  email: string;
  isManual?: string;
  clientSecret?: string | null;
  onPaymentComplete?: (result: any) => void;
  showPayment: boolean;
}

function PaymentForm({ clientSecret, email, onPaymentComplete, amount }: { clientSecret: string, email: string, onPaymentComplete?: (result: any) => void, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              email: email
            }
          },
        },
        redirect: 'if_required'
      });

      if (result.error) {
        setPaymentError(result.error.message || 'Payment failed');
        
        // Send the error to our local payment confirmation API
        const errorResponse = {
          email: email,
          amount: 0,
          transaction_id: '',
          payment_status: 'failed',
          responsejson: JSON.stringify(result.error)
        };
        
        await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorResponse)
        });
      } else {
        // Payment successful
        const paymentIntent = result.paymentIntent;
        
        if (paymentIntent) {
          const successResponse = {
            user_id: paymentIntent.id,
            email: email,
            amount: paymentIntent.amount,
            transaction_id: paymentIntent.id,
            payment_status: paymentIntent.status,
            responsejson: JSON.stringify(paymentIntent)
          };
          
          // Send the success response to our local payment confirmation API
          await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(successResponse)
          });

          if (onPaymentComplete) {
            onPaymentComplete(successResponse);
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPayment} className="p-2 mb-4">
     {/* <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2> */}
     {/* Show amount */}
     <div className="mb-2 text-lg font-semibold text-center text-hmsa-blue">
        Amount: {(amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
      
      <div className="mb-4">
        <LinkAuthenticationElement 
          options={{
            defaultValues: {
              email: email
            },
          }}
        />
      </div>
      
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      {paymentError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {paymentError}
        </div>
      )}
      
      <button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-hmsa-blue text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function StripePayment({ amount, email, isManual = "no", clientSecret: propClientSecret, onPaymentComplete, showPayment }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(propClientSecret || null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (propClientSecret) {
      setClientSecret(propClientSecret);
    }
  }, [propClientSecret]);

  if (!showPayment) {
    return null;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return <div>Preparing payment...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold">Complete Payment</h5>
          <button 
            type="button" 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => onPaymentComplete?.({ payment_status: 'cancelled', transaction_id: '' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <Elements
            stripe={getStripePromise()}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <PaymentForm 
              clientSecret={clientSecret}
              email={email} 
              onPaymentComplete={onPaymentComplete}
              amount={amount}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}