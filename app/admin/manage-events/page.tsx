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
  updateDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import ModifiableEventCard from "@/components/ModifiableEventCard";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const router = useRouter();

  // Fetch events and format the date
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));

      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Event, "id">;
        return {
          id: doc.id,
          title: data.title,
          location: data.location,
          description: data.description,
          imageUrl: data.imageUrl,
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
      });
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const handleModify = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (eventId: string) => {
    // For now, just log. Later will integrate with DB
    console.log("Deleting event:", eventId);
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
        imageUrl: selectedEvent.imageUrl,
      });
      console.log("Modified event:", selectedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsModalOpen(false);
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

  return (
    <AuthGuard>
      <div className='relative min-h-screen p-4'>
        <h1 className='text-4xl font-bold mb-8 text-center'>Manage Events</h1>

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
                    onDelete={() => handleDelete(event.id)}
                  />
                ))
              ) : (
                <p className='text-black'>No events found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Simple Modal */}
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
                    type='text'
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
                    className='w-full p-2 border rounded'
                    rows={3}
                  />
                </div>

                <div>
                    <label className='block text-sm font-medium mb-1'>Upload Image</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && storage) {
                                console.log("Selected file:", file); // Placeholder to confirm file selection
                                
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

        <button
          onClick={handleLogout}
          className='absolute bottom-6 right-6 px-6 py-3 text-lg font-medium text-white bg-red-500 rounded hover:bg-red-600'>
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
