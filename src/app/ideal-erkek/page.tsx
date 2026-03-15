'use client';

import { useMemo, useState } from 'react';

type Feature = {
  id: number;
  name: string;
  level: number;
};

const initialFeatures: Feature[] = [
  { id: 1, name: 'Saygılı', level: 8 },
  { id: 2, name: 'Güvenilir', level: 9 },
  { id: 3, name: 'Duygusal zeka', level: 8 },
  { id: 4, name: 'Sorumluluk sahibi', level: 9 },
  { id: 5, name: 'İletişim gücü', level: 7 },
  { id: 6, name: 'Empati', level: 8 },
  { id: 7, name: 'Mizah anlayışı', level: 7 },
  { id: 8, name: 'Çalışkanlık', level: 8 },
  { id: 9, name: 'Sadakat', level: 9 },
  { id: 10, name: 'Kişisel bakım', level: 7 },
];

export default function IdealErkekPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const averageBass = useMemo(() => {
    if (!features.length) return 0;
    const total = features.reduce((sum, item) => sum + item.level, 0);
    return Number((total / features.length).toFixed(1));
  }, [features]);

  const updateLevel = (id: number, level: number) => {
    setFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, level } : item))
    );
  };

  const addFeature = () => {
    const cleanedName = newFeatureName.trim();
    if (!cleanedName) return;

    setFeatures((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: cleanedName,
        level: 5,
      },
    ]);
    setNewFeatureName('');
  };

  const removeFeature = (id: number) => {
    setFeatures((prev) => prev.filter((item) => item.id !== id));
  };

  const downloadChart = () => {
    const rowHeight = 42;
    const headerHeight = 72;
    const footerHeight = 40;
    const width = 920;
    const height = headerHeight + features.length * rowHeight + footerHeight;

    const rows = features
      .map((item, index) => {
        const y = headerHeight + index * rowHeight;
        const barWidth = (item.level / 10) * 520;

        return `
          <text x="40" y="${y + 24}" font-size="16" fill="#e2e8f0">${item.name}</text>
          <rect x="300" y="${y + 8}" width="520" height="18" rx="9" fill="#1e293b"></rect>
          <rect x="300" y="${y + 8}" width="${barWidth}" height="18" rx="9" fill="#3b82f6"></rect>
          <text x="840" y="${y + 24}" font-size="14" text-anchor="end" fill="#93c5fd">${item.level}/10</text>
        `;
      })
      .join('');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="#0f172a"/>
        <text x="40" y="42" font-size="28" font-weight="700" fill="#f8fafc">İdeal Erkek Bass Grafiği</text>
        <text x="40" y="62" font-size="14" fill="#94a3b8">Ortalama bass seviyesi: ${averageBass}/10</text>
        ${rows}
      </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ideal-erkek-bass-grafiği.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-10">
      <section className="container max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">İdeal Erkek</h1>
        <p className="text-slate-300 mb-8">
          Karakteristik özelliklerin bass seviyesini 0-10 arası ayarla ve son
          grafiği indir.
        </p>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addFeature();
            }}
            placeholder="Yeni özellik ekle (örnek: liderlik)"
            className="w-full md:flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addFeature}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-3 font-semibold text-slate-950 cursor-pointer"
          >
            Yeni Özellik Ekle
          </button>
          <button
            onClick={downloadChart}
            className="rounded-xl bg-blue-500 hover:bg-blue-400 transition-colors px-5 py-3 font-semibold text-slate-950 cursor-pointer"
          >
            Grafiği İndir
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteMode((prev) => !prev)}
            className={`rounded-xl px-5 py-3 font-semibold transition-colors cursor-pointer ${
              isDeleteMode
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
            }`}
          >
            {isDeleteMode ? 'İptal' : 'Özellik Sil'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-4 md:p-5">
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">
                Genel Bass Seviyesi: <strong className="text-cyan-300">{averageBass}/10</strong>
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${(averageBass / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {features.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-2 relative"
                >
                  {isDeleteMode && (
                    <button
                      type="button"
                      onClick={() => removeFeature(item.id)}
                      className="absolute top-0 right-0 z-10 w-5 h-5 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center text-sm leading-none font-bold opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Özelliği sil"
                      aria-label={`${item.name} özelliğini sil`}
                    >
                      ×
                    </button>
                  )}
                  <div className="h-24 flex items-center justify-center">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={item.level}
                      onChange={(e) => updateLevel(item.id, Number(e.target.value))}
                      className="h-20 w-3 accent-cyan-500 cursor-pointer"
                      style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 whitespace-nowrap">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-400 tabular-nums -mt-1">
                    {item.level}/10
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-5 md:p-7">
            <h2 className="text-xl font-semibold mb-4">Canlı Bass Grafiği</h2>
            <div className="space-y-3">
              {features.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-cyan-300 font-semibold">{item.level}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${(item.level / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
