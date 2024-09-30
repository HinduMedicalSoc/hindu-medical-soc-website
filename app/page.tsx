import React from "react";
import Header from "../components/Header";
import Image from "next/image";
import AnimatedAboutUs from "../components/AnimatedAboutUs"; // Import the new animated component
import EventCard from "../components/EventCard"; // We'll create this component
import SmoothScroll from "@/components/SmoothScroll";
import { Mail } from "lucide-react";

export default function Home() {
  const events = [
    {
      title: "Seva & Medicine",
      date: "April 18th, 2024",
      location: "Online",
      description:
        "Talk on Seva & Medicine with Dr. Kiran Patil. RSVP to receive the Zoom Link.",
      imageUrl: "/Event2.jpg",
    },
    {
      title: "Intro to HMSA",
      date: "July 25th, 2024",
      location: "Online",
      description: "Introduction to Hindu Medical Society of America.",
      imageUrl: "/Event3.jpg",
    },
    {
      title: "Integrating Yoga into Medicine",
      date: "August 28th, 2024",
      location: "Online",
      description: "Talk by Dr. Hetal Nayak about Yoga in Medicine.",
      imageUrl: "/Event1.jpeg",
    },
  ];

  return (
    <div className="min-h-screen">
      <SmoothScroll />
      <Header />
      <main>
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-8"
        >
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 xs:w-80 xs:h-80 sm:w-96 sm:h-96 lg:w-[570px] lg:h-[570px]">
                <Image
                  src="/hmsa.png"
                  alt="HMSA Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Welcome to HMSA
              </h2>
              <p className="text-base xs:text-lg sm:text-xl mb-8 mx-auto lg:mx-0 max-w-md">
                Dedicated to fostering excellence in healthcare, promoting
                cultural awareness, and serving communities through the
                integration of Hindu principles and modern medicine.
              </p>
              <div className="w-full flex justify-center lg:justify-start">
                <div className="relative w-full h-32 sm:h-40 max-w-[600px]">
                  <Image
                    src="/pillars2.png"
                    alt="Additional HMSA Image"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSe7j8RxBEfCMUbCSIXedomNt7c0M3B3vNZtNGApyEqiS8eP_g/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <button className="w-full bg-gray-200 bg-opacity-90 text-gray-700 hover:text-gray-900 font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg text-xl sm:text-2xl">
                Get Involved 🩺
              </button>
            </a>
            <a
              href="https://www.instagram.com/hindumedicalsoc/?igsh=MWoya3E5aG5icHR5OQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg flex items-center justify-center text-xl sm:text-2xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 sm:w-9 sm:h-9"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              @hindumedicalsoc
            </a>
          </div>
        </section>

        <section id="about" className="py-8 bg-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <AnimatedAboutUs />
          </div>
        </section>

        <section id="events" className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-4xl xs:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 text-left text-hmsa-blue">
              Events 🗓️
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  imageUrl={event.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="bg-hmsa-blue py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="text-white md:w-2/3 pr-0 md:pr-8">
                <h2 className="text-4xl xs:text-5xl lg:text-6xl font-bold mb-4 text-left">
                  Join Our Community
                </h2>
                <p className="text-xl sm:text-2xl mb-6 text-left">
                  Become a part of the Hindu Medical Society of America and
                  contribute to our mission of integrating Hindu principles with
                  modern medicine.
                </p>
                <a
                  href="https://forms.gle/W6zBeMVQzswTN1CK8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <button className="bg-white text-hmsa-blue font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300">
                    Join HMSA
                  </button>
                </a>
              </div>
              <div className="md:w-1/3 mt-8 md:mt-0 flex items-center justify-center md:justify-end">
                <Image
                  src="/hmsa.png"
                  alt="HMSA Logo"
                  width={200}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-hmsa-blue py-4 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-sm sm:text-base">
            &copy; 2024 Hindu Medical Society of America. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
            <a
              href="mailto:hindumedicalsoc@gmail.com"
              className="hover:text-gray-300 flex items-center text-sm sm:text-base"
            >
              <Mail size={16} className="mr-1" />
              <span>hindumedicalsoc@gmail.com</span>
            </a>
            <a
              href="https://www.instagram.com/hindumedicalsoc/?igsh=MWoya3E5aG5icHR5OQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 flex items-center text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 sm:w-9 sm:h-9"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@hindumedicalsoc</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
