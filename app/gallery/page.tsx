"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabKey = "events" | "vision" | "pillars";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("events");
  const [eventSetIndex, setEventSetIndex] = useState<number>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const tabs: { key: TabKey; label: string }[] = useMemo(
    () => [
      { key: "events", label: "Events" },
      { key: "vision", label: "Vision" },
      { key: "pillars", label: "Pillars" },
    ],
    []
  );

  const eventImageSets: { label: string; images: { src: string; alt: string }[] }[] = useMemo(
    () => [
      {
        label: "Set 1",
        images: [
          { src: "/Event1.jpeg", alt: "Event 1" },
          { src: "/Event2.jpg", alt: "Event 2" },
          { src: "/Event3.jpg", alt: "Event 3" },
          { src: "/hmsa.png", alt: "HMSA Logo" },
          { src: "/steth21.png", alt: "Stethoscope Graphic" },
        ],
      },
      {
        label: "Set 2",
        images: [
          { src: "/vision2.jpg", alt: "Community Gathering" },
          { src: "/vision3.jpg", alt: "Speaker Session" },
          { src: "/vision4.jpg", alt: "Workshop" },
          { src: "/Event2.jpg", alt: "Event Highlight" },
          { src: "/Event1.jpeg", alt: "Event Snapshot" },
        ],
      },
      {
        label: "Set 3",
        images: [
          { src: "/Event3.jpg", alt: "Panel" },
          { src: "/Event2.jpg", alt: "Networking" },
          { src: "/Event1.jpeg", alt: "Presentation" },
          { src: "/vision2.jpg", alt: "Audience" },
          { src: "/steth21.png", alt: "Brand Graphic" },
        ],
      },
    ],
    []
  );

  const imagesByTab: Record<TabKey, { src: string; alt: string }[]> = useMemo(
    () => ({
      events: eventImageSets[Math.max(0, Math.min(eventSetIndex, eventImageSets.length - 1))].images,
      vision: [
        { src: "/vision1.png", alt: "Vision 1" },
        { src: "/vision2.jpg", alt: "Vision 2" },
        { src: "/vision3.jpg", alt: "Vision 3" },
        { src: "/vision4.jpg", alt: "Vision 4" },
      ],
      pillars: [
        { src: "/education_pillar.jpeg", alt: "Education Pillar" },
        { src: "/research_pillar.jpeg", alt: "Research Pillar" },
        { src: "/networking_pillar.jpeg", alt: "Networking Pillar" },
        { src: "/sewa_pillar.jpeg", alt: "Seva Pillar" },
        { src: "/pillars2.png", alt: "Pillars Illustration" },
      ],
    }),
    [eventImageSets, eventSetIndex]
  );

  const activeImages = imagesByTab[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-hmsa-blue font-semibold px-3 py-1.5 rounded-full border border-hmsa-blue/30 hover:bg-hmsa-blue hover:text-white transition"
            >
              ← Home
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gallery</h1>
          </div>
          <div className="hidden sm:block text-sm text-gray-500">Hindu Medical Society of America</div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    isActive
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-28">
          {activeImages.map((img) => (
            <figure key={`${activeTab}-${img.src}`} className="group relative rounded-2xl">
              {/* Blue transparent edge/glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/35 via-cyan-400/25 to-indigo-500/25 blur-md opacity-70 group-hover:opacity-90 transition"
              />
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-md ring-1 ring-inset ring-blue-400/30 shadow-xl shadow-blue-500/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={activeTab === "events"}
                />
                <figcaption className="px-3 py-2 text-sm text-gray-700/90 bg-white/60 backdrop-blur border-t border-white/20">
                  {img.alt}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Bottom event selector (only for Events tab) */}
      {activeTab === "events" && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/40 backdrop-blur-xl shadow-lg shadow-blue-500/10 px-2 py-1">
            {eventImageSets.map((set, idx) => {
              const isActive = idx === eventSetIndex;
              return (
                <button
                  key={set.label}
                  onClick={() => setEventSetIndex(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                      : "text-gray-800 hover:bg-white/70"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Select ${set.label}`}
                >
                  {set.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-hmsa-blue py-4 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-sm sm:text-base">
            © {new Date().getFullYear()} Hindu Medical Society of America. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


