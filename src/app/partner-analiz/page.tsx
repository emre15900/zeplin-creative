'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { showToast } from '@/lib/toast';
import { isOzgeDate, OZGE_STORAGE_KEY } from '@/lib/ozge-date';

type Feature = {
  id: number;
  name: string;
  level: number;
};

const initialFeatures: Feature[] = [
  { id: 1, name: 'Saygılı', level: 7 },
  { id: 2, name: 'Güvenilir', level: 8 },
  { id: 3, name: 'Duygusal zeka', level: 6 },
  { id: 4, name: 'Zeka', level: 7 },
  { id: 5, name: 'Sorumluluk', level: 7 },
  { id: 6, name: 'İletişim', level: 6 },
  { id: 7, name: 'Empati', level: 6 },
  { id: 8, name: 'Mizah anlayışı', level: 8 },
  { id: 9, name: 'Çalışkanlık', level: 7 },
  { id: 10, name: 'Sadakat', level: 8 },
  { id: 11, name: 'Kişisel bakım', level: 6 },
  { id: 12, name: 'Cinsel uyum', level: 7 },
  { id: 13, name: 'Güç / Fizik', level: 6 },
  { id: 14, name: 'Para / Zenginlik', level: 5 },
  { id: 15, name: 'Boy', level: 6 },
  { id: 16, name: 'Kas', level: 5 },
  { id: 17, name: 'Yemek yapma', level: 5 },
  { id: 18, name: 'Ev işleri', level: 4 },
  { id: 19, name: 'Araba', level: 5 },
  { id: 20, name: 'Gavatlık', level: 3 },
  { id: 21, name: 'PC oyunları', level: 7 },
  { id: 22, name: 'Cömertlik', level: 6 },
  { id: 23, name: 'Sabır', level: 6 },
  { id: 24, name: 'Sosyal medya kullanımı', level: 5 },
  { id: 25, name: 'Yakışıklılık', level: 6 },
  { id: 26, name: 'Erillik', level: 6 },
];

const copyBtnClass = 'copy-btn-modal';

