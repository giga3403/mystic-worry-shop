# ✧ 신비한 고민 상점의 영수증 - 주요 구현 내용 상세 정리

> **프로젝트 위치**: `C:\Project\mystic-worry-shop`  
> **기술 스택**: React (TypeScript), Vite, Supabase (`@supabase/supabase-js`), HTML5 Canvas (`canvas-confetti`), `html-to-image`, Vanilla CSS (Custom Design System)  
> **로컬 실행 주소**: `http://localhost:5173/`

---

## 1. 개요 및 기획 콘셉트

- **핵심 콘셉트**: "흘려보내지 못한 생각은 마음에 쌓여 돌이 되지만, 털어놓은 고민은 바람을 타고 날아갑니다."
- 사용자가 밤하늘 아래 마법 상점의 주인장 '루미나'에게 마음의 짐과 고민을 털어놓으면, 이를 감정 품목별로 분해하고 특별 위로 할인을 적용하여 **최종 결제 금액 0원의 실물 감성 영수증**으로 정산·발급해 주는 힐링 인터랙티브 웹 서비스입니다.

---

## 2. 주요 구현 기능 및 상세 아키텍처

### 📜 1) 실물 감성 영수증 (Authentic Receipt Experience)
- **비주얼 텍스처 & 절취선**:
  - 실제 영수증 감열지(Thermal Paper) 특유의 은은한 크림 톤(`var(--receipt-bg)`) 질감 구현.
  - 상단 및 하단에 CSS 라디얼 그래디언트를 활용한 정교한 **지그재그 톱니 절취선(Sawtooth Perforated Border)** 배치.
  - 상점 영문 타이틀(`MYSTIC WORRY SHOP & REPOSITORY`), 고유 시리얼 바코드 번호, 날짜, 고객 닉네임 표기.
- **인쇄 애니메이션**:
  - 영수증 발급 시 실제 인쇄기에서 영수증이 밀려 나오는 듯한 `@keyframes slideDownFromPrinter` 슬라이딩 모션.
  - 인쇄 완료 시 축하 및 정산 완료를 알리는 마법 가루 파티클 효과(`canvas-confetti`).
- **앤틱 고무 직인 도장**:
  - `[ 털어냄 완료 / DISCHARGED ]` 붉은색 빈티지 스탬프가 -16도 기울어진 각도로 영수증 우측 하단에 날인되어 고민의 해소를 시각적으로 선사.

---

### 🔮 2) 지능형 고민 정산 엔진 (`src/utils/receiptGenerator.ts`)
- **6대 고민 카테고리 매핑**:
  - `relationship` (인간관계): 상대방 표정 과대해석, 읽씹 섭섭함 등 분해
  - `career` (진로/미래): 불확실한 미래 불안, 타인과의 비교 의식 등 분해
  - `mental` (내면/멘탈): 새벽 감성 꼬리물기 생각, 자책감 등 분해
  - `work` (학업/일): 번아웃 직전 과부하, 마감 압박 등 분해
  - `money` (재정/현실): 텅장 한숨, 풍요에 대한 부러움 등 분해
  - `daily` (소소한 걱정): 오늘 뭐 먹지, 사소한 삐걱거림 등 분해
- **감정 청구 비용 및 100% 탕감 시스템**:
  - 고민에 소모된 마음 에너지를 산출 (예: `마음 에너지 -680 kcal`, `오늘 하루 -4시간`).
  - 상점 특별 탕감 할인 쿠폰을 자동 적용:
    - *'미움받을 용기 특별 할인'*, *'인생은 속도가 아니라 방향 쿠폰'*, *'상점 주인의 무조건적인 지지'* 등.
  - **최종 결제 금액**: **`0 원 (상점 주인이 전액 대납)`** 으로 처리하여 심리적 안도감 제공.
- **개인 맞춤형 처방전 & 행운의 부적**:
  - 문학적 감성의 고운 바탕(Gowun Batang) 서체로 쓰여진 상점 주인의 비밀 위로 조언.
  - 오늘 밤의 부적 아이템(따뜻한 차, 폭신한 양말 등) 및 행운의 컬러, 사용자 지정 마법 주문 각인.

