'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Link from 'next/link';
import { showToast } from '@/lib/toast';
import { isOzgeDate, OZGE_STORAGE_KEY } from '@/lib/ozge-date';

type Feature = {
  id: number;
  name: string;
  level: number;
};

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const STATIC_PROFILE_TEXT = `Bir erkekte hangi özellik ne kadar olmalı?

İdeal bir erkek profili dengeli olmalı. Temel değerler yüksek, bazı şeyler düşük kalmalı.

• Saygılı, Güvenilir, Sadakat (9): İlişkinin temeli.
• Zeka, Duygusal zeka (8): Hem akıllı hem duygusal olmalı.
• Cinsel uyum (7): Önemli ama tek kriter değil.
• Güç, Boy, Kas (6): Biraz olsun yeter.
• Para, Araba (5-6): Para her şey değil.
• Yemek, Ev işleri (7): Kendi ayakları üzerinde durabilmeli.
• Gavatlık (1): Mümkünse sıfıra yakın olsun.
• PC oyunları (6): Oyun oynasın ama seni de dinlesin.
• Sosyal medya takibi (0-1): Bu özellik düşük kalsın.

Ekleyebileceğin özellikler: Liderlik, Kıskançlık, Netflix paylaşımı, Aile değerleri`;

const initialFeatures: Feature[] = [
  { id: 1, name: 'Saygılı', level: 8 },
  { id: 2, name: 'Güvenilir', level: 9 },
  { id: 3, name: 'Duygusal zeka', level: 8 },
  { id: 4, name: 'Zeka', level: 8 },
  { id: 5, name: 'Sorumluluk', level: 9 },
  { id: 6, name: 'İletişim', level: 7 },
  { id: 7, name: 'Empati', level: 8 },
  { id: 8, name: 'Mizah anlayışı', level: 7 },
  { id: 9, name: 'Çalışkanlık', level: 8 },
  { id: 10, name: 'Sadakat', level: 9 },
  { id: 11, name: 'Kişisel bakım', level: 7 },
  { id: 12, name: 'Cinsel uyum', level: 6 },
  { id: 13, name: 'Güç / Fizik', level: 6 },
  { id: 14, name: 'Para / Zenginlik', level: 5 },
  { id: 15, name: 'Boy', level: 5 },
  { id: 16, name: 'Kas', level: 5 },
  { id: 17, name: 'Yemek yapma', level: 6 },
  { id: 18, name: 'Ev işleri', level: 6 },
  { id: 19, name: 'Araba', level: 5 },
  { id: 20, name: 'Gavatlık', level: 2 },
  { id: 21, name: 'PC oyunları', level: 4 },
  { id: 22, name: 'Cömertlik', level: 7 },
  { id: 23, name: 'Sabır', level: 7 },
  { id: 24, name: 'Sosyal medya kullanımı', level: 2 },
  { id: 25, name: 'Yakışıklılık', level: 1 },
  { id: 26, name: 'Erillik', level: 6 },
  { id: 27, name: 'Centilmenlik', level: 8 },
];

