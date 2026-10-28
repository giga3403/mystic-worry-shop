import React, { useEffect, useState } from 'react';
import type { Receipt, WorryCategory } from '../types';
import { getPublicReceipts, likeReceipt } from '../lib/supabase';
import { X, Heart, Sparkles, Calendar } from 'lucide-react';
import { CATEGORY_MAP } from '../utils/receiptGenerator';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectReceipt
}) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadGallery();
    }
  }, [isOpen]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const items = await getPublicReceipts(30);
      setReceipts(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeCard = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const updated = await likeReceipt(id);
      setReceipts(prev => prev.map(r => r.id === id ? { ...r, likes_count: updated } : r));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const filtered = filterCat === 'all' 
    ? receipts 
    : receipts.filter(r => r.category === filterCat);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content gallery-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="icon-sparkle text-accent" size={20} />
            <h3>밤하늘의 고민 보관함</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">
          다른 여행자들이 털어놓고 간 영수증들입니다. 서로의 마음에 조용한 온기를 보태어주세요.
        </p>

        <div className="gallery-filter-bar">
          <button
            className={`filter-chip ${filterCat === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCat('all')}
          >
            전체 보기 ({receipts.length})
          </button>
          {(Object.keys(CATEGORY_MAP) as WorryCategory[]).map(catKey => (
            <button
              key={catKey}
              className={`filter-chip ${filterCat === catKey ? 'active' : ''}`}
              onClick={() => setFilterCat(catKey)}
            >
              {CATEGORY_MAP[catKey].icon} {CATEGORY_MAP[catKey].label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {loading ? (
            <div className="gallery-empty">
              <Sparkles className="anim-spin text-muted" size={32} />
              <p>밤하늘의 영수증들을 불러오고 있습니다...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="gallery-empty">
              <p>아직 보관함에 등록된 영수증이 없습니다.<br />첫 번째 고민 영수증의 주인공이 되어보세요!</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id} 
                className="gallery-card"
                onClick={() => {
                  onSelectReceipt(item);
                  onClose();
                }}
              >
                <div className="card-top">
                  <span className="card-category">
                    {CATEGORY_MAP[item.category]?.icon} {item.category_label || item.category}
                  </span>
                  <span className="card-customer">{item.customer_name} 님</span>
                </div>

                <p className="card-worry-excerpt">
                  "{item.worry_content.length > 80 ? item.worry_content.substring(0, 80) + '...' : item.worry_content}"
                </p>

                <div className="card-remedy-highlight">
                  <span className="remedy-tag">처방</span>
                  <span className="remedy-text">{item.remedy_title}</span>
                </div>

                <div className="card-bottom">
                  <div className="card-date">
                    <Calendar size={13} />
                    <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>

                  <button 
                    className="card-like-btn"
                    onClick={(e) => handleLikeCard(e, item.id)}
                  >
                    <Heart size={14} className="heart-icon" fill={item.likes_count > 0 ? '#EC4899' : 'none'} />
                    <span>{item.likes_count || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
