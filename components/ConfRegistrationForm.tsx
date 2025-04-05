import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";

const ConfRegistration = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    email: "",
    phone: "",
    level: "",
    institution: "",
    transport: "",
    transportDetails: "",
    participating: "",
    abstract: "",
    housing: "",
    hotelDetails: "",
    conferenceWish: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const docRef = await addDoc(collection(db, "conference-registrations"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      console.log("Registration submitted with ID: ", docRef.id);
      setSuccess(true);
      setFormData({
        name: "",
        state: "",
        email: "",
        phone: "",
        level: "",
        institution: "",
        transport: "",
        transportDetails: "",
        participating: "",
        abstract: "",
        housing: "",
        hotelDetails: "",
        conferenceWish: "",
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">Register for Conference</h1>
        <h2 className="text-lg text-black mb-4">Conference Details: July 12–13, Friday 5:00 PM – Sunday 12:00 PM, San Antonio AUM Ashram</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Institution or Practice", name: "institution", type: "text" },
          { label: "Hotel Details and Discount Code", name: "hotelDetails", type: "text", condition: formData.housing === "No" },
          { label: "Flight Details", name: "transportDetails", type: "text", condition: formData.transport === "Flying" },
        ].map((field) =>
          field.condition === false ? null : (
            <div key={field.name}>
              <label htmlFor={field.name} className="block font-semibold mb-1">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required={!["hotelDetails", "transportDetails"].includes(field.name)}
              />
            </div>
          )
        )}

        {/* Dropdowns and Textareas */}
        <div>
          <label className="block font-semibold mb-1">Level of Training</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select...</option>
            <option>Pre-med</option>
            <option>Current medical student</option>
            <option>Residency</option>
            <option>Practicing professional</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Method of Transport</label>
          <select
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select...</option>
            <option>Driving</option>
            <option>Flying</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Are you participating in oral presentation competition?</label>
          <select
            name="participating"
            value={formData.participating}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {formData.participating === "Yes" && (
          <div>
            <label className="block font-semibold mb-1">Submit 350-word Abstract</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Are you comfortable staying at HMSA volunteer’s house?</label>
          <select
            name="housing"
            value={formData.housing}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">What would you like to see at the conference?</label>
          <textarea
            name="conferenceWish"
            value={formData.conferenceWish}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="text-red-600 font-medium">{error}</div>
        )}
        {success && (
          <div className="text-green-600 font-medium">
            Your registration was submitted successfully!
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfRegistration;
