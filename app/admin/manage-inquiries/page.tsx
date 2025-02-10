"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp?: any;
};

export default function ManageInquiries() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [completedMessages, setCompletedMessages] = useState<Message[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
    fetchCompletedMessages();
  }, []);

  const fetchMessages = async () => {
    const messagesRef = collection(db, "contact-us");
    const querySnapshot = await getDocs(messagesRef);
    const messagesList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Message)
    );
    setMessages(messagesList);
  };

  const fetchCompletedMessages = async () => {
    const completedRef = collection(db, "completed-inquiries");
    const querySnapshot = await getDocs(completedRef);
    const completedList = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Message)
    );
    setCompletedMessages(completedList);
  };

  const handleMarkCompleted = async (message: Message) => {
    try {
      // Add to completed collection
      await addDoc(collection(db, "completed-inquiries"), {
        name: message.name,
        email: message.email,
        message: message.message,
      });

      // Remove from active inquiries
      await deleteDoc(doc(db, "contact-us", message.id));

      // Refresh both lists
      await fetchMessages();
      await fetchCompletedMessages();
    } catch (error) {
      console.error("Error marking as completed:", error);
    }
  };

  const handleMarkActive = async (message: Message) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Attempt to mark active");
    }
    try {
      // Add to completed collection
      await addDoc(collection(db, "contact-us"), {
        name: message.name,
        email: message.email,
        message: message.message,
      });

      // Remove from active inquiries
      await deleteDoc(doc(db, "completed-inquiries", message.id));

      // Refresh both lists
      await fetchMessages();
      await fetchCompletedMessages();
    } catch (error) {
      console.error("Error marking as active:", error);
    }
  };

  const handleDeleteInquiry = async (message: Message) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Attempt to delete inquiry");
    }
    try {
      await deleteDoc(doc(db, "completed-inquiries", message.id));
      //If the environment is dev, console log the deletion success message
      //Check if the environment is dev
      if (process.env.NODE_ENV === "development") {
        console.log("Inquiry deleted successfully");
      }
      await fetchCompletedMessages();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthGuard>
      <div className='relative min-h-screen p-4'>
        <h1 className='text-4xl font-bold mb-8 text-center'>
          Manage Inquiries
        </h1>

        <div className='flex justify-between mb-8'>
          <div>
            <button
              onClick={() => router.push("/")}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4'>
              Home
            </button>
            <button
              onClick={() => router.push("/admin")}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Back to Dashboard
            </button>
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'>
            {showCompleted
              ? "Show Active Inquiries"
              : "Show Completed Inquiries"}
          </button>
        </div>

        <div className='grid gap-4'>
          {(showCompleted ? completedMessages : messages).map((message) => (
            <div
              key={message.id}
              className='bg-white p-6 rounded-lg shadow flex justify-between items-start'>
              <div className='flex-1'>
                <div>
                  <span className='font-semibold text-black'>Name: </span>
                  <span className='font-bold text-gray-600 text-lg'>
                    {message.name}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-black'>Email: </span>
                  <span className='text-gray-600'>{message.email}</span>
                </div>
                <div className='mt-2'>
                  <span className='font-semibold text-black'>Message: </span>
                  <span className='text-gray-800'>{message.message}</span>
                </div>
              </div>

              {showCompleted && (
                <button
                  onClick={() => handleMarkActive(message)}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                  Make Active
                </button>
              )}
              {showCompleted && (
                <button
                  onClick={() => handleDeleteInquiry(message)}
                  className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-4'>
                  Delete
                </button>
              )}

              {!showCompleted && (
                <button
                  onClick={() => handleMarkCompleted(message)}
                  className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4'>
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className='absolute bottom-6 right-6 px-4 py-2 bg-red-500 text-white rounded-full'>
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
