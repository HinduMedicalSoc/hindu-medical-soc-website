"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure you've imported your Firestore instance
import { Timestamp } from "firebase/firestore"; // Import Timestamp type
import EventCard from "@/components/EventCard"; // Import the existing EventCard component

// Add type definition for Event
type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
};

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
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
          date: (data.date as unknown as Timestamp)
            .toDate()
            .toLocaleDateString("en-US", {
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
      <div className="relative min-h-screen p-4">
        {/* Title centered horizontally */}
        <h1 className="text-4xl font-bold mb-8 text-center">Manage Events</h1>

        {/* Events Section */}
        <section id="events" className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Removed the Events title */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    description={event.description}
                    imageUrl={event.imageUrl}
                  />
                ))
              ) : (
                <p>No events found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 right-6 px-6 py-3 text-lg font-medium text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
