import React from 'react';
import { Star } from 'lucide-react';
import './TestimonialsSection.css';

const testimonials = [
  {
    id: 1,
    initials: 'PS',
    name: 'Priya Sharma',
    occasion: 'Bridal Lehenga — Customisation',
    rating: 5,
    quote:
      'Satrangi understood my vision perfectly. The customised lehenga was absolutely breathtaking — every embroidery detail was exactly what I had dreamed of. Made my wedding day truly unforgettable.',
  },
  {
    id: 2,
    initials: 'AM',
    name: 'Anjali Mehta',
    occasion: 'Lehenga on Rent',
    rating: 5,
    quote:
      'Rented a stunning lehenga for my cousin\'s wedding. The quality was exceptional and the entire process was seamless. I felt like a bride myself! Will absolutely be back for every occasion.',
  },
  {
    id: 3,
    initials: 'SV',
    name: 'Sunita Verma',
    occasion: 'Jewellery on Rent',
    rating: 5,
    quote:
      'The kundan jewellery set was beyond gorgeous. Everyone at the function kept asking where I got it from. The rental service is such a brilliant idea — luxury without breaking the bank.',
  },
  {
    id: 4,
    initials: 'RK',
    name: 'Ritu Kapoor',
    occasion: 'Kids Customisation',
    rating: 5,
    quote:
      'Got my daughter\'s outfit customised for our family function. The fit was perfect and the fabric quality was outstanding. Such a talented and caring team — they got every little detail right.',
  },
];

const StarRating = ({ count }) => (
  <div className="star-rating">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section section-padding" id="testimonials">
      <div className="container">
        <div className="testimonials-header text-center">
          <p className="testimonials-eyebrow">LOVE FROM OUR CLIENTS</p>
          <h2 className="heading-lg">What They <span className="text-gold">Say</span></h2>
          <p className="testimonials-subtitle">
            Real stories from real brides, families &amp; fashion lovers.
          </p>
          <div className="testimonials-gold-rule"></div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.id}>
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">{t.initials}</div>
                <div className="testimonial-meta">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-occasion">{t.occasion}</span>
                  <StarRating count={t.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
