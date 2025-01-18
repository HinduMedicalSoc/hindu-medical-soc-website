import React from "react";
import Image from "next/image";

interface ModifiableEventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  onModify: () => void;
  onDelete: () => void;
}

const ModifiableEventCard: React.FC<ModifiableEventCardProps> = ({
  title,
  date,
  location,
  description,
  imageUrl,
  onModify,
  onDelete,
}) => {
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
      <div className='relative w-full h-auto aspect-w-4 aspect-h-3'>
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className='transition-transform duration-300 hover:scale-105'
        />
        {/* Overlay buttons */}
        <div className='absolute top-0 left-0 right-0 p-2 flex justify-between z-10'>
          <button
            onClick={onModify}
            className='text-white hover:underline font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded'>
            Modify
          </button>
          <button
            onClick={onDelete}
            className='text-white hover:underline font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded'>
            Delete
          </button>
        </div>
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-1 text-[#00192F]'>{title}</h3>
        <p className='text-sm text-gray-600 mb-1'>{date}</p>
        <p className='text-sm text-gray-600 mb-2'>{location}</p>
        <p className='text-sm text-gray-700'>
          {truncateDescription(description, 80)}
        </p>
      </div>
    </div>
  );
};

export default ModifiableEventCard;
