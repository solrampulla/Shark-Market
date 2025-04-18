// --- FILE: components/TestimonialsSection.tsx ---

import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    { rating: 5, text: "\"I've been able to monetize my Excel templates, reaching entrepreneurs globally. The platform is incredibly easy to use.\"", imageUrl: "https://public.readdy.ai/ai/img_res/bed0bbe257160d5189085275ef3868fc.jpg", name: "David Thompson", title: "Marketing Consultant" },
    { rating: 4.5, text: "\"The ready-to-use materials helped me launch my startup in half the time and grow by 40% in six months.\"", imageUrl: "https://public.readdy.ai/ai/img_res/fd8b003a4401dbbc3fa7720a046b1622.jpg", name: "James Wilson", title: "Small Business Owner" },
    { rating: 5, text: "\"Their restaurant business plan template saved me countless hours and helped me secure funding for my new bistro.\"", imageUrl: "https://public.readdy.ai/ai/img_res/76a72f3edb213f40d9115ad481af657e.jpg", name: "Sophia Rodriguez", title: "Restaurant Owner" },
  ];

  return (
    // Cambié el bg a white para que las cards resalten, ajusta si prefieres bg-gray-50
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What Our Users Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;