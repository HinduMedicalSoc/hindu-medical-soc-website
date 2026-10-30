'use client';
import React from "react";
import Header from "../components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";
import AnimatedAboutUs from "../components/AnimatedAboutUs";
import EventCard from "../components/EventCard";
import SmoothScroll from "@/components/SmoothScroll";
import AdminLoginModal from "../components/AdminLoginModal";
import { Mail, Clock, Video, ExternalLink, X, Instagram } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import InquiryForm from "../components/InquiryForm";
import Link from 'next/link';

// Add type definition
type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  link?: string;
};

// Comprehensive events backfilled from @hindumedicalsoc Instagram
const BACKFILLED_EVENTS: Event[] = [
  {
    id: "milan-biweekly",
    title: "HMSA Milan: Biweekly Meetings",
    date: "1st Mon (9-10 PM EST) & 3rd Sun (8-9 PM EST)",
    location: "Virtual (Zoom)",
    description:
      "Interactive twice-monthly virtual gatherings featuring yoga, community games, and discussions on Hindu Medical topics with healthcare students and professionals nationwide.",
    imageUrl: "/milan.jpg",
    link: "https://tx.ag/HMSAMilan",
  },
  {
    id: "svasthya-conference-2025",
    title: "Svasthya: HMSA National Conference 2025",
    date: "July 11 – 13, 2025",
    location: "AUM Ashram, San Antonio, TX",
    description:
      "Inaugural national conference bringing together attendees across 9 states with keynote by TMA President Dr. Jayesh Shah, Dr. Hetal Nayak, research presentations, and sewa activities.",
    imageUrl: "/conference-hero2.jpg",
    link: "/conference",
  },
  {
    id: "svasthya-journal-call",
    title: "Svasthya Journal: Call for Papers",
    date: "May 31, 2025",
    location: "Online Publication",
    description:
      "Open call for student, resident, and physician submissions exploring healthcare, ancient wisdom, and modern medicine through a Dharmic lens.",
    imageUrl: "/book2.png",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSciHFnECoF29AUQBEsHC_RWcCVlYCJsnKm7GPUwTWBD_WqRsA/viewform",
  },
  {
    id: "hmsa-mentorship-panel-2025",
    title: "HMSA Healthcare Mentorship Panel",
    date: "May 4, 2025",
    location: "Virtual (Zoom)",
    description:
      "Annual mentorship panel connecting pre-med and medical students with resident, fellow, and attending physician mentors across multiple clinical specialties.",
    imageUrl: "/networking_pillar.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "systematic-lit-review-workshop",
    title: "Workshop: Systematic Literature Reviews",
    date: "February 16, 2025",
    location: "Virtual (Zoom)",
    description:
      "HMSA Research Pillar workshop teaching students rigorous methodologies for literature searches, PRISMA standards, and drafting peer-reviewed manuscripts.",
    imageUrl: "/research_pillar.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "sevankur-clinical-immersion",
    title: "Clinical Immersion with Sevankur Bharat",
    date: "December 2024 – January 2025",
    location: "Maharashtra & Gujarat, India",
    description:
      "Global clinical immersion partnership providing healthcare students rotations through multispecialty hospitals, rural health camps, and cultural exchange.",
    imageUrl: "/sewa_pillar.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "jc-nanomedicine-ayurveda",
    title: "Journal Club: Nanomedicine & Ayurveda",
    date: "December 8, 2024",
    location: "Virtual (Zoom)",
    description:
      "Educational session evaluating modern nanomedicine drug delivery systems and their novel pharmacological applications for Ayurvedic medicine.",
    imageUrl: "/research_pillar.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "seva-medicine-dr-patil",
    title: "Seva & Medicine with Dr. Kiran Patil",
    date: "November 17, 2024",
    location: "Virtual (Zoom)",
    description:
      "Inspirational talk with Dr. Kiran Patil on integrating selfless service (sewa) into medical training, compassion in patient care, and outreach initiatives.",
    imageUrl: "/Event2.jpg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "jc-lifestyle-med-vedic",
    title: "Journal Club: Lifestyle Medicine & Vedic Philosophy",
    date: "October 20, 2024",
    location: "Virtual (Zoom)",
    description:
      "Discussion analyzing the modern rise of Lifestyle Medicine alongside traditional Vedic medical philosophy and holistic preventive healthcare.",
    imageUrl: "/education_pillar.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "yoga-in-medicine-dr-nayak",
    title: "Integrating Yoga into Medicine",
    date: "August 28, 2024",
    location: "Virtual (Zoom)",
    description:
      "Special presentation by Dr. Hetal Nayak exploring Yoga as Medicine and how Raja, Jnana, Karma, and Bhakti yoga frameworks intersect with clinical care.",
    imageUrl: "/Event1.jpeg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "intro-to-hmsa-july-2024",
    title: "Introduction to HMSA",
    date: "July 25, 2024",
    location: "Virtual (Zoom)",
    description:
      "National webinar outlining the founding vision, mission, and four core pillars (Networking, Education, Sewa, and Research) of the society.",
    imageUrl: "/Event3.jpg",
    link: "https://www.instagram.com/hindumedicalsoc/",
  },
  {
    id: "milan-anandibai-joshi",
    title: "HMSA Milan: Dr. Anandibai Joshi Spotlight",
    date: "June 16, 2024",
    location: "Virtual (Zoom)",
    description:
      "Virtual Milan session honoring the legacy of Dr. Anandibai Joshi, the first Indian Hindu woman to earn a Western medical degree, and her trailblazing journey.",
    imageUrl: "/milan.jpg",
    link: "https://tx.ag/HMSAMilan",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    console.log("Modal opened");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  const [events, setEvents] = useState<Event[]>(BACKFILLED_EVENTS);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, orderBy("date", "desc"));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const firestoreEvents: Event[] = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();

              let dateStr = "";
              if (data.date && typeof (data.date as Timestamp).toDate === "function") {
                dateStr = (data.date as Timestamp).toDate().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              } else if (data.date) {
                dateStr = new Date(data.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              }

              let imageBuff = "";
              if (data.imageUrl) {
                if (data.imageUrl.startsWith("/") || data.imageUrl.startsWith("http")) {
                  imageBuff = data.imageUrl;
                } else {
                  try {
                    imageBuff = await fetchImageFromDrive(data.imageUrl);
                  } catch (error) {
                    console.error("Error fetching image from Drive:", error);
                  }
                }
              }

              // Fallback image if Drive did not return data
              if (!imageBuff) {
                const titleLower = (data.title || "").toLowerCase();
                if (titleLower.includes("seva")) imageBuff = "/Event2.jpg";
                else if (titleLower.includes("yoga")) imageBuff = "/Event1.jpeg";
                else if (titleLower.includes("intro")) imageBuff = "/Event3.jpg";
                else imageBuff = "/hmsa.png";
              }

              return {
                id: docSnap.id,
                title: data.title || "HMSA Event",
                location: data.location || "Virtual",
                description: data.description || "",
                imageUrl: imageBuff,
                date: dateStr || "Date TBA",
                link: data.link || "https://www.instagram.com/hindumedicalsoc/",
              };
            })
          );

          // Merge: prioritize any Firestore documents, keeping non-duplicated backfilled events
          setEvents(() => {
            const merged = [...firestoreEvents];
            const firestoreTitles = new Set(
              firestoreEvents.map((e) => e.title.toLowerCase().trim())
            );
            for (const b of BACKFILLED_EVENTS) {
              if (!firestoreTitles.has(b.title.toLowerCase().trim())) {
                merged.push(b);
              }
            }
            return merged;
          });
        }
      } catch (error) {
        console.error("Error fetching events from Firestore:", error);
      }
    };

    fetchEvents();
  }, []);

  const fetchImageFromDrive = async (fileId: string) => {
    try {
      const response = await fetch(`/api/download-image?fileId=${fileId}`);
      if (!response.ok) return "";
      const blob = await response.blob();
      const arr_buffer = await blob.arrayBuffer();

      return Buffer.from(arr_buffer).toString("base64");
    } catch (error) {
      console.error("Error fetching image from Drive:", error);
      return "";
    }
  };

  return (
    <div className='min-h-screen'>
      <SmoothScroll />
      <Header/>
      <main>
      
        <section
          id='home'
          className='min-h-screen flex flex-col items-center justify-center text-white px-4 py-8 pt-24 sm:pt-28'>
          <div className='container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12'>
            {/* Left Column: Logo */}
            <div className='w-full lg:w-1/2 flex justify-center'>
              <div className='relative w-64 h-64 xs:w-80 xs:h-80 sm:w-96 sm:h-96 lg:w-[540px] lg:h-[540px]'>
                <Image
                  src='/hmsa.png'
                  alt='HMSA Logo'
                  fill
                  style={{ objectFit: "contain" }}
                  className='rounded-lg drop-shadow-2xl'
                  priority
                />
              </div>
            </div>

            {/* Right Column: Welcome to HMSA + Pillars Image + HMSA Milan Biweekly Card */}
            <div className='w-full lg:w-1/2 text-center lg:text-left'>
              <h2 className='text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white text-center lg:text-left'>
                Welcome to HMSA
              </h2>
              
              {/* Pillars image below Welcome to HMSA */}
              <div className='w-full flex justify-center lg:justify-start mb-6'>
                <div className='relative w-full h-28 xs:h-32 sm:h-40 max-w-[600px]'>
                  <Image
                    src='/pillars2.png'
                    alt='HMSA Pillars: Networking, Education, Sewa, Research'
                    fill
                    style={{ objectFit: "contain" }}
                    className='rounded-lg'
                    priority
                  />
                </div>
              </div>

              {/* HMSA Milan Biweekly Feature - Refined Editorial Architecture */}
              <div className='w-full max-w-[620px] mx-auto lg:mx-0 bg-white/[0.04] border-l-2 border-amber-500/90 border-y border-r border-white/10 rounded-sm sm:rounded-r-md p-5 sm:p-6 text-left shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]'>
                <div className='flex flex-col sm:flex-row items-start gap-5'>
                  {/* Clickable Flyer Thumbnail - Editorial Document Style */}
                  <div className='flex flex-col items-center flex-shrink-0 mx-auto sm:mx-0'>
                    <div
                      onClick={() => setIsFlyerModalOpen(true)}
                      className='relative w-32 h-44 sm:w-36 sm:h-48 rounded-sm overflow-hidden shadow-2xl border border-white/20 cursor-pointer group bg-slate-900'
                      title='Click to expand full flyer & scan QR'
                    >
                      <Image
                        src='/milan.jpg'
                        alt='HMSA Milan Biweekly Meetings Flyer'
                        fill
                        className='object-cover group-hover:scale-105 transition duration-500 ease-out'
                      />
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-xs font-semibold text-white'>
                        <span>Expand Flyer</span>
                        <span className='text-[10px] text-amber-200 mt-1'>View QR & Details</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFlyerModalOpen(true)}
                      className='text-[11px] text-amber-200/90 hover:text-amber-100 font-medium mt-2 transition inline-flex items-center gap-1'
                    >
                      <span>View Full Flyer</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>

                  {/* Milan Meeting Information */}
                  <div className='flex-1 flex flex-col justify-between text-white w-full'>
                    <div>
                      {/* Eyebrow - Clean Typographic Header */}
                      <div className='flex items-center gap-2 mb-1.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-amber-400'></span>
                        <span className='text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400'>
                          Community Program · Biweekly
                        </span>
                      </div>

                      <h3 className='text-2xl sm:text-3xl font-bold text-white tracking-tight'>
                        HMSA Milan
                      </h3>
                      <p className='text-xs sm:text-sm text-slate-300 mt-1.5 mb-3.5 leading-relaxed'>
                        Twice-monthly virtual gatherings featuring <span className='text-white font-medium'>Yoga</span>, <span className='text-white font-medium'>interactive games</span>, and <span className='text-white font-medium'>discussions on Hindu medical topics</span> with healthcare trainees and physicians nationwide.
                      </p>

                      {/* Editorial Schedule Divider */}
                      <div className='border-y border-white/10 py-2.5 my-3 space-y-1.5 text-xs'>
                        <div className='flex items-center justify-between sm:justify-start gap-3 text-slate-300'>
                          <span className='font-semibold text-amber-300 w-28 flex-shrink-0'>1st Monday</span>
                          <span className='text-slate-200'>9:00 – 10:00 PM EST</span>
                        </div>
                        <div className='flex items-center justify-between sm:justify-start gap-3 text-slate-300'>
                          <span className='font-semibold text-amber-300 w-28 flex-shrink-0'>3rd Sunday</span>
                          <span className='text-slate-200'>8:00 – 9:00 PM EST</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className='flex flex-wrap items-center gap-2.5 pt-1'>
                      <a
                        href='https://tx.ag/HMSAMilan'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-md transition duration-200 shadow-md inline-flex items-center gap-2'
                      >
                        <Video size={14} />
                        <span>Join Zoom</span>
                        <ExternalLink size={12} className='opacity-70' />
                      </a>
                      <span className='text-[11px] text-slate-400 hidden sm:inline'>
                        Free & open to all healthcare students & professionals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </section>

        <section id='about' className='py-8 bg-gray-100'>
          <div className='container mx-auto px-4 max-w-7xl'>
            <AnimatedAboutUs />
          </div>
        </section>

        <section id='events' className='py-12 bg-gray-100'>
          <div className='container mx-auto px-4 max-w-7xl'>
            <div className='flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4'>
              <div>
                <h2 className='text-4xl xs:text-5xl lg:text-6xl font-bold text-left text-hmsa-blue'>
                  Events
                </h2>
                <p className='text-sm sm:text-base text-gray-600 mt-2 text-left'>
                  Explore upcoming and past gatherings, webinars, journal clubs, and conferences.
                </p>
              </div>
              <a
                href='https://www.instagram.com/hindumedicalsoc/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white text-hmsa-blue hover:text-blue-800 border border-gray-300 px-4 py-2.5 rounded-full shadow-sm hover:shadow transition self-start md:self-auto'
              >
                <Instagram size={16} className='text-pink-600' />
                <span>Follow @hindumedicalsoc for event updates</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  link={event.link}
                />
              ))}
            </div>
          </div>
        </section>

        <section id='join' className='bg-hmsa-blue py-8'>
          <div className='container mx-auto px-4 max-w-7xl'>
            <div className='flex flex-col md:flex-row items-start justify-between'>
              <div className='text-white md:w-2/3 pr-0 md:pr-8'>
                <h2 className='text-4xl xs:text-5xl lg:text-6xl font-bold mb-4 text-left'>
                  Join Our Community
                </h2>
                <p className='text-xl sm:text-2xl mb-6 text-left'>
                  Become a part of the Hindu Medical Society of America and
                  contribute to our mission of integrating Hindu principles with
                  modern medicine.
                </p>
                <a
                  href='https://forms.gle/W6zBeMVQzswTN1CK8'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-block pr-5'>
                  <button className='bg-white text-hmsa-blue font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300'>
                    Join HMSA
                  </button>
                </a>

                <button
                  className='bg-white text-hmsa-blue font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300'
                  onClick={() => setIsInquiryOpen(true)}>
                  Contact us
                </button>
                {isInquiryOpen && (
                  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <InquiryForm onClose={() => setIsInquiryOpen(false)} />
                  </div>
                )}
              </div>
              <div className='md:w-1/3 mt-8 md:mt-0 flex flex-col items-center justify-center md:justify-end'>
                <Image
                  src='/hmsa.png'
                  alt='HMSA Logo'
                  width={200}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
                <button
                  onClick={openModal}
                  className='bg-white text-hmsa-blue font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300'>
                  Admin Login
                </button>

                {/* Render the AdminLoginModal and pass the modal state */}
                <AdminLoginModal
                  isModalOpen={isModalOpen}
                  closeModal={closeModal}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Milan Flyer Modal Popup */}
      {isFlyerModalOpen && (
        <div
          className='fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4'
          onClick={() => setIsFlyerModalOpen(false)}
        >
          <div
            className='relative bg-white rounded-lg max-w-md w-full p-6 shadow-2xl text-slate-900 border border-slate-200'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFlyerModalOpen(false)}
              aria-label='Close flyer modal'
              className='absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md w-7 h-7 flex items-center justify-center text-sm font-bold transition'
            >
              <X size={16} />
            </button>

            <div className='relative w-full aspect-[4/5] rounded-md overflow-hidden mb-4 border border-slate-200 shadow-sm bg-[#faf8f5]'>
              <Image
                src='/milan.jpg'
                alt='Introducing HMSA Milan Flyer'
                fill
                className='object-contain'
              />
            </div>

            <div className='text-left'>
              <div className='text-[10px] font-bold tracking-widest text-amber-700 uppercase mb-0.5'>
                Official Program Notice
              </div>
              <h3 className='text-xl font-bold text-[#00192F] mb-1.5'>Introducing HMSA Milan</h3>
              
              <div className='border-y border-gray-200 py-2.5 my-2.5 text-xs text-gray-700 space-y-1'>
                <p><span className='font-semibold text-[#00192F]'>1st Monday:</span> 9:00 – 10:00 PM EST</p>
                <p><span className='font-semibold text-[#00192F]'>3rd Sunday:</span> 8:00 – 9:00 PM EST</p>
                <p className='text-gray-500 text-[11px] pt-0.5'>Yoga · Fellowship · Discussions on Hindu Medical Topics</p>
              </div>

              <a
                href='https://tx.ag/HMSAMilan'
                target='_blank'
                rel='noopener noreferrer'
                className='w-full inline-flex items-center justify-center gap-2 bg-[#00192F] hover:bg-blue-950 text-white font-semibold py-2.5 px-5 rounded-md transition shadow-sm text-sm mt-1'
              >
                <Video size={15} />
                <span>Join on Zoom</span>
                <ExternalLink size={13} className='opacity-70' />
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className='bg-hmsa-blue py-4 text-center text-white'>
        <div className='container mx-auto px-4'>
          <p className='mb-2 text-sm sm:text-base'>
            &copy; 2024 Hindu Medical Society of America. All rights reserved.
          </p>
          <div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2'>
            <a
              href='mailto:hindumedicalsoc@gmail.com'
              className='hover:text-gray-300 flex items-center text-sm sm:text-base'>
              <Mail size={16} className='mr-1' />
              <span>hindumedicalsoc@gmail.com</span>
            </a>
            <a
              href='https://www.instagram.com/hindumedicalsoc/?igsh=MWoya3E5aG5icHR5OQ%3D%3D'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-gray-300 flex items-center text-sm sm:text-base'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2 sm:w-9 sm:h-9'>
                <rect x='2' y='2' width='20' height='20' rx='5' ry='5'></rect>
                <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
                <line x1='17.5' y1='6.5' x2='17.51' y2='6.5'></line>
              </svg>
              <span>@hindumedicalsoc</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
