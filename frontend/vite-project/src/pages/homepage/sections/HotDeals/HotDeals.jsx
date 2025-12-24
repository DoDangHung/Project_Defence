import React from 'react';
import Slider from 'react-slick';
import './HotDeals.scss';
function HotDeals() {
  const settings = {
    className: '',
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };
  return (
    <div className="slider-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Slider {...settings}>
        <div className="slideShow">
          <img src="https://cdn.bookingcare.vn/fo/w1920/2025/12/01/153840-dr-eye.png" />
        </div>
        <div className="slideShow">
          <img src="https://cdn.bookingcare.vn/fo/w1920/2025/09/24/134521-sct-1.png" />
        </div>
      </Slider>
    </div>
  );
}

export default HotDeals;
