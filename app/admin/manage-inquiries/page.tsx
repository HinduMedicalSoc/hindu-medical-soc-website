"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { getDocs, collection } from "firebase/firestore";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
};

export default function ManageInquiries() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
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

    fetchMessages();
  }, []);

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

        <div className='flex justify-start mb-8'>
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

        <div className='grid gap-4'>
          {messages.map((message) => (
            <div key={message.id} className='bg-white p-6 rounded-lg shadow'>
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
