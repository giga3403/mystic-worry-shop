import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, ExternalLink, Copy, Check, Bot, Sparkles } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, isSupabaseConnected } from '../lib/supabase';
import { getGeminiApiKey, saveGeminiApiKey, hasGeminiKey } from '../lib/gemini';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const currentConfig = getSupabaseConfig();
  const [activeTab, setActiveTab] = useState<'ai' | 'supabase'>('ai');
  
  // Gemini State
  const [geminiKey, setGeminiKey] = useState(getGeminiApiKey());

  // Supabase State
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAll = () => {
    // 1. Save Gemini
    saveGeminiApiKey(geminiKey);

    // 2. Save Supabase
    saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim()
    });

    setStatusMessage('설정이 성공적으로 저장되었습니다!');
    onConfigUpdated();
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleCopySql = () => {
    const sqlScript = `CREATE TABLE IF NOT EXISTS public.receipts (
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
CREATE POLICY "Anyone can increment likes on receipts" ON public.receipts FOR UPDATE USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDbConnected = isSupabaseConnected();
  const isAiConnected = hasGeminiKey();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="icon-sparkle text-accent" size={20} />
            <h3>상점 환경설정 (AI & Supabase)</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Bot size={15} />
            <span>Gemini AI 엔진 {isAiConnected && '✓'}</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'supabase' ? 'active' : ''}`}
            onClick={() => setActiveTab('supabase')}
          >
            <Database size={15} />
            <span>Supabase 데이터베이스 {isDbConnected && '✓'}</span>
          </button>
        </div>

        {activeTab === 'ai' ? (
          <div className="tab-pane">
            <div className="connection-status-card">
              <div className="status-indicator-row">
                {isAiConnected ? (
                  <>
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="status-text success">Google Gemini AI가 연결되어 고민 글을 실시간 정밀 분석합니다.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-warning" />
                    <span className="status-text warning">현재 지능형 키워드/문맥 분석 모드입니다. Gemini API Key를 넣으면 100% LLM 생성형으로 동작합니다.</span>
                  </>
                )}
              </div>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label className="form-label" htmlFor="geminiApiKey">
                  Google Gemini API Key
                </label>
                <input
                  id="geminiApiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="text-input font-mono"
                />
              </div>

              <div className="supabase-guide">
                <h4>💡 무료 Gemini API Key 발급받는 법 (30초 소요)</h4>
                <p className="guide-desc">
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-link">
                    Google AI Studio <ExternalLink size={12} className="inline-icon" />
                  </a>에 접속하여 <strong>Get API Key</strong>를 누르면 <strong>완전 무료</strong>로 키를 즉시 생성할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="tab-pane">
            <div className="connection-status-card">
              <div className="status-indicator-row">
                {isDbConnected ? (
                  <>
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="status-text success">Supabase 클라우드 데이터베이스와 연동되어 있습니다.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-warning" />
                    <span className="status-text warning">현재 로컬 스토리지 모드입니다 (미연동 상태에서도 모든 기능 작동).</span>
                  </>
                )}
              </div>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label className="form-label" htmlFor="supabaseUrl">
                  Project URL
                </label>
                <input
                  id="supabaseUrl"
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-input font-mono"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="supabaseAnonKey">
                  Anon / Public API Key
                </label>
                <input
                  id="supabaseAnonKey"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="text-input font-mono"
                />
              </div>

              <div className="supabase-guide">
                <h4>💡 1분 만에 Supabase 연동하는 법</h4>
                <ol className="guide-steps">
                  <li>
                    <a href="https://supabase.com" target="_blank" rel="noreferrer" className="inline-link">
                      Supabase <ExternalLink size={12} className="inline-icon" />
                    </a> 에서 새 무료 프로젝트를 만듭니다.
                  </li>
                  <li>
                    <strong>SQL Editor</strong> 메뉴에서 테이블 생성 스크립트를 붙여넣고 <strong>Run</strong>을 누릅니다.
                    <button className="btn-copy-sql" onClick={handleCopySql}>
                      {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                      <span>{copied ? 'SQL 복사 완료!' : '테이블 생성 SQL 복사'}</span>
                    </button>
                  </li>
                  <li>
                    <strong>Project Settings → API</strong>에서 <code>URL</code>과 <code>anon key</code>를 복사하여 위 입력창에 붙여넣습니다.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="alert-box success">
            {statusMessage}
          </div>
        )}

        <div className="settings-actions">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn-primary" onClick={handleSaveAll}>
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
