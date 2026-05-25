import React, { useState } from 'react';

const ACNE_DATA = [
  {
    id: 'papula',
    name: 'Papula',
    characteristic: 'Benjolan kecil, padat, dan kemerahan di atas permukaan kulit tanpa puncak bernanah.',
    cause: 'Penyumbatan pori-pori yang memicu inflamasi selular ringan akibat aktivitas bakteri Propionibacterium acnes.',
  },
  {
    id: 'pustula',
    name: 'Pustula',
    characteristic: 'Benjolan meradang yang memiliki puncak putih atau kekuningan di bagian tengahnya (berisi nanah).',
    cause: 'Eskalasi inflamasi di mana sel darah putih (neutrofil) berkumpul di permukaan kulit untuk melawan infeksi.',
  },
  {
    id: 'nodul',
    name: 'Nodul / Kistik',
    characteristic: 'Benjolan berukuran besar, keras, tertanam jauh di dalam lapisan kulit, dan terasa nyeri jika disentuh.',
    cause: 'Kerusakan dinding folikel yang parah, menyebabkan infeksi dan peradangan menyebar luas di lapisan dermis.',
  },
];

const AcneCatalog = () => {
  const [activeTab, setActiveTab] = useState('papula');
  const activeAcne = ACNE_DATA.find((item) => item.id === activeTab);

  return (
    <div className="w-full bg-neutral-50 rounded-2xl p-6 border border-neutral-200 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-medium text-neutral-900">Katalog Jenis Jerawat (Edukasi Model AI)</h3>
        <p className="text-xs text-neutral-400 mt-0.5">Kenali karakteristik visual jerawat yang dideteksi secara otomatis oleh model Computer Vision LumiSkin.</p>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 pb-px">
        {ACNE_DATA.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer ${activeTab === item.id ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 bg-white p-5 rounded-xl border border-neutral-100 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Karakteristik Klinis</span>
          <p className="text-sm text-neutral-900 leading-relaxed font-normal">{activeAcne.characteristic}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Patologi Biologis</span>
          <p className="text-sm text-neutral-900 leading-relaxed font-normal">{activeAcne.cause}</p>
        </div>
      </div>
    </div>
  );
};

export default AcneCatalog;
