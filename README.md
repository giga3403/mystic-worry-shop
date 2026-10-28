# ✧ 신비한 고민 상점의 영수증 (Mystic Worry Shop Receipt)

> "흘려보내지 못한 생각은 마음에 쌓여 돌이 되지만, 털어놓은 고민은 바람을 타고 날아갑니다."  
> 밤하늘 아래, 당신의 무거운 마음의 짐을 감성적인 영수증 한 장으로 정산해 드리는 힐링 웹 애플리케이션입니다.

---

## 🌟 주요 특징 (Key Features)

1. **감성적인 마음 정산 주문서**:
   - 6가지 고민 카테고리 (인간관계, 진로/미래, 내면/멘탈, 학업/일, 재정/현실, 일상의 소소한 걱정)
   - 걱정의 무게 슬라이더 (10g ~ 100kg), 고민의 유통기한, 마법의 주문 각인
2. **실물 감성 영수증 (Authentic Receipt)**:
   - 빈티지 감열지 질감, 지그재그 절취선(Sawtooth Border), 바코드 그래픽
   - 고민 항목별 분해 청구 내역 & 감정 에너지 소모 비용
   - **상점 특별 할인 & 무제한 탕감 쿠폰** 적용 ➔ **최종 결제 금액 0원 (상점 주인 대납)**
   - 개인 맞춤형 따뜻한 위로 처방전 & 행운의 부적 아이템
   - `[ 털어냄 완료 / DISCHARGED ]` 앤틱 고무 스탬프
3. **공유 및 소장 인터랙션**:
   - 📸 **영수증 이미지로 저장하기** (`html-to-image`)
   - 🔗 **고유 링크 복사 및 공유**
   - 💛 **따뜻한 온기(하트) 보내기 & 폭죽 애니메이션** (`canvas-confetti`)
4. **밤하늘의 보관함 (익명 갤러리)**:
   - 다른 여행자들이 털어놓고 간 영수증 둘러보기 및 응원 온기 전달
5. **Supabase 백엔드 연동**:
   - 실시간 PostgreSQL 데이터베이스(`receipts` 테이블) 연동
   - Supabase 미설정 시에도 브라우저 로컬 스토리지 Fallback으로 100% 정상 작동
   - UI에서 직접 Supabase Project URL 및 Anon Key 입력 지원

---

## 🚀 빠른 시작 (Getting Started)

```bash
# 1. 의존성 설치 (완료됨)
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. 브라우저 접속
# http://localhost:5173
```

---

## 🗄️ Supabase 데이터베이스 설정 안내

Supabase 대시보드의 **SQL Editor**에 `supabase/schema.sql` 파일의 내용을 붙여넣고 실행(Run)하세요.

```sql
CREATE TABLE IF NOT EXISTS public.receipts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT DEFAULT '익명의 여행자' NOT NULL,
    category TEXT NOT NULL,
    worry_content TEXT NOT NULL,
    worry_weight NUMERIC DEFAULT 50,
    spell TEXT,
    receipt_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT true,
    likes_count INTEGER DEFAULT 0
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public receipts are viewable by everyone" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "Anyone can create a worry receipt" ON public.receipts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can increment likes on receipts" ON public.receipts FOR UPDATE USING (true) WITH CHECK (true);
```

이후 `Project Settings -> API`에서 **Project URL**과 **Anon Key**를 복사하여 앱 내 설정창 또는 `.env.local`에 기입하시면 됩니다.
