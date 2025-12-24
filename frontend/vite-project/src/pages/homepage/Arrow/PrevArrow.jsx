import React from 'react';

const PrevArrow = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: '-20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '40px',
        background: 'white',
        borderRadius: '50%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      ❮
    </div>
  );
};

export default PrevArrow;
