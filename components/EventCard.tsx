import Image from "next/image";
import React from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string; // Accepts path, URL, or base64
  link?: string;
  linkText?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  description,
  imageUrl,
  link,
  linkText,
}) => {
  // Function to truncate the description cleanly
  const truncateDescription = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const resolveImageSrc = (src: string) => {
    if (!src || src.trim() === "") return "/hmsa.png";
    if (
      src.startsWith("/") ||
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:")
    ) {
      return src;
    }
    return `data:image/jpeg;base64,${src}`;
  };

  const imageSrc = resolveImageSrc(imageUrl);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between border border-gray-100 group">
      <div>
        <div className="relative w-full h-52 overflow-hidden bg-slate-50">
          <Image
            src={imageSrc}
            alt={title}
            fill
            unoptimized
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2.5 text-[#00192F] line-clamp-2 leading-snug">
            {title}
          </h3>
          <div className="flex items-center text-xs sm:text-sm font-semibold text-amber-700 mb-1.5 gap-1.5">
            <Calendar size={15} className="flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3 gap-1.5">
            <MapPin size={15} className="flex-shrink-0 text-gray-400" />
            <span>{location}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {truncateDescription(description, 140)}
          </p>
        </div>
      </div>

      {link && (
        <div className="px-5 pb-5 pt-0">
          <a
            href={link}
            target={link.startsWith("http") ? "_blank" : "_self"}
            rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-hmsa-blue hover:text-white bg-amber-50 hover:bg-hmsa-blue px-4 py-2 rounded-lg border border-amber-200 hover:border-hmsa-blue transition-all duration-200 w-full justify-center shadow-sm"
          >
            <span>{linkText || (link.includes("zoom") || link.includes("tx.ag") ? "Join Meeting" : link.includes("forms") ? "RSVP / Register" : "Learn More")}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
};

export default EventCard;

