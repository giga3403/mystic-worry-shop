import type { Receipt, WorryCategory, WorryFormData, ReceiptItem, ReceiptDiscount } from '../types';

export const CATEGORY_MAP: Record<WorryCategory, { label: string; icon: string; defaultItems: string[]; discounts: string[]; remedies: { title: string; desc: string }[] }> = {
  relationship: {
    label: '인간관계',
    icon: '👥',
    defaultItems: [
      '상대방의 표정 과대해석',
      '말실수했을까 봐 3번 곱씹기',
      '착한 사람 증후군',
      '모두를 만족시키려는 욕심',
      '읽씹에 대한 섭섭함'
    ],
    discounts: [
      '미움받을 용기 특별 할인',
      '남들도 내 생각만큼 나에게 관심 없음 쿠폰',
      '나를 진심으로 아끼는 사람 1명으로 충분함 페이백'
    ],
    remedies: [
      {
        title: '당신은 모두에게 좋은 사람일 필요가 없습니다',
        desc: '모든 사람의 파도에 흔들릴 필요는 없어요. 당신의 바다는 당신만의 온도로 지켜내면 됩니다. 오늘 밤엔 그 사람의 마음 대신, 지친 내 마음의 문을 먼저 두드려주세요.'
      },
      {
        title: '적당한 거리두기가 만드는 온기',
        desc: '난로처럼 너무 가까우면 데이고, 너무 멀면 춥습니다. 알맞은 거리를 둘 때 비로소 서로의 따스함이 보여요. 억지로 맞추려 애쓰지 않아도 머물 사람은 곁에 남습니다.'
      }
    ]
  },
  career: {
    label: '진로 / 미래',
    icon: '🧭',
    defaultItems: [
      '불확실한 미래에 대한 불안 500g',
      '남들과의 은근한 비교 의식',
      '뒤처지고 있다는 조급함 1박스',
      '완벽한 결과를 향한 강박',
      '선택의 기로에서 오는 망설임'
    ],
    discounts: [
      '인생은 속도가 아니라 방향 할인',
      '오늘 하루 버텨낸 것만으로 이미 100점 쿠폰',
      '보이지 않는 곳에서 자라나는 뿌리 페이백'
    ],
    remedies: [
      {
        title: '느려도 괜찮습니다, 길을 잃지 않는다면',
        desc: '대나무는 몇 년 동안 땅속에서 뿌리만 내리다가 어느 순간 하루에 수십 센티씩 자라납니다. 지금 당신은 멈춰있는 게 아니라, 더 깊고 튼튼하게 뿌리를 내리는 중입니다.'
      },
      {
        title: '작은 발걸음 하나가 지도를 바꿉니다',
        desc: '거대한 내일은 생각하지 마세요. 오늘 당장 마실 따뜻한 물 한 잔, 가벼운 스트레칭 하나가 내일의 기적을 만드는 가장 현실적인 시작입니다.'
      }
    ]
  },
  mental: {
    label: '내면 / 멘탈',
    icon: '🌙',
    defaultItems: [
      '새벽 감성의 꼬리물기 생각 3kg',
      '나 자신을 향한 무자비한 자책',
      '이유 모를 공허함과 무기력 1스푼',
      '감정을 억누르는 습관',
      '과거의 후회 리플레이 2회'
    ],
    discounts: [
      '상점 주인의 무조건적인 지지 쿠폰',
      '실수해도 세상은 무너지지 않음 할인',
      '따뜻한 이불 속 안전지대 100% 무료 제공'
    ],
    remedies: [
      {
        title: '오늘 하루도 정말 애쓰셨습니다',
        desc: '누구보다 스스로에게 가장 엄격했던 당신, 오늘은 그 짐을 내려놓고 자신에게 "괜찮아, 고생했어"라고 말해주세요. 상점의 달빛이 당신의 지친 밤을 포근히 덮어줄 거예요.'
      },
      {
        title: '비가 와야 숲이 자라나듯',
        desc: '울적한 날도 삶의 계절 중 하나일 뿐입니다. 억지로 밝아지려 하지 않아도 괜찮아요. 슬픔을 가만히 안아주고 나면, 마음속에 맑은 무지개가 뜰 거예요.'
      }
    ]
  },
  work: {
    label: '학업 / 일',
    icon: '💼',
    defaultItems: [
      '끝나지 않는 할 일 목록의 압박',
      '실수에 대한 두려움 400g',
      '마감 기한의 모래시계',
      '번아웃 직전의 뇌 과부하',
      '인정받고 싶은 마음의 무게'
    ],
    discounts: [
      '퇴근 후 영혼 자유 이용권',
      '일은 일일 뿐, 나는 나 할인',
      '주말 늦잠 꿀잠 보장 페이백'
    ],
    remedies: [
      {
        title: '일보다 중요한 건 언제나 당신입니다',
        desc: '회사는, 학교는 당신의 삶을 채우는 조각일 뿐 삶의 전부가 아닙니다. 방전된 배터리로는 어떤 좋은 기계도 돌릴 수 없어요. 지금은 충분한 충전이 최고의 해결책입니다.'
      }
    ]
  },
  money: {
    label: '재정 / 현실',
    icon: '🪙',
    defaultItems: [
      '텅장 잔고를 보며 느끼는 한숨',
      '예상치 못한 지출에 대한 스트레스',
      '풍요로운 사람들을 향한 부러움',
      '돈에 얽매이는 팍팍한 일상'
    ],
    discounts: [
      '돈으로 살 수 없는 소소한 행복 쿠폰',
      '가장 귀한 자산은 건강한 당신 자신 할인',
      '풍요의 씨앗 페이백'
    ],
    remedies: [
      {
        title: '부유함은 마음의 여백에서 시작됩니다',
        desc: '지금은 조금 팍팍하게 느껴져도, 당신이 가진 지혜와 성실함은 결코 사라지지 않는 가장 든든한 통장입니다. 햇살을 쬐고 바람을 느끼는 사치는 오늘 당신에게 완전 무료입니다.'
      }
    ]
  },
  daily: {
    label: '일상의 소소한 고민',
    icon: '✨',
    defaultItems: [
      '오늘 뭐 먹지 30분 고민',
      '사소한 계획 어그러짐에 대한 짜증',
      '밀린 빨래와 어지러운 방',
      'SNS 보다 흘러간 1시간의 죄책감'
    ],
    discounts: [
      '오늘 하루 대충 살기 면제부',
      '맛있는 간식 한 입 행복 쿠폰',
      '내일 치우면 되지 쿨한 할인'
    ],
    remedies: [
      {
        title: '완벽하지 않은 하루가 주는 편안함',
        desc: '가끔은 아무것도 계획대로 되지 않는 날이 있어야 인생에 예상치 못한 선물도 찾아옵니다. 오늘 밤엔 맛있는 야식 하나 먹고 푹 주무세요!'
      }
    ]
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

export function generateReceiptFromWorry(formData: WorryFormData): Receipt {
  const catConfig = CATEGORY_MAP[formData.category] || CATEGORY_MAP.daily;
  
  const shuffledItems = [...catConfig.defaultItems].sort(() => 0.5 - Math.random());
  const selectedItemNames = shuffledItems.slice(0, 3);
  
  const items: ReceiptItem[] = selectedItemNames.map((name, idx) => {
    const cost = Math.floor(Math.random() * 250) + 150;
    return {
      id: `item-${idx}`,
      name,
      qty: Math.floor(Math.random() * 2) + 1,
      emotionalCost: `-${cost} kcal (마음 에너지)`
    };
  });
  
  const discounts: ReceiptDiscount[] = catConfig.discounts.map((dName, idx) => ({
    id: `disc-${idx}`,
    name: dName,
    amount: '-100% 전액 탕감'
  }));

  const remedy = catConfig.remedies[Math.floor(Math.random() * catConfig.remedies.length)] || catConfig.remedies[0];
  const luckyItem = LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)];
  const luckyColor = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)];
  
  const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
  const barcode = `2026-${randomDigits()}-${randomDigits()}-${randomDigits()}`;
  
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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
    subtotal: '마음 에너지 680 kcal 소모',
    discounts,
    final_price: '0 원 (상점 주인이 전액 대납)',
    payment_method: '따뜻한 마음 & 상점 특별 구호 기금',
    
    remedy_title: remedy.title,
    remedy_desc: remedy.desc,
    lucky_item: luckyItem,
    lucky_color: luckyColor,
    barcode_number: barcode,
    
    likes_count: 0,
    is_public: formData.is_public
  };
}
