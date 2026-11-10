import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Android/Chrome/Edge 설치 이벤트 감지
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 2. iOS Safari 감지 (standalone이 아닐 때)
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-content">
        <div className="pwa-icon">
          <Smartphone size={18} />
        </div>
        <div className="pwa-text">
          <strong>스마트폰 앱처럼 쓰기</strong>
          <span>홈 화면에 추가하여 전체 화면으로 편하게 이용하세요</span>
        </div>
      </div>

      <div className="pwa-actions">
        <button className="btn-pwa-install" onClick={handleInstallClick}>
          <Download size={14} />
          <span>설치하기</span>
        </button>
        <button className="btn-pwa-close" onClick={() => setIsVisible(false)}>
          <X size={14} />
        </button>
      </div>

      {showIosGuide && (
        <div className="ios-guide-popup">
          <p>
            아이폰 사파리 하단의 <strong>[공유(네모 화살표)]</strong> 버튼을 누른 뒤, <strong>[홈 화면에 추가]</strong>를 누르면 앱으로 설치됩니다! 📲
          </p>
          <button className="btn-ios-guide-close" onClick={() => setShowIosGuide(false)}>확인</button>
        </div>
      )}
    </div>
  );
};