export default function PartnerAnalizPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isOzge, setIsOzge] = useState<boolean | null>(null);
  const aiCacheRef = useRef<Record<string, { featuresKey: string; rawText: string }>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(OZGE_STORAGE_KEY) === 'true') {
      setIsOzge(true);
      return;
    }
    const ayAdlari = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    const gunOpt = Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
    const ayOpt = ayAdlari.map((a, i) => `<option value="${i + 1}">${a}</option>`).join('');
    const yilOpt = Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => `<option value="${y}">${y}</option>`).join('');

    Swal.fire({
      title: 'İlişkinin başlama tarihi',
      html: `
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:0;">
          <select id="swal-date-gun" style="padding:10px 14px;font-size:15px;border:1px solid #d1d5db;border-radius:8px;min-width:70px;">
            <option value="">Gün</option>${gunOpt}
          </select>
          <select id="swal-date-ay" style="padding:10px 14px;font-size:15px;border:1px solid #d1d5db;border-radius:8px;min-width:100px;">
            <option value="">Ay</option>${ayOpt}
          </select>
          <select id="swal-date-yil" style="padding:10px 14px;font-size:15px;border:1px solid #d1d5db;border-radius:8px;min-width:85px;">
            <option value="">Yıl</option>${yilOpt}
          </select>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: 'Devam',
      allowOutsideClick: false,
      preConfirm: () => {
        const gun = (document.getElementById('swal-date-gun') as HTMLSelectElement)?.value;
        const ay = (document.getElementById('swal-date-ay') as HTMLSelectElement)?.value;
        const yil = (document.getElementById('swal-date-yil') as HTMLSelectElement)?.value;
        if (!gun || !ay || !yil) return '';
        const d = gun.padStart(2, '0');
        const m = ay.padStart(2, '0');
        return `${yil}-${m}-${d}`;
      },
    }).then((result) => {
      const value = (result.value ?? '').trim();
      if (isOzgeDate(value)) {
        localStorage.setItem(OZGE_STORAGE_KEY, 'true');
        setIsOzge(true);
      } else {
        Swal.fire({
          title: 'Sen kimsin kardeşim?',
          text: 'Sen git özge gelsin.',
          icon: 'error',
          confirmButtonText: 'Tamam',
          allowOutsideClick: false,
        });
        setIsOzge(false);
      }
    });
  }, []);

  const visibleFeatures = features.slice(0, visibleCount);
  const hasMoreFeatures = features.length > visibleCount;
  const canShowLess = visibleCount > 8;

  const averageBass = useMemo(() => {
    if (!visibleFeatures.length) return 0;
    const total = visibleFeatures.reduce((sum, item) => sum + item.level, 0);
    return Number((total / visibleFeatures.length).toFixed(1));
  }, [visibleFeatures]);

  const updateLevel = (id: number, level: number) => {
    setFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, level } : item))
    );
  };

  const showPartnerResultModal = (rawText: string, type: 'analyze' | 'support') => {
    const aiText = (rawText || '').replace(/\n/g, '<br>');
    const title = type === 'analyze' ? 'Partner Analizi' : 'Partnerine Destek Ol';
    Swal.fire({
      title,
      showCloseButton: true,
      html: `
        <div style="text-align: left; line-height: 1.5; color: #334155; margin: 0; padding: 0;">
          <p style="margin: 0 0 6px; white-space: pre-wrap;">${aiText}</p>
          <div class="flex gap-3 mt-5 flex-wrap" style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <button type="button" id="pa-copy-text" class="${copyBtnClass}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;box-shadow:0 2px 10px rgba(6,182,212,0.3);">
              📋 Yazı olarak kopyala
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      customClass: {
        popup: 'partner-analiz-popup swal-fullscreen',
      },
      didOpen: () => {
        const style = document.createElement('style');
        style.textContent = `.${copyBtnClass}:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.25); opacity: 0.95; }`;
        document.head.appendChild(style);
        setTimeout(() => style.remove(), 10000);
        document.getElementById('pa-copy-text')?.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(rawText);
            showToast('Kopyalandı!');
          } catch {
            showToast('Kopyalanamadı');
          }
        });
      },
    });
  };

  const fetchAI = async (type: 'analyze' | 'support') => {
    const featuresKey = JSON.stringify(features.map((f) => ({ name: f.name, level: f.level })));
    const cached = aiCacheRef.current[type];
    if (cached?.featuresKey === featuresKey) {
      showPartnerResultModal(cached.rawText, type);
      return;
    }

    Swal.fire({
      title: 'AI düşünüyor...',
      html: type === 'analyze' ? 'Partnerin analiz ediliyor.' : 'Destek önerileri hazırlanıyor.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch('/api/partner-analiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: features.map((f) => ({ name: f.name, level: f.level })),
          type,
          isOzge: isOzge === true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI yanıtı alınamadı');

      const rawText = data.text || '';
      aiCacheRef.current[type] = { featuresKey, rawText };
      showPartnerResultModal(rawText, type);
    } catch (err) {
      Swal.fire({
        title: 'AI Kullanılamadı',
        text: err instanceof Error ? err.message : 'Bağlantı hatası',
        icon: 'error',
      });
    }
  };

  const downloadChart = () => {
    const rowHeight = 42;
    const headerHeight = 72;
    const width = 920;
    const height = headerHeight + features.length * rowHeight;

    const rows = features
      .map((item, index) => {
        const y = headerHeight + index * rowHeight;
        const barWidth = (item.level / 10) * 520;
        return `
          <text x="40" y="${y + 24}" font-size="16" fill="#e2e8f0">${item.name}</text>
          <rect x="300" y="${y + 8}" width="520" height="18" rx="9" fill="#1e293b"></rect>
          <rect x="300" y="${y + 8}" width="${barWidth}" height="18" rx="9" fill="#f43f5e"></rect>
          <text x="840" y="${y + 24}" font-size="14" text-anchor="end" fill="#fda4af">${item.level}/10</text>
        `;
      })
      .join('');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="#0f172a"/>
        <text x="40" y="42" font-size="28" font-weight="700" fill="#f8fafc">Partner Bass Grafiği</text>
        <text x="40" y="62" font-size="14" fill="#94a3b8">Ortalama: ${averageBass}/10</text>
        ${rows}
      </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'partner-bass-grafigi.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Grafik indirildi!');
  };

  if (isOzge === false) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-rose-400 mb-4">
            Sen kimsin kardeşim?
          </h1>
          <p className="text-slate-300 text-lg">Sen git özge gelsin.</p>
        </div>
      </main>
    );
  }

  if (isOzge === null) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-10">
      <section className="container max-w-5xl">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Şu Anki Partnerini Analiz Et</h1>
            <p className="text-slate-300">
              Partnerinin özelliklerini bass seviyesiyle değerlendir, AI ile analiz al.
            </p>
          </div>
          <Link
            href="/ideal-erkek"
            className="shrink-0 rounded-xl border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            ← İdeal Erkek
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-4 md:p-5">
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">
                Genel Bass Seviyesi: <strong className="text-rose-400">{averageBass}/10</strong>
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(averageBass / 10) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {visibleFeatures.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2 relative">
                  <div className="h-24 flex items-center justify-center">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={item.level}
                      onChange={(e) => updateLevel(item.id, Number(e.target.value))}
                      className="h-20 w-3 accent-rose-500 cursor-pointer"
                      style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 whitespace-nowrap">{item.name}</span>
                  <span className="text-[10px] font-semibold text-rose-400 tabular-nums -mt-1">
                    {item.level}/10
                  </span>
                </div>
              ))}
            </div>
            {(hasMoreFeatures || canShowLess) && (
              <div className="flex gap-2 mt-4">
                {hasMoreFeatures && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((p) => Math.min(p + 8, features.length))}
                    className="flex-1 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-sm"
                  >
                    Daha fazla özellik (+{Math.min(8, features.length - visibleCount)})
                  </button>
                )}
                {canShowLess && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((p) => Math.max(p - 8, 8))}
                    className="flex-1 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-sm"
                  >
                    Daha az özellik
                  </button>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={() => fetchAI('analyze')}
                className="w-full py-3 px-5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-medium transition-colors cursor-pointer text-sm"
              >
                Partnerimi analiz et
              </button>
              <button
                type="button"
                onClick={() => fetchAI('support')}
                className="w-full py-3 px-5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-medium transition-colors cursor-pointer text-sm"
              >
                Partnerime eksikliklerini gidermesi için destek ol
              </button>
            </div>
            <button
              onClick={downloadChart}
              className="w-full mt-3 py-3 px-5 rounded-xl bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium transition-colors cursor-pointer text-sm"
            >
              Grafiği İndir
            </button>
          </div>

          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-5 md:p-7">
            <h2 className="text-xl font-semibold mb-4">Canlı Bass Grafiği</h2>
            <div className="space-y-3">
              {visibleFeatures.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-rose-400 font-semibold">{item.level}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500"
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