---

### ⚡ 3) 소장 및 공유 인터랙션 (`src/components/ReceiptView.tsx`)
- **📸 고해상도 영수증 이미지 저장 (`html-to-image`)**:
  - 영수증 컴포넌트를 브라우저 렌더링 그대로 고해상도 2x 스케일 PNG 이미지로 캡처하여 다운로드.
  - 인스타그램 스토리, 핀터레스트, 카카오톡 등에 즉시 공유 가능.
- **🔗 고유 공유 링크 복사**:
  - URL 파라미터(`?receipt=UUID`) 기반으로 영수증 고유 주소를 클립보드에 자동 복사.
  - 링크를 받은 상대방도 웹 브라우저에서 해당 영수증 카드를 그대로 열람 가능.
- **💛 따뜻한 온기(하트) 보내기**:
  - 영수증을 보고 응원 하트를 보낼 수 있으며, 핑크빛 미니 컨페티 효과 트리거.

---

### 🌌 4) 밤하늘의 고민 보관함 (익명 갤러리) (`src/components/GalleryModal.tsx`)
- 다른 여행자들이 익명으로 털어놓고 간 영수증들을 모아보는 보관함 모달.
- 카테고리별 탭 필터링 및 각 영수증 카드 클릭 시 풀사이즈 영수증으로 이동.
- 익명 사용자 간 따뜻한 위로와 온기(좋아요 수) 교류.

---

### 🗄️ 5) Supabase 백엔드 연동 & 무중단 Fallback (`src/lib/supabase.ts`)
- **Supabase 데이터베이스 연동**:
  - PostgreSQL `receipts` 테이블 생성 및 RLS(Row Level Security) 설정이 완비된 `supabase/schema.sql` 제공.
  - 익명 사용자(anon)의 신규 영수증 INSERT, 공개 영수증 SELECT, 좋아요 UPDATE 정책 구현.
- **브라우저 내 원클릭 연동 모달 (`src/components/SupabaseModal.tsx`)**:
  - 상단 헤더의 상태 버튼을 통해 `Project URL`과 `Anon Key`를 브라우저에서 즉시 입력/저장 가능.
- **무중단 로컬 Fallback**:
  - Supabase 환경변수를 아직 설정하지 않은 상태에서도 `localStorage` 기반 Fallback을 통해 모든 기능(발급, 갤러리 보관, 좋아요)이 100% 오류 없이 정상 작동.

---

## 3. 파일 및 디렉터리 구조

```
C:\Project\mystic-worry-shop\
├── .env.example                     # Supabase 환경 변수 가이드
├── supabase/
│   └── schema.sql                   # Supabase 테이블 및 RLS DDL 쿼리
├── src/
│   ├── components/
│   │   ├── Header.tsx               # 상점 헤더, 네비게이션, Supabase 상태 뱃지
│   │   ├── WorryForm.tsx            # 고민 주문서 작성 폼
│   │   ├── ReceiptLoading.tsx       # 인쇄 중 단계별 애니메이션
│   │   ├── ReceiptView.tsx          # 실물 영수증 본체 및 다운로드/공유 액션
│   │   ├── GalleryModal.tsx         # 밤하늘의 보관함 (익명 갤러리)
│   │   └── SupabaseModal.tsx        # Supabase 연동 설정 모달
│   ├── lib/
│   │   └── supabase.ts              # Supabase 클라이언트 및 LocalStorage Fallback
│   ├── types/
│   │   └── index.ts                 # 영수증, 카테고리, 폼 데이터 타입 정의
│   ├── utils/
│   │   └── receiptGenerator.ts      # 고민 분해 및 정산 알고리즘
│   ├── App.tsx                      # 메인 페이지 및 상태 관리
│   ├── index.css                    # 밤하늘 테마 및 영수증 실물 스타일링
│   └── main.tsx                     # React 진입점
├── package.json
└── README.md
```
