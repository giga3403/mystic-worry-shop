import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, isSupabaseConnected } from '../lib/supabase';

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
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim()
    });
    setStatusMessage('Supabase 설정이 저장되었습니다!');
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

  const isConnected = isSupabaseConnected();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Database className="icon-sparkle text-accent" size={20} />
            <h3>Supabase 백엔드 연동 설정</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="connection-status-card">
          <div className="status-indicator-row">
            {isConnected ? (
              <>
                <CheckCircle2 size={18} className="text-success" />
                <span className="status-text success">Supabase 클라우드 데이터베이스와 연동되어 있습니다.</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} className="text-warning" />
                <span className="status-text warning">현재 로컬 스토리지 모드로 동작 중입니다 (미연동 상태에서도 모든 기능 작동).</span>
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

          {statusMessage && (
            <div className="alert-box success">
              {statusMessage}
            </div>
          )}

          <div className="settings-actions">
            <button className="btn-secondary" onClick={onClose}>취소</button>
            <button className="btn-primary" onClick={handleSave}>
              설정 저장 및 연동
            </button>
          </div>
        </div>

        {/* 안내 섹션 */}
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
              <strong>Project Settings → API</strong>에서 <code>URL</code>과 <code>anon key</code>를 복사하여 위 입력창 또는 <code>.env.local</code> 파일에 붙여넣으면 즉시 실시간 영수증 보관함이 활성화됩니다!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
