import React from 'react';
import Slider from 'react-slick';

function OutStandingDoctors() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div
      className="slider-container"
      style={{ background: '#d0f0f4', width: '100%' }}
    >
      <Slider {...settings}>
        {[
          { icon: '🏥', title: 'Y học Cổ truyền' },
          { icon: '🦴', title: 'Châm cứu' },
          { icon: '👩‍⚕️', title: 'Sản Phụ khoa' },
          { icon: '🧠', title: 'Thần kinh' },
          { icon: '❤️', title: 'Tim mạch' },
        ].map((specialty, index) => (
          <div key={index} style={{ padding: '0 10px' }}>
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>
                {specialty.icon}
              </div>
              <h3 style={{ fontSize: '16px', color: '#333', margin: 0 }}>
                {specialty.title}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default OutStandingDoctors;
