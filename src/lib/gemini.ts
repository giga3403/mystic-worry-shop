import type { Receipt, WorryFormData, ReceiptItem, ReceiptDiscount } from '../types';
import { CATEGORY_MAP } from '../utils/receiptGenerator';

const GEMINI_STORAGE_KEY = 'mystic_worry_gemini_key';

export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (envKey) return envKey;
  try {
    return localStorage.getItem(GEMINI_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save Gemini key', e);
  }
}

export function hasGeminiKey(): boolean {
  return Boolean(getGeminiApiKey());
}

// 1. Gemini AI를 활용한 초개인화 영수증 분석 생성
export async function generateReceiptWithGemini(formData: WorryFormData): Promise<Receipt | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const prompt = `
당신은 '신비한 고민 상점(The Mystic Worry Shop)'의 따뜻하고 신비로운 주인장 '루미나'입니다.
여행자가 밤하늘 상점에 찾아와 다음과 같은 고민을 털어놓았습니다:

- 여행자 호칭: ${formData.customer_name || '익명의 여행자'}
- 고민 분류: ${CATEGORY_MAP[formData.category]?.label || formData.category}
- 털어놓은 고민 내용: "${formData.worry_content}"
- 마음의 무게: ${formData.worry_weight}g

위 고민 내용을 매우 깊이 공감하고 정밀 분석하여, 사용자가 적은 고민 속의 구체적인 상황/단어/감정을 반영한 '마음 정산 영수증' 데이터를 JSON으로 작성해주세요.

반드시 아래 JSON 형식으로만 응답해주세요 (마크다운 백틱 없이 순수 JSON만 반환):
{
  "items": [
    {
      "name": "사용자 고민 내용에서 직접 추출한 구체적인 걱정/불안/상황 (예: '팀장님 앞 PT 발표 공포', '읽씹 당한 뒤 자책 3회')",
      "qty": 1,
      "emotionalCost": "-280 kcal (마음 에너지)"
    },
    {
      "name": "고민과 직결된 두 번째 심리적 부담/신체 반응",
      "qty": 1,
      "emotionalCost": "-190 kcal (마음 에너지)"
    },
    {
      "name": "고민과 직결된 세 번째 과부하 요소",
      "qty": 2,
      "emotionalCost": "-310 kcal (마음 에너지)"
    }
  ],
  "subtotal": "소모된 총 마음 에너지 780 kcal",
  "discounts": [
    {
      "name": "사용자의 그 특정 고민을 시원하게 해소해 주는 맞춤 탕감 할인 (예: '발표 끝나면 아무도 기억 못함 쿠폰')",
      "amount": "-100% 전액 탕감"
    },
    {
      "name": "사용자의 상황에 딱 맞는 두 번째 위로 할인 (예: '실수해도 괜찮다는 안전지대 보장')",
      "amount": "-100% 전액 탕감"
    }
  ],
  "remedy_title": "사용자가 작성한 고민의 핵심 주제를 직접 언급하는 시적이고 따뜻한 처방전 제목 (15자 내외)",
  "remedy_desc": "사용자가 적은 고민 상황에 대해 깊은 공감과 현실적이면서도 다정한 위로를 건네는 상점 주인장의 편지글 (3~4문장)",
  "lucky_item": "사용자의 그 고민을 달래줄 수 있는 구체적인 위로 아이템 (예: '따뜻한 카모마일 티', '폭신한 이어플러그')",
  "lucky_color": "그 사람의 마음에 어울리는 시적인 색상 이름 (예: '새벽 별빛 네이비', '다정한 살구빛 코랄')",
  "spell": "사용자에게 힘이 되어줄 짧은 마법의 한 마디"
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return null;
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);

    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    const barcode = `2026-${randomDigits()}-${randomDigits()}-${randomDigits()}`;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `receipt-${Date.now()}`;

    const catConfig = CATEGORY_MAP[formData.category] || CATEGORY_MAP.daily;

    const receiptItems: ReceiptItem[] = (parsed.items || []).map((it: any, idx: number) => ({
      id: `ai-item-${idx}`,
      name: it.name || '마음의 짐',
      qty: it.qty || 1,
      emotionalCost: it.emotionalCost || '-200 kcal'
    }));

    const receiptDiscounts: ReceiptDiscount[] = (parsed.discounts || []).map((d: any, idx: number) => ({
      id: `ai-disc-${idx}`,
      name: d.name || '상점 특별 탕감 할인',
      amount: d.amount || '-100% 전액 탕감'
    }));

    return {
      id,
      created_at: new Date().toISOString(),
      customer_name: formData.customer_name.trim() || '익명의 여행자',
      category: formData.category,
      category_label: catConfig.label,
      worry_content: formData.worry_content,
      worry_weight: formData.worry_weight,
      worry_weight_unit: formData.worry_weight > 100 ? 'kg' : 'g',
      worry_expiry: formData.worry_expiry,
      spell: parsed.spell || formData.spell,

      items: receiptItems.length > 0 ? receiptItems : [
        { id: '1', name: `"${formData.worry_content.substring(0, 15)}..."에 대한 부담감`, qty: 1, emotionalCost: '-300 kcal' }
      ],
      subtotal: parsed.subtotal || '마음 에너지 750 kcal 소모',
      discounts: receiptDiscounts.length > 0 ? receiptDiscounts : [
        { id: '1', name: '상점 주인의 무조건적인 지지 쿠폰', amount: '-100% 전액 탕감' }
      ],
      final_price: '0 원 (상점 주인이 전액 대납)',
      payment_method: '따뜻한 마음 & AI 특별 구호 기금',

      remedy_title: parsed.remedy_title || `당신의 무거운 마음에 전하는 편지`,
      remedy_desc: parsed.remedy_desc || `당신이 적어주신 이야기("${formData.worry_content.substring(0, 25)}...")를 상점이 소중히 품었습니다. 오늘 밤은 안심하고 편히 쉬세요.`,
      lucky_item: parsed.lucky_item || '달콤한 꿀차 한 잔',
      lucky_color: parsed.lucky_color || '은은한 달빛 라벤더',
      barcode_number: barcode,

      likes_count: 0,
      is_public: formData.is_public
    };
  } catch (err) {
    console.warn('Gemini generate error, falling back to local extractor:', err);
    return null;
  }
}
