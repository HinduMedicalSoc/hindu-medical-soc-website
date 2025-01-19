"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import VisionCard from "./VisionCard"; // Import your existing VisionCard component

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current; // Store ref.current in a variable
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AboutUs: React.FC = () => {
  return (
    <>
      <AnimatedSection>
        <h2 className="text-5xl font-bold mb-6 text-left text-[#00192F]">
          About Us 🩺
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <p className="text-2xl text-gray-700 mb-8">
          Hindu Medical Society of America (HMSA) provides a platform to connect
          medical students, residents and professionals to understand medicine
          through the lens of Hindu Dharma. By providing a platform for Sewa,
          Education and Representation, HMSA aims to create a strong network of
          physicians inspired by the Hindu Way of Life.
        </p>
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-3 text-[#00192F]">
            Mission Statement
          </h3>
          <p className="text-lg text-gray-700 mb-4 text-left">
            HMSA provides opportunities for its members to network and find
            mentors/mentees, participate in healthcare-related sewa activities,
            educate the community on both healthcare and Hindu culture, conduct
            and present research related to Hindu Dharma and medicine, and much
            more. Building a strong connection among present and future Hindu
            physicians will be valuable for the physicians, their patients, and
            the field of medicine.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedSection delay={400}>
          <VisionCard
            imageSrc="/vision1a.jpg"
            title="Networking"
            description="Connect medical students, residents, fellows, and physicians with a shared interest in Hindu Dharma."
          />
        </AnimatedSection>
        <AnimatedSection delay={500}>
          <VisionCard
            imageSrc="/vision2.jpg"
            title="Education"
            description="Educate about the Hindu perspectives, philosophies and practices relating to healthcare."
          />
        </AnimatedSection>
        <AnimatedSection delay={600}>
          <VisionCard
            imageSrc="/vision4.jpg"
            title="Sewa"
            description="Engage in outreach programs to serve diverse communities in need."
          />
        </AnimatedSection>
        <AnimatedSection delay={700}>
          <VisionCard
            imageSrc="/vision3.jpg"
            title="Research"
            description="Grow our understanding of the connection between modern medicine and Hindu Dharma."
          />
        </AnimatedSection>
      </div>
    </>
  );
};
export default AboutUs;
