import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Feature = { name: string; level: number };

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY tanımlı değil. .env.local dosyasına ekleyin.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { features, type, isOzge } = body as {
      features: Feature[];
      type: 'analyze' | 'support';
      isOzge?: boolean;
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const featuresText = features
      .map((f) => `- ${f.name}: ${f.level}/10`)
      .join('\n');

    let prompt = '';

    const hitap = isOzge ? ' Kullanıcıya "Özgecim" diye hitap et.' : '';

    if (type === 'analyze') {
      prompt = `Sen esprili, samimi ama biraz sivri dilli bir ilişki danışmanısın. Türkçe yanıt ver.${hitap}

Kullanıcı (muhtemelen bir kadın) mevcut partnerinin özelliklerini bass seviyeleriyle girmiş:
${featuresText}

Partner analizi yap. Ama aynı zamanda bunu yazan kişiye de hafifçe sataş: Mükemmel erkek yaratmaya çalışıyor ama kendisi mükemmel mi? Kendi eksikliklerini tamamen kapatıyor mu? İlişkide tek taraflı beklenti mi var? Bunu esprili, incitmeden ama dürüst bir dille söyle.

ÖNEMLİ: Yanıtının sonuna, kullanıcıya (kadına) yumuşak ve samimi bir tonla şu tarz tavsiyeler ekle: Açık giyiniyorsa buna dikkat etmesi, erkeğinin sözünü dinlemesi, ona erkek olduğunu hissettirmesi, lafını ikiletmemesi gibi konularda nazikçe öneriler sun. Bunu vaaz vermeden, arkadaşça bir tavırla, "belki şunlara da dikkat edebilirsin" havasında yaz. İnciticilikten kaçın.

Doğal akıcı paragraflar halinde yaz. Başlık veya madde işareti KULLANMA. Partnerin güçlü/zayıf yanları, genel değerlendirme, "sen de kendine bak" mesajı ve kıza yumuşak tavsiyeler. Hafif, samimi, bazen iğneleyici ama eğlenceli.`;
    } else {
      prompt = `Sen esprili ve samimi bir ilişki danışmanısın. Türkçe yanıt ver.${hitap}

Kullanıcı partnerinin eksikliklerini gidermesi için destek istiyor. Partnerin özellikleri:
${featuresText}

Partnerine nasıl destek olabileceğini, hangi konularda birlikte gelişebileceklerini yaz. Ama yine de hafifçe sataş: "Partnerini değiştirmeye çalışırken kendin de biraz değişmeye hazır mısın?" tarzı. İkisi de gelişsin mesajı ver. Esprili, samimi, bazen iğneleyici.

Doğal paragraflar, başlık yok.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      {
        error: 'AI yanıtı alınamadı.',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}
