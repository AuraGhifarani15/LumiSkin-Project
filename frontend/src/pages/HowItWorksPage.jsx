import React from 'react';
import { Upload, ScanFace, FileText } from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import SectionLabel from '../components/atoms/SectionLabel';
import StepCard from '../components/molecules/StepCard';
import AcneCatalog from '../components/molecules/AcneCatalog';
import SkinIngredientsGuide from '../components/molecules/SkinIngredientsGuide';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Foto',
    description: 'Ambil atau unggah foto area kulit yang bermasalah dengan pencahayaan yang optimal.',
  },
  {
    number: '02',
    icon: ScanFace,
    title: 'Analisis Multimodal',
    description: 'AI memproses data visual dan teks keluhanmu untuk mendeteksi kondisi kulit secara otomatis.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Rekomendasi Bahan',
    description: 'Dapatkan laporan analisis serta daftar bahan aktif skincare yang paling cocok untukmu.',
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto py-16 px-6 flex flex-col gap-20">
        <div className="text-center flex flex-col items-center gap-2">
          <SectionLabel>Panduan Edukasi</SectionLabel>
          <h1 className="text-4xl font-medium text-neutral-900 tracking-tight">Bagaimana LumiSkin Bekerja?</h1>
          <p className="text-neutral-400 max-w-xl text-base leading-relaxed mt-2">
            Kami menggabungkan teknologi Deep Learning untuk deteksi visual dengan analisis data klinis untuk memberikan rekomendasi perawatan kulit yang personal dan akurat.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          <div className="text-left">
            <h2 className="text-xl font-medium text-neutral-900">Alur Analisis</h2>
            <div className="h-1 w-10 bg-primary mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {steps.map((step, index) => (
              <StepCard key={step.number} number={step.number} icon={step.icon} title={step.title} description={step.description} index={index} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 border-t border-neutral-100 pt-16">
          <div className="text-left">
            <h2 className="text-xl font-medium text-neutral-900 uppercase tracking-widest text-sm text-primary">Intelligence & Research</h2>
            <h3 className="text-2xl font-medium text-neutral-900 mt-2">Pusat Pengetahuan Dermatologi</h3>
            <p className="text-sm text-neutral-400 mt-2">Pelajari klasifikasi kondisi kulit yang kami gunakan dalam melatih model AI kami.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 w-full">
            <AcneCatalog />
            <SkinIngredientsGuide />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
