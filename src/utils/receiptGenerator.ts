import type { Receipt, WorryCategory, WorryFormData, ReceiptItem, ReceiptDiscount } from '../types';

export const CATEGORY_MAP: Record<WorryCategory, { label: string; icon: string; defaultDiscounts: string[] }> = {
  relationship: {
    label: '인간관계',
    icon: '👥',
    defaultDiscounts: ['미움받을 용기 특별 할인', '남의 시선에서 자유로워지는 쿠폰', '나를 아끼는 1인 페이백']
  },
  career: {
    label: '진로 / 미래',
    icon: '🧭',
    defaultDiscounts: ['인생은 속도가 아니라 방향 할인', '보이지 않는 곳에서 자라는 뿌리 쿠폰', '오늘 하루 버틴 것만으로 100점 페이백']
  },
  mental: {
    label: '내면 / 멘탈',
    icon: '🌙',
    defaultDiscounts: ['상점 주인의 무조건적인 지지 쿠폰', '실수해도 세상은 무너지지 않음 할인', '따뜻한 이불 속 안전지대 100% 무료 제공']
  },
  work: {
    label: '학업 / 일',
    icon: '💼',
    defaultDiscounts: ['퇴근 후 영혼 자유 이용권', '일은 일일 뿐, 나는 나 할인', '내일의 해결 능력을 믿는 쿠폰']
  },
  money: {
    label: '재정 / 현실',
    icon: '🪙',
    defaultDiscounts: ['돈으로 살 수 없는 소소한 행복 쿠폰', '건강한 내가 가장 큰 자산 할인', '풍요의 씨앗 페이백']
  },
  daily: {
    label: '일상의 소소한 고민',
    icon: '✨',
    defaultDiscounts: ['오늘 하루 대충 살기 면제부', '맛있는 간식 한 입 행복 쿠폰', '내일 치우면 되지 쿨한 할인']
  }
};

const LUCKY_ITEMS = [
  '포근하고 도톰한 수면양말',
  '달콤 쌉싸름한 핫초코 한 잔',
  '밤하늘에 숨겨진 작은 별똥별',
  '좋아하는 멜로디의 피아노 곡',
  '바람에 바스락거리는 나뭇잎 소리',
  '향기로운 라벤더 차 티백',
  '노을빛으로 물든 창가의 풍경',
  '폭신한 베개와 갓 세탁한 이불'
];

const LUCKY_COLORS = [
  '달빛 라벤더 (Moonlight Lavender)',
  '따스한 밤하늘색 (Midnight Indigo)',
  '포근한 샴페인 골드 (Champagne Gold)',
  '새벽안개 민트 (Dawn Mist Mint)',
  '가을 햇살 앰버 (Autumn Amber)',
  '은하수 로즈 쿼츠 (Rose Quartz Nebula)'
];

// 사용자의 입력 프롬프트 문장에서 핵심 구문 및 키워드를 지능적으로 추출하는 헬퍼
function extractSemanticItemsFromPrompt(prompt: string, _category: WorryCategory): ReceiptItem[] {
  const cleanPrompt = prompt.trim();
  
  // 문장 또는 쉼표/접속사 단위 분해
  const fragments = cleanPrompt
    .split(/[,.\n?!~]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 2);

  const items: ReceiptItem[] = [];

  if (fragments.length >= 2) {
    // 사용자가 적은 문장의 앞/뒤 핵심 구문 직접 변환
    const part1 = fragments[0];
    const part2 = fragments[1];
    const part3 = fragments[2] || `${fragments[0]}에 얽힌 생각들`;

    items.push({
      id: 'local-item-1',
      name: `"${part1.length > 22 ? part1.substring(0, 22) + '...' : part1}"에 대한 부담감`,
      qty: 1,
      emotionalCost: `-240 kcal (마음 에너지)`
    });

    items.push({
      id: 'local-item-2',
      name: `"${part2.length > 22 ? part2.substring(0, 22) + '...' : part2}" 관련 생각 곱씹기`,
      qty: 2,
      emotionalCost: `-190 kcal (마음 에너지)`
    });

    if (fragments.length >= 3) {
      items.push({
        id: 'local-item-3',
        name: `"${part3.length > 20 ? part3.substring(0, 20) + '...' : part3}" 과부하`,
        qty: 1,
        emotionalCost: `-280 kcal (마음 에너지)`
      });
    } else {
      items.push({
        id: 'local-item-3',
        name: `완벽하게 해내야 한다는 마음의 짐`,
        qty: 1,
        emotionalCost: `-220 kcal (마음 에너지)`
      });
    }
  } else {
    // 단일 문장일 때
    items.push({
      id: 'local-item-1',
      name: `"${cleanPrompt.length > 25 ? cleanPrompt.substring(0, 25) + '...' : cleanPrompt}"에 쏟은 에너지`,
      qty: 1,
      emotionalCost: `-320 kcal (마음 에너지)`
    });
    items.push({
      id: 'local-item-2',
      name: `혼자 끙끙 앓으며 고민한 시간`,
      qty: 3,
      emotionalCost: `-210 kcal (마음 에너지)`
    });
    items.push({
      id: 'local-item-3',
      name: `어깨를 짓누르던 책임감과 긴장`,
      qty: 1,
      emotionalCost: `-180 kcal (마음 에너지)`
    });
  }

  return items;
}

