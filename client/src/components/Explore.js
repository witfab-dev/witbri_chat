import React, { useState } from 'react';
import { IoPlay, IoDuplicate, IoClose } from 'react-icons/io5';

const Explore = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const items = [
    { id: 1, type: 'video', url: 'https://picsum.photos/800/1200?random=1', class: 'tall' },
    { id: 2, type: 'image', url: 'https://picsum.photos/800/800?random=2', class: 'square' },
    { id: 3, type: 'image', url: 'https://picsum.photos/800/800?random=3', class: 'square' },
    { id: 4, type: 'image', url: 'https://picsum.photos/800/800?random=4', class: 'square' },
  ];

  return (
    <div className="explore-container">
      <div className="explore-mini-grid">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`explore-item ${item.class}`}
            onClick={() => setSelectedImage(item.url)}
          >
            <img src={item.url} alt="Explore content" />
            <div className="explore-overlay">
              {item.type === 'video' ? <IoPlay /> : <IoDuplicate />}
            </div>
          </div>
        ))}
      </div>

      {/* --- EXPAND MODAL --- */}
      {selectedImage && (
        <div className="modal-backdrop" onClick={() => setSelectedImage(null)}>
          <button className="modal-close"><IoClose /></button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Expanded view" className="expanded-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;