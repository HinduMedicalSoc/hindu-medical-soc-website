'use client';
import React from "react";
import Header from "@/components/Header";
import Image from "next/image";

export default function Conference() {
  // Updated conference data with actual details
  const conferenceData = {
    title: "Svasthya",
    subtitle: "A Dharmic Approach to Healthcare",
    heroImage: "/conference-hero2.jpg", 
    location: "Aum Ashram, San Antonio TX",
    date: "July 11-13, 2025",
    description: "The Hindu Medical Society of America (HMSA) successfully held its inaugural National Conference, Svasthya, bringing together 46 attendees from 9 states including pre-medical students, medical and podiatry school students, physicians, nurse practitioners, Ayurvedic doctors, and yoga therapists for a weekend of fruitful discussion and inspiring interactions.",
    
    // Photo gallery with updated content based on actual conference
    photoSections: [
      {
        image: "/conf-photo1.jpeg",
        title: "Opening Ceremony & Inaugural Address",
        description: "The conference began with the inaugural address by Dr. Hetal Nayak, director of Aum Yoga Sadhana School, who set the stage for the weekend by discussing the union of traditional Hindu knowledge with modern medicine.",
        position: "left"
      },
      {
        image: "/conf-photo2.jpg", 
        title: "Keynote Presentations",
        description: "Dr. Jayesh Shah, president of the Texas Medical Association, shared how dharma and perseverance have shaped his inspiring journey in medicine. Various sessions highlighted concepts of Yoga, Dharma, and Seva throughout the weekend.",
        position: "right"
      },
      {
        image: "/conf-photo3.jpg",
        title: "Panel Discussions",
        description: "Healthcare providers reflected on the opportunities and challenges of being a Hindu in Healthcare, showcasing various ways to integrate traditional treatment modalities into modern healthcare settings.",
        position: "left"
      },
      {
        image: "/conf-photo4.jpg",
        title: "Research Presentations",
        description: "HMSA students from the Research pillar presented topics such as yoga as alternative therapy for Cystic Fibrosis, Ayurvedic approaches for asthma, and implementing spiritual frameworks in Psychiatry.",
        position: "right"
      },
      {
        image: "/conf-photo5.jpg",
        title: "Poster Presentations",
        description: "Undergraduate students from the HMSA Sewa Pillar showcased a poster series on various Hindu Health topics, ranging from Ayurveda and nutrition to pregnancy and ancient surgical practices.",
        position: "left"
      },
      {
        image: "/conf-photo6.jpeg",
        title: "Interactive Nutrition & Cooking Sessions",
        description: "Attendees participated in hands-on nutrition sessions and cooking demonstrations, learning to prepare simple and healthy recipes that support an Ayurvedically friendly lifestyle. All meals were specially curated to reflect these ideals.",
        position: "right"
      },
      {
        image: "/conf-photo7.jpg",
        title: "Gaushala Visit & Sewa Activities",
        description: "On Saturday evening, attendees had the opportunity to visit the Aum Ashram Gaushala and spend time with the cows in the serene environment, embodying the spirit of sewa and connection with dharmic values.",
        position: "left"
      },
      {
        image: "/conf-photo8.jpg",
        title: "HMSA Pillars Brainstorming & Closing",
        description: "The conference concluded with a brainstorming session centered around the four HMSA pillars (Networking, Sewa, Education, Research), followed by a closing talk by Amruta Houde from Hindu Swayamsevak Sangh discussing vast opportunities for HMSA's future growth.",
        position: "right"
      }
    ]
  };

  return (
    <>
      {/* Global styles to ensure white background */}
      <style jsx global>{`
        html, body {
          background-color: white !important;
        }
      `}</style>
      
      <div className='min-h-screen bg-white w-full'>
        <Header />
        
        {/* Hero Section - Pure White Background with Heading */}
        <section className="min-h-screen bg-white w-full flex flex-col items-center justify-center p-8 pt-28">
          {/* Main Heading - Only This Moved Down */}
          <div className="text-center mb-6 mt-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-hmsa-blue mb-4">
              HMSA National Conference 2025
            </h1>
          </div>

          {/* Content Boxes - Back to Original Position */}
          <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-8">
            
            {/* Left Box - Image Container */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full border border-gray-200">
                <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px]">
                  <Image
                    src={conferenceData.heroImage}
                    alt="Conference Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right Box - Conference Data Container (Blue Background) */}
            <div className="w-full lg:w-1/3">
              <div className="bg-hmsa-blue rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Svasthya Logo - Absolutely no margin, touches top */}
                <div className="relative w-full h-48 sm:h-56 lg:h-64 xl:h-72">
                  <Image
                    src="/svasthya-logo.jpg" 
                    alt="Svasthya Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
                  <p className="text-base lg:text-lg xl:text-xl text-gray-100 mb-6 leading-relaxed text-center">
                    {conferenceData.subtitle}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-sm lg:text-base text-gray-100">
                      <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{conferenceData.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-center text-sm lg:text-base text-gray-100">
                      <svg className="w-5 h-5 mr-3 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{conferenceData.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conference Overview Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-hmsa-blue mb-6">
                Conference Highlights
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                {conferenceData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Photo Gallery with 8 Alternating Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            {conferenceData.photoSections.map((section, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16 lg:mb-24 ${
                  section.position === 'right' ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image Box */}
                <div className="w-full lg:w-1/2">
                  <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                
                {/* Content Box */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-hmsa-blue mb-6">
                    {section.title}
                  </h3>
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section - Updated with Left Content and Right Logo */}
        <section className="py-16 bg-hmsa-blue">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              
              {/* Left Side - Content */}
              <div className="w-full lg:w-2/3 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Join Us for Future Conferences
                </h2>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  The inaugural Svasthya conference brought tremendous energy and ideas for the future of HMSA. Stay connected to be part of our continued growth and upcoming events.
                </p>
                <a
                  href="/#join"
                  className="inline-block bg-white text-hmsa-blue font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300 text-lg"
                >
                  Join Our Community
                </a>
              </div>
              
              {/* Right Side - HMSA Logo */}
              <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                  <Image
                    src="/hmsa.png"
                    alt="HMSA Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='bg-hmsa-blue py-4 text-center text-white border-t border-blue-800'>
          <div className='container mx-auto px-4'>
            <p>&copy; 2025 Hindu Medical Society of America. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
