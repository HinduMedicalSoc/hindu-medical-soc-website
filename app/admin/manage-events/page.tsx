"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import {
  getDocs,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import ModifiableEventCard from "@/components/ModifiableEventCard";

type Event = {
  id: string;
  title: string;
  date: string | Timestamp;
  location: string;
  description: string;
  imageUrl: string;
};

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [file, setFile] = useState(new File([], "@/public/hmsa.png"));
  // const [defaultImage, setDefaultImage] = useState("/hmsa.png");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [confirmedEventId, setConfirmedEventId] = useState<string>("");

  // Fetch events and format the date

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));

      const querySnapshot = await getDocs(q);
      const eventsList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data() as Omit<Event, "id">;

          let imageBuff = "";

          try {
            imageBuff = await fetchImageFromDrive(data.imageUrl);
          } catch (error) {
            console.error("Error fetching image:", error);
          }

          return {
            id: doc.id,
            title: data.title,
            location: data.location,
            description: data.description,
            imageUrl: imageBuff, // Now imageBuff is correctly set
            date:
              data.date instanceof Timestamp
                ? data.date.toDate().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(data.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
          };
        })
      );
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const fetchImageFromDrive = async (fileId: string) => {
    try {
      const response = await fetch(`/api/download-image?fileId=${fileId}`);

      const blob = await response.blob();
      const arr_buffer = await blob.arrayBuffer();

      return Buffer.from(arr_buffer).toString("base64");
    } catch (error) {
      console.error("Error fetching image from Drive:", error);
      return "";
    }
  };

  const handleModify = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  //handleDelete function to delete the event from firestore
  const handleDelete = async (eventId: string) => {
    if (!eventId) {
      if (process.env.NODE_ENV === "development") {
        throw new Error("No event id (handleDelete)");
      }
      return;
    }
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleSubmitModification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const docRef = doc(db, "events", selectedEvent.id);
      const parsedDate = new Date(selectedEvent.date as string);
      await updateDoc(docRef, {
        title: selectedEvent.title,
        date: Timestamp.fromDate(parsedDate),
        location: selectedEvent.location,
        description: selectedEvent.description,
      });

      // Upload the image if selected and get the Google Drive file ID
      if (file) {
        const driveFileId = await uploadImageToDrive(file);
        await updateDoc(docRef, {
          imageUrl: driveFileId, // This is the Google Drive file ID
        });
      }

      console.log("Modified event:", selectedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  //handleSubmitCreation function to create a new event, upload the image to Google Drive, and save the event to Firestore
  const handleSubmitCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent || !file) return;

    setIsLoading(true);

    try {
      // Upload the image to Google Drive
      const driveFileId = await uploadImageToDrive(file);

      // Save the event to Firestore
      const eventsRef = collection(db, "events");
      const parsedDate = new Date(selectedEvent.date as string);
      await addDoc(eventsRef, {
        title: selectedEvent.title,
        date: Timestamp.fromDate(parsedDate),
        location: selectedEvent.location,
        description: selectedEvent.description,
        imageUrl: driveFileId, // This is the Google Drive file ID
      });

      console.log("Created event:", selectedEvent);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
      setCreateEventOpen(false);
    }
  };

  const uploadImageToDrive = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return data.fileId;
    } else {
      throw new Error("Failed to upload image to Drive");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const createNewEvent = () => {
    setSelectedEvent({
      id: "",
      title: "",
      date: "",
      location: "",
      description: "",
      imageUrl: "",
    });
    setCreateEventOpen(true);
  };

  // console.log("Deleting event with id:", id);
  function handleConfirmDelete(id: string): void {
    setConfirmedEventId(id);
    setAreYouSure(true);
  }
  const maxLength = 76;
  const remainingChars = maxLength - (selectedEvent?.description?.length || 0);
  return (
    <AuthGuard>
      <div className='relative min-h-screen p-4'>
        <h1 className='text-4xl font-bold mb-8 text-center'>Manage Events</h1>
        <div className='flex justify-between mb-8'>
          <div className='space-x-4'>
            <button
              onClick={() => router.push("/")}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
              Home
            </button>
            <button
              onClick={() => router.push("/admin")}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600'>
              Back to Dashboard
            </button>
            <button
              onClick={() => createNewEvent()}
              className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'>
              Add Event
            </button>
          </div>
        </div>

        <section id='events' className='py-12 bg-gray-100'>
          <div className='container mx-auto px-4 max-w-7xl'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {events.length > 0 ? (
                events.map((event) => (
                  <ModifiableEventCard
                    key={event.id}
                    {...event}
                    date={
                      event.date instanceof Timestamp
                        ? event.date.toDate().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : event.date
                    }
                    onModify={() => handleModify(event)}
                    onDelete={() => handleConfirmDelete(event.id)}
                  />
                ))
              ) : (
                <p className='text-black'>No events found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Event Modification Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 text-black rounded-lg w-full max-w-md mx-4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>Modify Event</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-gray-500 hover:text-gray-700'>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitModification} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Title
                  </label>
                  <input
                    type='text'
                    value={selectedEvent?.title || ""}
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>Date</label>
                  <input
                    type='date'
                    value={
                      selectedEvent?.date instanceof Timestamp
                        ? selectedEvent.date.toDate().toISOString().split('T')[0]
                        : selectedEvent?.date
                        ? new Date(selectedEvent.date).toISOString().split('T')[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, date: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Location
                  </label>
                  <input
                    type='text'
                    value={selectedEvent?.location || ""}
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, location: e.target.value } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Description
                  </label>
                  <textarea
                    value={selectedEvent?.description || ""}
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    maxLength={maxLength}
                    className='w-full p-2 border rounded'
                    rows={3}
                  />
                  <p
                    className={`text-sm ${
                      remainingChars === 0 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {remainingChars} characters remaining
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Upload Image
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFile(file);
                      }
                    }}
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div className='flex justify-end space-x-2 mt-6'>
                  <button
                    type='button'
                    onClick={() => setIsModalOpen(false)}
                    className='px-4 py-2 text-gray-600 hover:text-gray-800'>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Creating a new Event */}
        {createEventOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 text-black rounded-lg w-full max-w-md mx-4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>Create Event</h2>
                <button
                  onClick={() => setCreateEventOpen(false)}
                  className='text-gray-500 hover:text-gray-700'>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitCreation} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Title <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    required
                    value={selectedEvent?.title || ""}
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                  {selectedEvent && !selectedEvent.title && (
                    <p className='text-red-500 text-sm mt-1'>Title is required</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Date <span className='text-red-500'>*</span> 
                  </label>
                  <input
                    type='date'
                    required
                    value={
                      selectedEvent?.date instanceof Timestamp
                        ? selectedEvent.date
                            .toDate()
                            .toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                        : selectedEvent?.date || ""
                    }
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, date: e.target.value } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                  {selectedEvent && !selectedEvent.date && (
                    <p className='text-red-500 text-sm mt-1'>Date is required</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Location <span className='text-red-500'>*</span> 
                  </label>
                  <input
                    type='text'
                    required
                    value={selectedEvent?.location || ""}
                    onChange={(e) =>
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, location: e.target.value } : null
                      )
                    }
                    className='w-full p-2 border rounded'
                  />
                  {selectedEvent && !selectedEvent.location && (
                    <p className='text-red-500 text-sm mt-1'>Location is required</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Description
                  </label>
                  <textarea
                    value={selectedEvent?.description || ""}
                    onChange={(e) => {
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      );
                    }}
                    maxLength={maxLength} 
                    className='w-full p-2 border rounded'
                    rows={3}
                  />
                  <p
                    className={`text-sm ${
                      remainingChars === 0 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {remainingChars} characters remaining
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Upload Image <span className='text-red-500'>*</span> 
                  </label>
                  <input
                    type='file'
                    required
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFile(file);
                      }
                    }}
                    className='w-full p-2 border rounded'
                  />
                  {selectedEvent && !file && (
                    <p className='text-red-500 text-sm mt-1'>File is required</p>
                  )}
                </div>

                <div className='flex justify-end space-x-2 mt-6'>
                  <button
                    type='button'
                    onClick={() => setCreateEventOpen(false)}
                    className='px-4 py-2 text-gray-600 hover:text-gray-800 border rounded border-gray-300'>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for confiming if admins want to delete an event */}

        {areYouSure && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 text-black rounded-lg w-full max-w-md mx-4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>Are you sure?</h2>
                <button
                  onClick={() => setAreYouSure(false)}
                  className='text-gray-500 hover:text-gray-700'>
                  ✕
                </button>
              </div>

              <div className='flex justify-end space-x-2 mt-6'>
                <button
                  type='button'
                  onClick={() => setAreYouSure(false)}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800 border rounded border-gray-300'>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(confirmedEventId);
                    setAreYouSure(false);
                  }}
                  className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className='absolute bottom-6 right-6 px-4 py-2 bg-red-500 text-white rounded-full'>
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
