// --- FILE: components/BusinessModelCard.tsx ---

import Link from 'next/link';

interface BusinessModelCardProps {
  icon: string;
  title: string;
  description: string;
  priceInfo: string;
  link: string;
  iconBgColor: string;
  iconTextColor: string;
}

const BusinessModelCard: React.FC<BusinessModelCardProps> = ({
  icon, title, description, priceInfo, link, iconBgColor, iconTextColor
}) => {
  return (
     // Added flex flex-col to ensure footer aligns at bottom
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor} ${iconTextColor} mr-4 flex-shrink-0`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 text-sm flex-grow">{description}</p> {/* Added flex-grow */}
      <div className="flex justify-between items-center mt-auto pt-2"> {/* mt-auto pushes to bottom */}
        <span className="text-sm text-gray-500">{priceInfo}</span>
        <Link href={link} className="text-primary font-medium hover:underline text-sm">
          View Templates
        </Link>
      </div>
    </div>
  );
};

export default BusinessModelCard;