export default function IdealErkekPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isOzge, setIsOzge] = useState<boolean | null>(null);

  const visibleFeatures = features.slice(0, visibleCount);
  const hasMoreFeatures = features.length > visibleCount;
  const canShowLess = visibleCount > 8;
  const rapidTenRef = useRef({ count: 0, lastTime: 0 });
  const lastAlertRef = useRef<Record<string, number>>({});
  const aiProfileCacheRef = useRef<{ featuresKey: string; rawText: string } | null>(null);

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

  const averageBass = useMemo(() => {
    if (!visibleFeatures.length) return 0;
    const total = visibleFeatures.reduce((sum, item) => sum + item.level, 0);
    return Number((total / visibleFeatures.length).toFixed(1));
  }, [visibleFeatures]);

  const updateLevel = (id: number, level: number) => {
    const now = Date.now();
    if (level === 10) {
      const { count, lastTime } = rapidTenRef.current;
      if (now - lastTime < 1500) {
        rapidTenRef.current.count = count + 1;
        rapidTenRef.current.lastTime = now;
        if (count + 1 >= 4 && now - (lastAlertRef.current.rapidTen ?? 0) > 8000) {
          lastAlertRef.current.rapidTen = now;
          Swal.fire({
            title: pickRandom([
              'Sakin ol şampiyon!',
              'Yavaş yavaş!',
              'Nefes al, nefes ver...',
              'Bir saniye, sakin!',
            ]),
            text: pickRandom([
              'Özellikleri tek tek 10 yapmak yeterli.',
              'Hepsi 10 olunca ne olacak sanıyorsun?',
              'Bu kadar hızlı 10 çekme lütfen.',
            ]),
            icon: 'warning',
            confirmButtonText: 'Tamam tamam',
          });
          rapidTenRef.current.count = 0;
        }
      } else {
        rapidTenRef.current = { count: 1, lastTime: now };
      }
    } else {
      rapidTenRef.current.count = 0;
    }
    setFeatures((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, level } : item));
      const updated = next.find((f) => f.id === id);
      if (updated && level === 10) {
        const now = Date.now();
        if (updated.name === 'Gavatlık' && now - (lastAlertRef.current.gavat ?? 0) > 15000) {
          lastAlertRef.current.gavat = now;
          Swal.fire({
            title: 'Gavatlık 10 mu?',
            text: 'Ciddi misin? Bu özelliğin yüksek olmasını mı istiyorsun?',
            icon: 'question',
            confirmButtonText: 'Şaka yaptım',
          });
        }
        if (updated.name === 'Eski sevgili takıntısı' && now - (lastAlertRef.current.eski ?? 0) > 15000) {
          lastAlertRef.current.eski = now;
          Swal.fire({
            title: 'Eski sevgili takıntısı 10?',
            text: 'Kırmızı bayrak bu. Gerçekten istiyor musun?',
            icon: 'warning',
            confirmButtonText: 'Hayır hayır',
          });
        }
      }
      return next;
    });
  };

  const addFeature = () => {
    const cleanedName = newFeatureName.trim();
    if (!cleanedName) return;

    const customCount = features.filter((f) => f.id > 100).length;
    const now = Date.now();

    setFeatures((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: cleanedName,
        level: 5,
      },
    ]);
    setNewFeatureName('');

    if (customCount === 0 && now - (lastAlertRef.current.firstAdd ?? 0) > 15000) {
      lastAlertRef.current.firstAdd = now;
      Swal.fire({
        title: pickRandom([
          'Yeni bir yetenek mi keşfettin?',
          'Yaratıcısın!',
          'Özel bir özellik!',
        ]),
        text: pickRandom([
          '"' + cleanedName + '" — ilginç bir seçim!',
          'Bakalım bu özellik grafikte nasıl görünecek.',
          'Kendi kriterlerini oluşturuyorsun.',
        ]),
        icon: 'success',
        confirmButtonText: 'Evet',
      });
    } else if (customCount >= 4 && now - (lastAlertRef.current.manyAdd ?? 0) > 12000) {
      lastAlertRef.current.manyAdd = now;
      Swal.fire({
        title: pickRandom([
          'Çok fazla özellik!',
          'Bu kadar detaylı mı?',
          'Mükemmeliyetçi misin?',
        ]),
        text: pickRandom([
          'Liste uzadıkça bulması zorlaşıyor.',
          'Biraz sadeleştir belki?',
          'Bu kriterlere uyan biri var mı acaba?',
        ]),
        icon: 'info',
        confirmButtonText: 'Tamam',
      });
    }
  };

  useEffect(() => {
    if (visibleFeatures.length === 0) return;
    const allTen = visibleFeatures.every((f) => f.level === 10);
    const allZero = visibleFeatures.every((f) => f.level === 0);
    const allFive = visibleFeatures.every((f) => f.level === 5);
    const now = Date.now();
    if (allTen && visibleFeatures.length >= 3 && now - (lastAlertRef.current.allTen ?? 0) > 10000) {
      lastAlertRef.current.allTen = now;
      Swal.fire({
        title: pickRandom([
          'Allah kolaylık versin!',
          'Bunu gerçekten hak ettiğine emin misin?',
          'Böyle birini bulmak zor...',
          'Hayalperest misin?',
        ]),
        text: pickRandom([
          'Böyle birini bulmak zor, biliyorsun değil mi?',
          '10/10 her şeyde? Gerçekçi olalım.',
          'Bu kriterlere uyan biri varsa hemen evlen.',
          'Piyangoyu da kontrol et, belki şanslısındır.',
        ]),
        icon: 'question',
        confirmButtonText: 'Haklısın',
      });
    }
    if (allZero && visibleFeatures.length >= 3 && now - (lastAlertRef.current.allZero ?? 0) > 10000) {
      lastAlertRef.current.allZero = now;
      Swal.fire({
        title: pickRandom([
          'Biraz kendine güven?',
          'Bu kadar mı düşük?',
          'Hepsi sıfır mı?',
        ]),
        text: pickRandom([
          'En azından bir tanesini yukarı çek.',
          'Kendine haksızlık etme.',
          'Biraz optimist ol.',
        ]),
        icon: 'info',
        confirmButtonText: 'Tamam',
      });
    }
    if (allFive && visibleFeatures.length >= 5 && now - (lastAlertRef.current.allFive ?? 0) > 12000) {
      lastAlertRef.current.allFive = now;
      Swal.fire({
        title: 'Ortayolcu!',
        text: pickRandom([
          "Her şey 5'te. Kararsız mısın?",
          "Ne çok ne az, tam ortası. Dengeli.",
          "5'te bırakmak da bir tercih.",
        ]),
        icon: 'info',
        confirmButtonText: 'Öyle',
      });
    }
  }, [visibleFeatures]);

  const removeFeature = (id: number) => {
    setFeatures((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (prev.length >= 1 && next.length === 0) {
        const now = Date.now();
        if (now - (lastAlertRef.current.deleteAll ?? 0) > 5000) {
          lastAlertRef.current.deleteAll = now;
          Swal.fire({
            title: 'Sıfırdan mı başlıyoruz?',
            text: 'Tüm özellikleri sildin. Yeni bir sayfa!',
            icon: 'info',
            confirmButtonText: 'Evet',
          });
        }
      }
      return next;
    });
  };

  const suggestedProfile: Feature[] = [
    { id: -1, name: 'Saygılı', level: 9 },
    { id: -2, name: 'Güvenilir', level: 9 },
    { id: -3, name: 'Duygusal zeka', level: 8 },
    { id: -4, name: 'Zeka', level: 8 },
    { id: -5, name: 'Sorumluluk sahibi', level: 9 },
    { id: -6, name: 'İletişim gücü', level: 8 },
    { id: -7, name: 'Empati', level: 8 },
    { id: -8, name: 'Mizah anlayışı', level: 8 },
    { id: -9, name: 'Çalışkanlık', level: 8 },
    { id: -10, name: 'Sadakat', level: 9 },
    { id: -11, name: 'Kişisel bakım', level: 8 },
    { id: -12, name: 'Cinsel uyum', level: 7 },
    { id: -13, name: 'Güç / Fizik', level: 6 },
    { id: -14, name: 'Para / Zenginlik', level: 6 },
    { id: -15, name: 'Boy', level: 6 },
    { id: -16, name: 'Kas', level: 6 },
    { id: -17, name: 'Yemek yapma', level: 7 },
    { id: -18, name: 'Ev işleri', level: 7 },
    { id: -19, name: 'Araba', level: 5 },
    { id: -20, name: 'Gavatlık', level: 1 },
    { id: -21, name: 'PC oyunları', level: 6 },
    { id: -22, name: 'Cömertlik', level: 8 },
    { id: -23, name: 'Sabır', level: 8 },
    { id: -24, name: 'Sosyal medya kullanımı', level: 1 },
    { id: -25, name: 'Yakışıklılık', level: 1 },
    { id: -26, name: 'Erillik', level: 6 },
    { id: -27, name: 'Centilmenlik', level: 8 },
  ];

  const showIdealProfile = async () => {
    const featuresKey = JSON.stringify(features.map((f) => ({ name: f.name, level: f.level })));
    const cached = aiProfileCacheRef.current;
    if (cached?.featuresKey === featuresKey) {
      const aiText = (cached.rawText || '').replace(/\n/g, '<br>');
      const rawText = cached.rawText;
      Swal.fire({
        title: 'İdeal Erkek Profili',
        html: `
          <div style="text-align: left; line-height: 1.5; color: #334155; margin: 0; padding: 0;">
            <p style="margin: 0 0 6px; white-space: pre-wrap;">${aiText}</p>
            <hr style="margin: 6px 0; border-color: #e2e8f0;">
            <p style="font-size: 0.9em; margin: 0 0 4px;">Önerilen profili uygulamak ister misin?</p>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
              <button type="button" id="copy-text-btn" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;box-shadow:0 2px 10px rgba(6,182,212,0.3);">📋 Yazı olarak kopyala</button>
            </div>
          </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Bunu uygula',
        cancelButtonText: 'Kendim ayarlayacağım',
        confirmButtonColor: '#06b6d4',
        customClass: { popup: 'swal-fullscreen' },
        didOpen: () => {
          document.getElementById('copy-text-btn')?.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(rawText);
              showToast('Kopyalandı!');
            } catch {
              showToast('Kopyalanamadı');
            }
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const withIds = suggestedProfile.map((f, i) => ({
            ...f,
            id: Date.now() + i,
          }));
          setFeatures(withIds);
          Swal.fire({
            title: 'Profil uygulandı!',
            text: 'Bass ayarlarını istersen daha da ince ayar yapabilirsin.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
      return;
    }

    Swal.fire({
      title: 'AI düşünüyor...',
      html: 'Profilin analiz ediliyor, bir saniye.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch('/api/ideal-erkek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: features.map((f) => ({ name: f.name, level: f.level })),
          type: 'profile',
          isOzge: isOzge === true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI yanıtı alınamadı');
      }

      const rawText = data.text || '';
      aiProfileCacheRef.current = { featuresKey, rawText };
      const aiText = (rawText || '').replace(/\n/g, '<br>');

      Swal.fire({
        title: 'İdeal Erkek Profili',
        html: `
          <div style="text-align: left; line-height: 1.5; color: #334155; margin: 0; padding: 0;">
            <p style="margin: 0 0 6px; white-space: pre-wrap;">${aiText}</p>
            <hr style="margin: 6px 0; border-color: #e2e8f0;">
            <p style="font-size: 0.9em; margin: 0 0 4px;">Önerilen profili uygulamak ister misin?</p>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
              <button type="button" id="copy-text-btn" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;box-shadow:0 2px 10px rgba(6,182,212,0.3);">📋 Yazı olarak kopyala</button>
            </div>
          </div>
        `,
        icon: 'info',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Bunu uygula',
        cancelButtonText: 'Kendim ayarlayacağım',
        confirmButtonColor: '#06b6d4',
        customClass: { popup: 'swal-fullscreen' },
        didOpen: () => {
          document.getElementById('copy-text-btn')?.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(rawText);
              showToast('Kopyalandı!');
            } catch {
              showToast('Kopyalanamadı');
            }
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const withIds = suggestedProfile.map((f, i) => ({
            ...f,
            id: Date.now() + i,
          }));
          setFeatures(withIds);
          Swal.fire({
            title: 'Profil uygulandı!',
            text: 'Bass ayarlarını istersen daha da ince ayar yapabilirsin.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Bağlantı hatası';
      const isNoKey = errorMsg.includes('GEMINI_API_KEY');

      Swal.fire({
        title: isNoKey ? 'API Key Kurulumu' : 'AI Kullanılamadı',
        showCloseButton: true,
        html: isNoKey
          ? `
            <p style="color: #334155; margin-bottom: 12px;">İdeal erkek önerisi için Gemini API key gerekiyor.</p>
            <ol style="text-align: left; color: #334155; margin: 12px 0; padding-left: 20px;">
              <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> adresine git</li>
              <li>Ücretsiz API key oluştur</li>
              <li>Proje kökünde <code>.env.local</code> oluştur</li>
              <li>İçine <code>GEMINI_API_KEY=your_key</code> yaz</li>
            </ol>
            <p style="margin-top: 12px; font-size: 0.9em;">Şimdilik statik öneri kullanayım mı?</p>
          `
          : `<p style="color: #334155;">${errorMsg}</p><p style="margin-top: 12px; font-size: 0.9em;">Statik öneri kullanayım mı?</p>`,
        icon: isNoKey ? 'info' : 'warning',
        showCancelButton: true,
        confirmButtonText: 'Statik öneri göster',
        cancelButtonText: 'Kapat',
        confirmButtonColor: '#06b6d4',
      }).then((result) => {
        if (result.isConfirmed) {
          showStaticIdealProfile();
        }
      });
    }
  };

  const showStaticIdealProfile = () => {
    Swal.fire({
      title: 'İdeal Erkek Profili',
      showCloseButton: true,
      html: `
        <div style="text-align: left; line-height: 1.5; color: #334155; margin: 0; padding: 0;">
          <p style="margin: 0 0 6px;"><strong>Bir erkekte hangi özellik ne kadar olmalı?</strong></p>
          <p style="margin: 0 0 6px;">İdeal bir erkek profili dengeli olmalı. Temel değerler yüksek, bazı şeyler düşük kalmalı.</p>
          <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.95em;">
            <li><strong>Saygılı, Güvenilir, Sadakat (9):</strong> İlişkinin temeli.</li>
            <li><strong>Zeka, Duygusal zeka (8):</strong> Hem akıllı hem duygusal olmalı.</li>
            <li><strong>Cinsel uyum (7):</strong> Önemli ama tek kriter değil.</li>
            <li><strong>Güç, Boy, Kas (6):</strong> Biraz olsun yeter.</li>
            <li><strong>Para, Araba (5-6):</strong> Para her şey değil.</li>
            <li><strong>Yemek, Ev işleri (7):</strong> Kendi ayakları üzerinde durabilmeli.</li>
            <li><strong>Gavatlık (1):</strong> Mümkünse sıfıra yakın olsun.</li>
            <li><strong>PC oyunları (6):</strong> Oyun oynasın ama seni de dinlesin.</li>
            <li><strong>Sosyal medya takibi (0-1):</strong> Bu özellik düşük kalsın.</li>
          </ul>
          <p style="margin: 6px 0 4px; font-size: 0.9em;">Ekleyebileceğin özellikler: <em>Liderlik, Kıskançlık, Netflix paylaşımı, Aile değerleri</em></p>
          <p style="margin: 0 0 4px; font-size: 0.9em;">Bu profili uygulamak ister misin?</p>
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <button type="button" id="copy-text-static-btn" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;box-shadow:0 2px 10px rgba(6,182,212,0.3);">📋 Yazı olarak kopyala</button>
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Bunu uygula',
      cancelButtonText: 'Kendim ayarlayacağım',
      confirmButtonColor: '#06b6d4',
      customClass: { popup: 'swal-fullscreen' },
      didOpen: () => {
        document.getElementById('copy-text-static-btn')?.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(STATIC_PROFILE_TEXT);
            showToast('Kopyalandı!');
          } catch {
            showToast('Kopyalanamadı');
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const withIds = suggestedProfile.map((f, i) => ({
          ...f,
          id: Date.now() + i,
        }));
        setFeatures(withIds);
        Swal.fire({
          title: 'Profil uygulandı!',
          text: 'Bass ayarlarını istersen daha da ince ayar yapabilirsin.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
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

    Swal.fire({
      title: pickRandom([
        'İndirildi!',
        'Grafik hazır!',
        'Başarılı!',
      ]),
      text: pickRandom([
        "Bu grafiği Tinder bio'na ekleyebilirsin.",
        'İdeal erkeğini bulmana yardımcı olsun.',
        'Artık kriterlerin elinde!',
        'Bunu birine göster, ne diyecek merak ettim.',
        'PDF\'e çevirip CV\'ye ekleme sakın.',
      ]),
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
    });
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
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">İdeal Erkek</h1>
            <p className="text-slate-300">
              Karakteristik özelliklerin bass seviyesini 0-10 arası ayarla ve son
              grafiği indir.
            </p>
          </div>
          <Link
            href="/partner-analiz"
            className="shrink-0 rounded-xl border border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            Şu anki partnerini analiz et →
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addFeature();
            }}
            placeholder="Yeni özellik ekle (ör: liderlik, kıskançlık, Netflix paylaşımı)"
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
            onClick={() => {
              const next = !isDeleteMode;
              if (next && features.length > 0) {
                const now = Date.now();
                if (now - (lastAlertRef.current.deleteMode ?? 0) > 20000) {
                  lastAlertRef.current.deleteMode = now;
                  Swal.fire({
                    title: pickRandom([
                      'Silme modu!',
                      'Birileri çıkacak listeden!',
                    ]),
                    text: pickRandom([
                      '× işaretine tıklayarak özellikleri sil.',
                      'Hangi kriterler fazla, sen bilirsin.',
                    ]),
                    icon: 'warning',
                    timer: 2500,
                    showConfirmButton: false,
                  });
                }
              }
              setIsDeleteMode(next);
            }}
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
              {visibleFeatures.map((item) => (
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
            {(hasMoreFeatures || canShowLess) && (
              <div className="flex gap-2 mt-4">
                {hasMoreFeatures && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 8, features.length))}
                    className="flex-1 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-sm"
                  >
                    Daha fazla özellik (+{Math.min(8, features.length - visibleCount)})
                  </button>
                )}
                {canShowLess && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.max(prev - 8, 8))}
                    className="flex-1 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-sm"
                  >
                    Daha az özellik
                  </button>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={showIdealProfile}
              className="w-full mt-3 py-3 rounded-xl border border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-medium transition-colors cursor-pointer text-sm"
            >
              İdeal erkeğim sence nasıl olmalı?
            </button>
          </div>

          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-5 md:p-7">
            <h2 className="text-xl font-semibold mb-4">Canlı Bass Grafiği</h2>
            <div className="space-y-3">
              {visibleFeatures.map((item) => (
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
