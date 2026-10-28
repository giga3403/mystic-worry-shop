import React, { useRef, useState } from 'react';
import type { Receipt } from '../types';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Share2, Heart, RefreshCw, Check, Sparkles, MessageCircleHeart } from 'lucide-react';
import { likeReceipt } from '../lib/supabase';

interface ReceiptViewProps {
  receipt: Receipt;
  onReset: () => void;
  onOpenGallery: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  receipt,
  onReset,
  onOpenGallery
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState(receipt.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#EC4899', '#F43F5E', '#FB7185']
    });

    try {
      const updated = await likeReceipt(receipt.id);
      setLikes(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      await document.fonts.ready;
      
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#1E1B2E',
        pixelRatio: 2
      });

      const link = document.createElement('a');
      link.download = `신비한_고민상점_영수증_${receipt.barcode_number}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to generate receipt image:', err);
      alert('영수증 이미지 저장 중 오류가 발생했습니다. 브라우저 캡처 기능을 이용해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      alert('링크를 클립보드에 복사했습니다: ' + url);
    });
  };

  const formattedDate = new Date(receipt.created_at).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="receipt-view-wrapper">
      <div className="receipt-action-bar">
        <button
          className="action-btn btn-save"
          onClick={handleDownloadImage}
          disabled={isDownloading}
        >
          <Download size={16} />
          <span>{isDownloading ? '저장 이미지 생성 중...' : '영수증 이미지로 저장'}</span>
        </button>

        <button className="action-btn btn-copy" onClick={handleShareLink}>
          {copied ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
          <span>{copied ? '링크 복사됨!' : '공유하기'}</span>
        </button>

        <button 
          className={`action-btn btn-heart ${hasLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          <Heart size={16} fill={hasLiked ? '#EC4899' : 'none'} />
          <span>온기 보내기 ({likes})</span>
        </button>
      </div>

      <div className="receipt-container" ref={receiptRef}>
        <div className="receipt-paper">
          <div className="receipt-sawtooth-top"></div>

          <div className="receipt-header">
            <div className="receipt-stars">✧ ✧ ✧</div>
            <h2 className="receipt-store-title">신비한 고민 상점</h2>
            <p className="receipt-store-eng">MYSTIC WORRY SHOP & REPOSITORY</p>
            <p className="receipt-slogan">"오늘 밤 당신의 짐은 이곳에 두고 가세요"</p>
            <div className="receipt-divider-double"></div>
          </div>

          <div className="receipt-meta">
            <div className="meta-row">
              <span className="meta-label">발행 일시 :</span>
              <span className="meta-value">{formattedDate}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">주문 번호 :</span>
              <span className="meta-value mono">{receipt.barcode_number}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">손님 호칭 :</span>
              <span className="meta-value font-bold">{receipt.customer_name} 님</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">고민 분류 :</span>
              <span className="meta-value">[{receipt.category_label}]</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">마음의 무게 :</span>
              <span className="meta-value">{receipt.worry_weight} {receipt.worry_weight_unit}</span>
            </div>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-worry-box">
            <div className="worry-box-title">【 접수된 마음의 이야기 】</div>
            <p className="worry-box-text">"{receipt.worry_content}"</p>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-table">
            <div className="table-header">
              <span className="th-item">구매 품목(감정)</span>
              <span className="th-qty">수량</span>
              <span className="th-price">청구 에너지</span>
            </div>
            <div className="table-rows">
              {receipt.items.map((item) => (
                <div key={item.id} className="table-row">
                  <span className="td-item">{item.name}</span>
                  <span className="td-qty">x{item.qty}</span>
                  <span className="td-price">{item.emotionalCost}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-billing">
            <div className="bill-row subtotal">
              <span>감정 소모 원금</span>
              <span className="mono">{receipt.subtotal}</span>
            </div>

            <div className="discount-section">
              <div className="discount-title">▼ 상점 특별 탕감 할인 내역</div>
              {receipt.discounts.map((disc) => (
                <div key={disc.id} className="bill-row discount-item">
                  <span className="disc-name">• {disc.name}</span>
                  <span className="disc-val mono">{disc.amount}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider-double"></div>

            <div className="bill-row total-row">
              <span className="total-label">최종 결제 금액</span>
              <span className="total-amount">0 원 (₩0)</span>
            </div>
            <div className="bill-row pay-method">
              <span>결제 방식</span>
              <span>{receipt.payment_method}</span>
            </div>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-remedy">
            <div className="remedy-badge">
              <Sparkles size={14} />
              <span>상점 주인의 처방 조언</span>
            </div>
            <h4 className="remedy-title">{receipt.remedy_title}</h4>
            <p className="remedy-body">{receipt.remedy_desc}</p>
          </div>

          <div className="receipt-fortune">
            <div className="fortune-row">
              <span className="fortune-label">오늘 밤의 부적 :</span>
              <span className="fortune-value">{receipt.lucky_item}</span>
            </div>
            <div className="fortune-row">
              <span className="fortune-label">마음의 행운색 :</span>
              <span className="fortune-value">{receipt.lucky_color}</span>
            </div>
            <div className="fortune-row spell">
              <span className="fortune-label">마법의 주문 :</span>
              <span className="fortune-value">"{receipt.spell}"</span>
            </div>
          </div>

          <div className="receipt-footer">
            <div className="barcode-box">
              <div className="fake-barcode">
                {Array.from({ length: 42 }).map((_, i) => (
                  <span 
                    key={i} 
                    className="bar" 
                    style={{ 
                      width: `${(i % 3) * 1.5 + 1.2}px`, 
                      opacity: (i % 5 === 0) ? 0.4 : 0.95,
                      marginRight: `${(i % 2) * 1.5 + 1}px`
                    }} 
                  />
                ))}
              </div>
              <p className="barcode-text">{receipt.barcode_number}</p>
            </div>

            <div className="stamp-discharged">
              <div className="stamp-inner">
                <span className="stamp-sub">MYSTIC SHOP</span>
                <span className="stamp-main">털어냄 완료</span>
                <span className="stamp-en">DISCHARGED</span>
                <span className="stamp-date">{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            <p className="receipt-goodbye">
              "당신의 오늘은 이미 충분히 아름다웠습니다."<br />
              상점 방문을 환영하며, 안녕한 밤 되세요.
            </p>
          </div>

          <div className="receipt-sawtooth-bottom"></div>
        </div>
      </div>

      <div className="receipt-bottom-nav">
        <button className="btn-secondary nav-btn" onClick={onReset}>
          <RefreshCw size={16} />
          <span>다른 고민도 털어놓기</span>
        </button>
        <button className="btn-primary nav-btn" onClick={onOpenGallery}>
          <MessageCircleHeart size={16} />
          <span>다른 여행자들의 영수증 보기</span>
        </button>
      </div>
    </div>
  );
};
