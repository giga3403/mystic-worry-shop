import React from 'react';
import { Sparkles, Archive, Database, PlusCircle, Bot } from 'lucide-react';
import { isSupabaseConnected } from '../lib/supabase';

interface HeaderProps {
  onOpenGallery: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
  hasActiveReceipt: boolean;
  isAiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGallery,
  onOpenSettings,
  onReset,
  hasActiveReceipt,
  isAiActive
}) => {
  const connected = isSupabaseConnected();

  return (
    <header className="shop-header">
      <div className="header-container">
        <div className="brand" onClick={onReset} role="button" tabIndex={0}>
          <div className="brand-icon">
            <Sparkles className="icon-sparkle" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-badge">THE MYSTIC SHOP</span>
            <h1 className="brand-title">신비한 고민 상점</h1>
          </div>
        </div>

        <div className="header-actions">
          {hasActiveReceipt && (
            <button className="btn-secondary btn-icon-text" onClick={onReset}>
              <PlusCircle size={16} />
              <span>새 영수증 발급</span>
            </button>
          )}

          <button className="btn-secondary btn-icon-text" onClick={onOpenGallery}>
            <Archive size={16} />
            <span>밤하늘 보관함</span>
          </button>

          {/* AI 모드 / 설정 버튼 */}
          <button 
            className={`btn-supabase-status ${isAiActive ? 'status-ai-on' : 'status-ai-off'}`}
            onClick={onOpenSettings}
            title={isAiActive ? "Gemini AI 초정밀 정산 활성화됨" : "클릭하여 Gemini API Key 등록 가능"}
          >
            <Bot size={14} />
            <span className="status-dot"></span>
            <span>{isAiActive ? 'Gemini AI 연동' : '지능형 정산'}</span>
          </button>

          {/* Supabase 상태 버튼 */}
          <button 
            className={`btn-supabase-status ${connected ? 'status-connected' : 'status-local'}`}
            onClick={onOpenSettings}
            title={connected ? "Supabase 클라우드 DB 연결됨" : "로컬 스토리지 모드 (클릭하여 Supabase 연동)"}
          >
            <Database size={14} />
            <span className="status-dot"></span>
            <span>{connected ? 'Supabase' : '로컬 DB'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
