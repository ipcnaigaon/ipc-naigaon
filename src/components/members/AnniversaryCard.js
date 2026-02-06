/**
 * Anniversary Card Component
 * Generates an anniversary greeting card for WhatsApp sharing
 */

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import './AnniversaryCard.css';

const AnniversaryCard = ({ member, onClose, onShare }) => {
  const memberName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
  const marriageDate = member.marriageDate ? new Date(member.marriageDate) : null;
  const years = marriageDate ? new Date().getFullYear() - marriageDate.getFullYear() : 0;
  const cardRef = useRef(null);
  
  // Format name to title case if in all caps
  const formatName = (name) => {
    if (!name) return '';
    // Check if name is all uppercase
    if (name === name.toUpperCase()) {
      return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
    return name;
  };
  
  const formattedName = formatName(memberName);
  
  const handleWhatsAppShare = () => {
    const message = `💕 Happy ${years > 0 ? years + (years === 1 ? 'st' : years === 2 ? 'nd' : years === 3 ? 'rd' : 'th') + ' ' : ''}Wedding Anniversary! 💕

❤️ Dear ${memberName},

May your love continue to grow stronger with each passing day. May God bless your union with endless joy, peace, and harmony.

Celebrating the beautiful journey you've shared together and wishing you many more wonderful years ahead!

🙏 May the Lord continue to guide and bless your marriage abundantly.

With love and prayers,
IPC Naigaon Family 💙`;

    const whatsappUrl = `https://wa.me/${member.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    if (onShare) onShare();
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;

    const phoneNumber = member.phone?.replace(/\D/g, '');
    
    if (!phoneNumber) {
      alert('Phone number not available for this member.');
      return;
    }
    
    // Open WhatsApp with a message
    const yearsText = years > 0 ? `${years}${years === 1 ? 'st' : years === 2 ? 'nd' : years === 3 ? 'rd' : 'th'} ` : '';
    const message = `💕 Happy ${yearsText}Wedding Anniversary! 💕\n\n❤️ Dear ${formattedName},\n\nMay your love continue to grow stronger with each passing day. May God bless your union with endless joy, peace, and harmony.\n\nWith love and prayers,\nIPC Naigaon Family 💙`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        ignoreElements: (element) => {
          return element.classList.contains('anniversary-card-actions');
        },
      });

      canvas.toBlob((blob) => {
        const fileName = `anniversary-${memberName.replace(/\s+/g, '-')}.png`;
        downloadImage(blob, fileName);
      });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadImage = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="anniversary-modal-overlay" onClick={onClose}>
      <div className="anniversary-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="anniversary-close-btn" onClick={onClose}>✕</button>
        
        <div className="anniversary-card" ref={cardRef}>
          <div className="anniversary-card-header">
            <div className="anniversary-card-icon">💑</div>
            <h2>Happy Anniversary!</h2>
          </div>
          
          <div className="anniversary-card-body">
            <div className="anniversary-card-name">{formattedName}</div>
            
            <div className="anniversary-card-message">
              <p>💕 Celebrating your beautiful journey together! May God continue to bless your marriage with love, joy, and peace. Wishing you many more blessed years as husband and wife. 🙏</p>
            </div>
            
            <div className="anniversary-card-footer">
              <p>With love and prayers,</p>
              <p className="anniversary-card-church-name">IPC Naigaon Mumbai Family 💙</p>
            </div>
          </div>
          
          <div className="anniversary-card-actions">
            <button className="anniversary-download-image-btn" onClick={handleDownloadImage}>
              <span>💾</span>
              <span>Download Card</span>
            </button>
            <button className="anniversary-share-image-btn" onClick={handleShareImage}>
              <span>📲</span>
              <span>Send to WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryCard;
