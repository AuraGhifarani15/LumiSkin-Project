import { Upload, ScanFace, FileText } from 'lucide-react';
import SectionLabel from '../atoms/SectionLabel';
import StepCard from '../molecules/StepCard';
import AcneCatalog from '../molecules/AcneCatalog';
import SkinIngredientsGuide from '../molecules/SkinIngredientsGuide';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Foto',
    description: 'Ambil atau upload foto wajahmu dengan pencahayaan yang baik.',
  },
  {
    number: '02',
    icon: ScanFace,
    title: 'AI Menganalisis',
    description: 'Model kami memproses gambar dan mendeteksi kondisi kulitmu secara otomatis.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Terima Hasil',
    description: 'Dapatkan laporan lengkap beserta rekomendasi produk yang tepat untukmu.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="w-full bg-white py-20 px-6 border-b border-neutral-100">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-16">
        {/* Section Heading Typography */}
        <div className="text-center flex flex-col items-center gap-2">
          <SectionLabel>Cara Kerja</SectionLabel>
          <h2 className="text-3xl font-medium text-neutral-900">Mudah dalam 3 langkah</h2>
          <p className="text-neutral-400 max-w-md">Tidak perlu keahlian khusus — cukup foto, dan LumiSkin bekerja untukmu.</p>
        </div>

        {/* ── BAGIAN A: Alur Langkah Menggunakan Atom/Molekul StepCard ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative">
          {steps.map((step, index) => (
            <StepCard key={step.number} number={step.number} icon={step.icon} title={step.title} description={step.description} index={index} />
          ))}
        </div>

        {/* ── BAGIAN B: Dokumentasi Informasi & Edukasi Ilmiah Proyek ── */}
        <div className="w-full flex flex-col gap-6 mt-4">
          <div className="text-left">
            <h3 className="text-xl font-medium text-neutral-900">Pusat Edukasi Dermatologi</h3>
            <p className="text-sm text-neutral-400 mt-1">Pelajari dasar ilmiah pengolahan data kami sebelum melakukan analisis mendalam.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full">
            {/* Hasil Ekspor Kerja AI Path */}
            <AcneCatalog />

            {/* Hasil Analisis Kerja Data Science Path */}
            <SkinIngredientsGuide />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
