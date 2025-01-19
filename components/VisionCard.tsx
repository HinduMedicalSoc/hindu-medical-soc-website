import React, { useState } from "react";
import Image from "next/image";

interface VisionCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const VisionCard: React.FC<VisionCardProps> = ({
  imageSrc,
  title,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-3 aspect-h-2 w-full relative">
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p
          className={`text-sm transition-all duration-300 ease-in-out ${
            isHovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
          } overflow-hidden`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default VisionCard;