// 사용자의 입력 내용에 기반한 개인 맞춤형 처방전 텍스트 생성
function generatePersonalizedRemedy(prompt: string, category: WorryCategory): { title: string; desc: string } {
  const shortSnippet = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;
  
  if (category === 'relationship') {
    return {
      title: `"${shortSnippet}"로 앓고 있는 마음에 부치는 편지`,
      desc: `누군가와의 관계에서 마음을 쓴다는 것은 그만큼 당신이 다정하고 진심인 사람이라는 뜻입니다. 하지만 다른 사람의 마음에 들기 위해 내 마음을 아프게 할 필요는 없어요. 오늘 밤은 타인의 시선 대신, 지친 내 마음에 먼저 따뜻한 온도를 채워주세요.`
    };
  }

  if (category === 'career' || category === 'work') {
    return {
      title: `"${shortSnippet}"의 무게를 견디고 있는 당신에게`,
      desc: `불안하고 떨리는 이유는 당신이 이 일을 소중하게 생각하고 진심을 다하고 있기 때문입니다. 지금 느끼는 압박감은 당신의 능력 부족이 아니라, 한 단계 더 성장하기 위해 거치는 과정일 뿐이에요. 당신은 이미 충분히 잘해왔고, 내일도 무사히 해낼 것입니다.`
    };
  }

  if (category === 'mental') {
    return {
      title: `"${shortSnippet}"의 짐을 내려놓을 시간`,
      desc: `누구보다 스스로에게 가장 엄격했던 당신에게 상점 주인장이 전합니다. 세상의 모든 파도를 혼자 다 막아낼 필요는 없어요. 비가 그치면 땅이 더 굳어지듯, 지금의 지친 감정도 오늘 밤 영수증과 함께 날아가 버릴 것입니다. 오늘은 푹 쉬어도 괜찮습니다.`
    };
  }

  return {
    title: `"${shortSnippet}"에 대한 상점의 따스한 처방`,
    desc: `마음속에 무겁게 자리 잡고 있던 그 생각, 이곳 상점의 계산대에 내려놓으신 순간 이미 절반은 털어내신 것입니다. 지나고 나면 별일 아니었다며 웃어넘길 날이 머지않아 올 테니, 오늘 밤은 가벼운 마음으로 단잠을 청하세요.`
  };
}

export function generateLocalReceiptFromWorry(formData: WorryFormData): Receipt {
  const catConfig = CATEGORY_MAP[formData.category] || CATEGORY_MAP.daily;
  
  // 사용자의 입력 프롬프트 문맥을 직접 분해하여 품목 생성!
  const items: ReceiptItem[] = extractSemanticItemsFromPrompt(formData.worry_content, formData.category);
  
  const discounts: ReceiptDiscount[] = catConfig.defaultDiscounts.map((dName, idx) => ({
    id: `disc-${idx}`,
    name: dName,
    amount: '-100% 전액 탕감'
  }));

  // 사용자 프롬프트 기반 맞춤 처방전
  const remedy = generatePersonalizedRemedy(formData.worry_content, formData.category);
  const luckyItem = LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)];
  const luckyColor = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)];
  
  const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
  const barcode = `2026-${randomDigits()}-${randomDigits()}-${randomDigits()}`;
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `receipt-${Date.now()}`;

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
    spell: formData.spell || '이 또한 부드럽게 지나가리라',
    
    items,
    subtotal: '소모된 마음 에너지 710 kcal',
    discounts,
    final_price: '0 원 (상점 주인이 전액 대납)',
    payment_method: '따뜻한 마음 & 상점 구호 기금',
    
    remedy_title: remedy.title,
    remedy_desc: remedy.desc,
    lucky_item: luckyItem,
    lucky_color: luckyColor,
    barcode_number: barcode,
    
    likes_count: 0,
    is_public: formData.is_public
  };
}
