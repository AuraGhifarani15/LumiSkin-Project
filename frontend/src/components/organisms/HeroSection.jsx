import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import SectionLabel from '../atoms/SectionLabel';

const HeroSection = () => {
  return (
    <section id="home" className="w-full bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <SectionLabel>Analisis Kulit Berbasis AI</SectionLabel>

        <h1 className="text-5xl font-medium text-neutral-900 leading-tight tracking-tight">
          Kenali Kulitmu, <br />
          <span className="text-primary">Rawat dengan Tepat</span>
        </h1>

        <p className="text-lg text-neutral-400 max-w-xl leading-relaxed">Upload foto wajahmu dan dapatkan diagnosis kondisi kulit secara akurat menggunakan teknologi deep learning multimodal.</p>

        <div className="flex gap-2 flex-wrap justify-center">
          <Badge>Berbasis AI</Badge>
          <Badge color="green">Gratis</Badge>
          <Badge color="amber">Beta</Badge>
        </div>

        <div className="flex gap-3 mt-2">
          <Link to="/register">
            <Button size="lg">Mulai Analisis</Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              Pelajari Lebih Lanjut
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
