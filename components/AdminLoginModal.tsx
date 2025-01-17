import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/app/auth/AuthContext";

interface AdminLoginModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

export default function AdminLoginModal({
  isModalOpen,
  closeModal,
}: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeModal();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, username, password);
      setErrorMessage("");
      closeModal();
      console.log("Logged in:", username, password);
      router.push("/admin");
    } catch (error) {
      setErrorMessage("Invalid email or password.");
      console.error(error);
    }
  };

  if (!isModalOpen) return null;
  if (user) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-6 rounded shadow-lg w-full max-w-sm'>
          <h2 className='text-xl font-bold mb-4'>Admin Settings</h2>
          <p className='mb-4 text-black'>Logged in as: {user.email}</p>
          <div className='flex justify-end'>
            <button
              onClick={closeModal}
              className='mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300'>
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600'>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded shadow-lg w-full max-w-sm'>
        <h2 className='text-xl font-bold mb-4'>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              type='text'
              id='username'
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Show error message if login fails */}
          {errorMessage && (
            <div className='text-red-500 text-sm mb-4'>{errorMessage}</div>
          )}

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={closeModal}
              className='mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600'>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

//export default AdminLoginModal;
