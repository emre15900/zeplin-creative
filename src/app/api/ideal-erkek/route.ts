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
    const { features, type = 'profile' } = body as {
      features: Feature[];
      type?: 'profile' | 'comment' | 'suggest';
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const featuresText = features
      .map((f) => `- ${f.name}: ${f.level}/10`)
      .join('\n');

    let prompt = '';

    if (type === 'profile') {
      prompt = `Sen eğlenceli ve samimi bir ilişki danışmanısın. Türkçe yanıt ver.

Kullanıcının ideal erkek profilindeki özellikler ve bass seviyeleri (0-10):
${featuresText}

Bu profile göre doğal akıcı paragraflar halinde yaz. Başlık, madde işareti veya "**...:**" gibi formatlar KULLANMA. Sadece düz metin, sanki bir arkadaşına konuşuyormuşsun gibi.

İçerik: Kısa esprili değerlendirme, hangi özellikleri yükseltip düşürmesi gerektiği (sayılarla), ekleyebileceği 2-3 özellik, genel tavsiye. Hepsi akıcı paragraflar halinde, başlıksız.`;
    } else if (type === 'comment') {
      prompt = `Sen eğlenceli bir ilişki danışmanısın. Türkçe yanıt ver.

Kullanıcının ideal erkek profilindeki özellikler:
${featuresText}

Bu bass ayarlarına göre 1-2 cümlelik esprili, samimi bir yorum yap. Ne çok ciddi ne çok saçma olsun.`;
    } else {
      prompt = `Sen eğlenceli bir ilişki danışmanısın. Türkçe yanıt ver.

Kullanıcının mevcut özellikleri:
${featuresText}

Ekleyebileceği 3-4 yaratıcı ve esprili özellik öner. Her biri için kısa açıklama yap.`;
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
