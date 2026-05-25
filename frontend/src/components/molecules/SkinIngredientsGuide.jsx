import React, { useState } from 'react';

const SKIN_INGREDIENTS = [
  {
    type: 'Berminyak',
    desc: 'Kelenjar minyak (sebum) terlalu aktif, menyebabkan pori-pori rentan tersumbat dan memicu komedo.',
    actives: ['Salicylic Acid (BHA)', 'Niacinamide', 'Retinol'],
    insight: 'BHA bersifat lipofilik (larut dalam minyak), memungkinkannya masuk ke dalam pori-pori untuk membersihkan sumbatan sebum.',
  },
  {
    type: 'Kering',
    desc: 'Kulit kekurangan produksi lipid alami, merusak pertahanan hidrasi sehingga kulit terasa kesat dan kasar.',
    actives: ['Hyaluronic Acid', 'Ceramides', 'Glycerin'],
    insight: 'Ceramides merekatkan kembali sel-sel kulit yang renggang untuk memperbaiki fungsi skin barrier dalam mengunci molekul air.',
  },
  {
    type: 'Sensitif',
    desc: 'Toleransi kulit sangat rendah terhadap agen eksternal, mudah memicu reaksi inflamasi, kemerahan, atau perih.',
    actives: ['Centella Asiatica', 'Allantoin', 'Panthenol'],
    insight: 'Senyawa Madecassoside pada Centella terbukti secara klinis menurunkan sitokin inflamasi untuk menenangkan pembuluh darah.',
  },
];

const SkinIngredientsGuide = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentSkin = SKIN_INGREDIENTS[activeIndex];

  return (
    <div className="w-full bg-neutral-50 rounded-2xl p-6 border border-neutral-200 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-medium text-neutral-900">Matriks Jenis Kulit & Bahan Aktif (Insight Data Science)</h3>
        <p className="text-xs text-neutral-400 mt-0.5">Edukasi pencocokan bahan aktif kosmetik berdasarkan hasil korelasi data jenis kulit individu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SKIN_INGREDIENTS.map((skin, idx) => (
          <button
            key={skin.type}
            onClick={() => setActiveIndex(idx)}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${activeIndex === idx ? 'bg-white border-primary shadow-sm ring-1 ring-primary' : 'bg-white border-neutral-200 hover:border-neutral-300'}`}
          >
            <p className={`text-sm font-semibold ${activeIndex === idx ? 'text-primary' : 'text-neutral-900'}`}>Tipe {skin.type}</p>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{skin.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl border border-neutral-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-neutral-400 mr-2">Rekomendasi Bahan Utama:</span>
          {currentSkin.actives.map((active) => (
            <span key={active} className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium border border-primary/10">
              {active}
            </span>
          ))}
        </div>
        <div className="border-t border-neutral-100 pt-3 flex flex-col gap-0.5">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Korelasi Riset Data</span>
          <p className="text-sm text-neutral-900 leading-relaxed font-normal">{currentSkin.insight}</p>
        </div>
      </div>
    </div>
  );
};

export default SkinIngredientsGuide;
