import React, { useEffect, useState } from 'react';
import { Sparkles, Printer } from 'lucide-react';

export const ReceiptLoading: React.FC = () => {
  const steps = [
    '고민의 무게를 달빛 저울로 달아보는 중...',
    '마음을 짓누르던 생각들을 분해하는 중...',
    '상점 특별 위로 쿠폰과 무제한 할인 적용 중...',
    '따뜻한 처방전과 행운의 부적 인쇄 중...'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-card">
      <div className="loading-printer-icon">
        <Printer size={48} className="anim-bounce" />
        <Sparkles size={24} className="loading-sparkle-top" />
      </div>
      <h3 className="loading-title">신비한 영수증을 인쇄하고 있습니다</h3>
      <p className="loading-step-text">{steps[currentStep]}</p>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <p className="loading-tip">
        잠시 후 당신의 무거운 짐이 종이 한 장에 정산되어 나타납니다.
      </p>
    </div>
  );
};
