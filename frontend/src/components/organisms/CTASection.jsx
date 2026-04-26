import { Link } from 'react-router-dom';
import SectionLabel from '../atoms/SectionLabel';

const CTASection = () => {
  return (
    <section className="w-full bg-primary py-20 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
        <SectionLabel>Mulai Sekarang</SectionLabel>

        <h2 className="text-3xl font-medium text-white leading-snug">Siap mengenal kulitmu lebih dalam?</h2>

        <p className="text-primary-light text-base max-w-md leading-relaxed">Daftar gratis dan mulai analisis kulitmu sekarang. Cepat, akurat, dan personal.</p>

        <Link to="/register">
          <button className="bg-white text-primary font-medium px-8 py-3 rounded-pill hover:bg-primary-light transition-colors duration-200">Daftar & Mulai Gratis</button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
