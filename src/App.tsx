import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorryForm } from './components/WorryForm';
import { ReceiptLoading } from './components/ReceiptLoading';
import { ReceiptView } from './components/ReceiptView';
import { GalleryModal } from './components/GalleryModal';
import { SupabaseModal } from './components/SupabaseModal';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';
import type { Receipt, WorryFormData } from './types';
import { generateLocalReceiptFromWorry } from './utils/receiptGenerator';
import { generateReceiptWithGemini, hasGeminiKey } from './lib/gemini';
import { saveReceiptToBackend, getReceiptById } from './lib/supabase';
import confetti from 'canvas-confetti';

export function App() {
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(hasGeminiKey());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const receiptId = params.get('receipt');
    if (receiptId) {
      setIsLoading(true);
      getReceiptById(receiptId).then((found) => {
        if (found) {
          setActiveReceipt(found);
        }
        setIsLoading(false);
      });
    }
  }, []);

  const handleFormSubmit = async (formData: WorryFormData) => {
    setIsLoading(true);

    try {
      let receipt: Receipt | null = null;

      if (hasGeminiKey()) {
        receipt = await generateReceiptWithGemini(formData);
      }

      if (!receipt) {
        receipt = generateLocalReceiptFromWorry(formData);
      }

      await saveReceiptToBackend(receipt);

      setActiveReceipt(receipt);
      setIsLoading(false);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#A78BFA', '#F472B6', '#FBBF24', '#60A5FA']
      });

      const url = new URL(window.location.href);
      url.searchParams.set('receipt', receipt.id);
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.error(e);
      const fallback = generateLocalReceiptFromWorry(formData);
      setActiveReceipt(fallback);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setActiveReceipt(null);
    setIsLoading(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('receipt');
    window.history.pushState({}, '', url.toString());
  };

  const handleSelectFromGallery = (receipt: Receipt) => {
    setActiveReceipt(receipt);
    const url = new URL(window.location.href);
    url.searchParams.set('receipt', receipt.id);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="app-layout">
      <div className="stars-background">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
      </div>

      {/* PWA 홈 화면 추가 배너 (모바일 접속 시 노출) */}
      <InstallPwaPrompt />

      <Header
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
        hasActiveReceipt={Boolean(activeReceipt)}
        isAiActive={isAiMode}
      />

      <main className="main-content">
        {isLoading ? (
          <ReceiptLoading />
        ) : activeReceipt ? (
          <ReceiptView
            receipt={activeReceipt}
            onReset={handleReset}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        ) : (
          <WorryForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading} 
            isAiActive={isAiMode}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      <footer className="shop-footer">
        <p className="footer-quote">
          "흘려보내지 못한 생각은 마음에 쌓여 돌이 되지만, 털어놓은 고민은 바람을 타고 날아갑니다."
        </p>
        <p className="footer-copy">
          © 2026 신비한 고민 상점 (Mystic Worry Shop) · Powered by Gemini AI, Supabase & React PWA
        </p>
      </footer>

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectReceipt={handleSelectFromGallery}
      />

      <SupabaseModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdated={() => setIsAiMode(hasGeminiKey())}
      />
    </div>
  );
}

export default App;
