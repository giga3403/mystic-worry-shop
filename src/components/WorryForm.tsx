import React, { useState } from 'react';
import type { WorryCategory, WorryFormData } from '../types';
import { CATEGORY_MAP } from '../utils/receiptGenerator';
import { Sparkles, Feather, Send, Lock, Globe } from 'lucide-react';

interface WorryFormProps {
  onSubmit: (data: WorryFormData) => void;
  isLoading: boolean;
}

const SPELLS = [
  '이 또한 부드럽게 지나가리라 🌿',
  '어떻게든 잘 풀릴 운명이다 ✨',
  '내일의 나에게 믿고 맡기자 🕊️',
  '지금 이대로도 충분히 눈부시다 🌟',
  '모든 것은 제자리를 찾아간다 💫'
];

const EXPIRY_OPTIONS = [
  '오늘 밤 꿀잠 잘 때까지 🌙',
  '이번 주말 햇살을 볼 때까지 ☀️',
  '다음 달의 내가 웃어넘길 때까지 🌸',
  '평생 안고 갈 일 아님 (즉시 파기) 🍃'
];

export const WorryForm: React.FC<WorryFormProps> = ({ onSubmit, isLoading }) => {
  const [customerName, setCustomerName] = useState('');
  const [category, setCategory] = useState<WorryCategory>('mental');
  const [worryContent, setWorryContent] = useState('');
  const [worryWeight, setWorryWeight] = useState(50);
  const [worryExpiry, setWorryExpiry] = useState(EXPIRY_OPTIONS[0]);
  const [spell, setSpell] = useState(SPELLS[0]);
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryContent.trim()) return;

    onSubmit({
      customer_name: customerName,
      category,
      worry_content: worryContent,
      worry_weight: worryWeight,
      worry_expiry: worryExpiry,
      spell,
      is_public: isPublic
    });
  };

  const getWeightDescription = (val: number) => {
    if (val < 25) return '찻잔 속 찻잎처럼 가벼운 잔걱정 (가벼움)';
    if (val < 50) return '마음에 걸려있는 돌멩이 하나의 무게 (보통)';
    if (val < 80) return '퇴근길 백팩에 담긴 피로의 무게 (무거움)';
    return '어깨를 짓누르던 거대한 바위의 무게 (매우 무거움)';
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <div className="shop-sign">
          <span className="sign-icon">🕯️</span>
          <h2>신비한 고민 상점 주문서</h2>
        </div>
        <p className="form-subtitle">
          마음속에 무겁게 맺혀있는 생각을 편하게 털어놓으세요.<br />
          상점 주인이 당신의 고민을 정산하여 <strong>따뜻한 위로의 영수증</strong>으로 바꿔드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="worry-form">
        <div className="form-group">
          <label className="form-label" htmlFor="nameInput">
            여행자의 호칭 (닉네임)
          </label>
          <div className="input-wrapper">
            <Feather size={16} className="input-icon" />
            <input
              id="nameInput"
              type="text"
              placeholder="예: 지친 별빛, 방랑하는 시인 (비워두면 '익명의 여행자')"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-input"
              maxLength={20}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">고민의 성격 선택</label>
          <div className="category-grid">
            {(Object.keys(CATEGORY_MAP) as WorryCategory[]).map((catKey) => {
              const cat = CATEGORY_MAP[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  type="button"
                  key={catKey}
                  className={`category-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => setCategory(catKey)}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  <span className="chip-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <div className="label-with-hint">
            <label className="form-label" htmlFor="contentInput">
              털어놓고 싶은 이야기
            </label>
            <span className="char-count">{worryContent.length} / 500자</span>
          </div>
          <textarea
            id="contentInput"
            rows={5}
            required
            placeholder="어떤 생각 때문에 마음이 무거우신가요? 사소한 것이라도, 혹은 누구에게도 말하지 못했던 것이라도 괜찮습니다. 이곳에 적는 순간 당신의 손을 떠나 상점이 보관하게 됩니다."
            value={worryContent}
            onChange={(e) => setWorryContent(e.target.value)}
            className="textarea-input"
            maxLength={500}
          />
        </div>

        <div className="form-group">
          <div className="slider-header">
            <label className="form-label">현재 느끼는 마음의 무게</label>
            <span className="weight-badge">{worryWeight} g / kg</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={worryWeight}
            onChange={(e) => setWorryWeight(Number(e.target.value))}
            className="weight-slider"
          />
          <p className="slider-desc">{getWeightDescription(worryWeight)}</p>
        </div>

        <div className="form-group">
          <label className="form-label">이 고민의 유통기한</label>
          <div className="pill-select-grid">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                className={`pill-btn ${worryExpiry === opt ? 'active' : ''}`}
                onClick={() => setWorryExpiry(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">영수증에 새길 마법의 한 마디</label>
          <div className="pill-select-grid">
            {SPELLS.map((s) => (
              <button
                type="button"
                key={s}
                className={`pill-btn ${spell === s ? 'active' : ''}`}
                onClick={() => setSpell(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group-checkbox">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-label">
              {isPublic ? (
                <>
                  <Globe size={15} className="inline-icon text-accent" /> 다른 여행자들과 '밤하늘 보관함'에 익명으로 공유하기
                </>
              ) : (
                <>
                  <Lock size={15} className="inline-icon text-muted" /> 나만 보기 (비공개로 발급)
                </>
              )}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!worryContent.trim() || isLoading}
          className="btn-primary btn-submit"
        >
          <Sparkles className="icon-pulse" size={18} />
          <span>{isLoading ? '고민을 정산하는 중...' : '마법 영수증 발급하기'}</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
