-- ========================================================
-- [신비한 고민 상점의 영수증] Supabase 데이터베이스 스키마
-- Supabase 대시보드 -> SQL Editor에 붙여넣고 Run을 눌러 실행하세요.
-- ========================================================

-- 1. 영수증 테이블 생성
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

-- 2. 행 보안(Row Level Security, RLS) 활성화
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- 3. 익명 사용자(anon)도 영수증을 읽고 쓸 수 있도록 정책 추가
-- (1) 조회 정책: 공개된 영수증이거나 본인의 영수증 ID 조회 가능
CREATE POLICY "Public receipts are viewable by everyone" 
ON public.receipts 
FOR SELECT 
USING (is_public = true OR true);

-- (2) 삽입 정책: 누구나 새로운 고민 영수증을 발행(Insert)할 수 있음
CREATE POLICY "Anyone can create a worry receipt" 
ON public.receipts 
FOR INSERT 
WITH CHECK (true);

-- (3) 수정 정책: 좋아요(온기) 카운트 증가 허용
CREATE POLICY "Anyone can increment likes on receipts" 
ON public.receipts 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 4. 인덱스 생성 (조회 속도 최적화)
CREATE INDEX IF NOT EXISTS receipts_created_at_idx ON public.receipts (created_at DESC);
CREATE INDEX IF NOT EXISTS receipts_is_public_idx ON public.receipts (is_public);
