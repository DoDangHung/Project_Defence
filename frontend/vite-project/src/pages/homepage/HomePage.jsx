import React from 'react';
import './Homepage.scss';
import { useState } from 'react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleSearch = () => {
    if (searchValue) {
      alert('Tìm kiếm: ' + searchValue);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="menu-icon" onClick={openMenu}>
              ☰
            </span>

            <div className="logo">
              <div className="logo-icon">C</div>
              <span>BookingCare</span>
            </div>
          </div>

          <nav className="nav-links">
            <button className="btn-all">Tất cả</button>
            <a href="#tai-nha">Tại nhà</a>
            <a href="#tai-vien">Tại viện</a>
            <a href="#song-khoe">Sống khỏe</a>
          </nav>

          <div className="header-actions">
            <div className="action-item">
              <span className="action-icon">🤝</span>
              <span>Hợp tác</span>
            </div>
            <div className="action-item">
              <span className="action-icon">🕐</span>
              <span>Lịch hẹn</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-menu" onClick={closeMenu}>
            ×
          </button>
        </div>

        <div className="mobile-menu-links">
          <a href="#" className="mobile-menu-item" onClick={closeMenu}>
            🏠 Trang chủ
          </a>
          <a href="#" className="mobile-menu-item" onClick={closeMenu}>
            📋 Tất cả dịch vụ
          </a>
          <a href="#tai-nha" className="mobile-menu-item" onClick={closeMenu}>
            🏡 Tại nhà
          </a>
          <a href="#tai-vien" className="mobile-menu-item" onClick={closeMenu}>
            🏥 Tại viện
          </a>
          <a href="#song-khoe" className="mobile-menu-item" onClick={closeMenu}>
            💪 Sống khỏe
          </a>
          <a href="#" className="mobile-menu-item" onClick={closeMenu}>
            🤝 Hợp tác
          </a>
          <a href="#" className="mobile-menu-item" onClick={closeMenu}>
            🕐 Lịch hẹn
          </a>
          <a href="#" className="mobile-menu-item" onClick={closeMenu}>
            👤 Tài khoản
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <h1>Nền tảng đặt lịch khám bệnh, chăm sóc răng miệng và làm đẹp</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm gợi xét nghiệm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        {/* AI Features */}
        <section className="ai-features">
          <h2>Sản phẩm hỗ trợ bởi AI</h2>

          <div className="features-grid">
            <div
              className="feature-card"
              onClick={() => alert('Bạn đã chọn: Trợ lý AI đặt lịch')}
            >
              <div className="feature-icon">📅</div>
              <div className="feature-content">
                <h3>Trợ lý AI đặt lịch</h3>
                <p>Tìm kiếm thông tin bác sĩ, nơi khám và đặt lịch khám</p>
              </div>
            </div>

            <div
              className="feature-card"
              onClick={() => alert('Bạn đã chọn: Trợ lý thẩm mỹ')}
            >
              <div className="feature-icon">💊</div>
              <div className="feature-content">
                <h3>Trợ lý thẩm mỹ</h3>
                <p>Tìm kiếm địa chỉ, bác sĩ thẩm mỹ uy tín.</p>
              </div>
            </div>

            <div
              className="feature-card"
              onClick={() => alert('Bạn đã chọn: Trợ lý niềng răng')}
            >
              <div className="feature-icon">🦷</div>
              <div className="feature-content">
                <h3>Trợ lý niềng răng</h3>
                <p>Tìm kiếm địa chỉ, bác sĩ niềng răng giàu kinh nghiệm.</p>
              </div>
            </div>

            <div
              className="feature-card"
              onClick={() => alert('Bạn đã chọn: Trợ lý trĩ mụn')}
            >
              <div className="feature-icon">🩺</div>
              <div className="feature-content">
                <h3>Trợ lý trĩ mụn</h3>
                <p>Tìm bác sĩ, dịch vụ, cơ sở chuyên về điều trị mụn.</p>
              </div>
            </div>

            <div
              className="feature-card"
              onClick={() => alert('Bạn đã chọn: Dental Trip')}
            >
              <div className="feature-icon">✈️</div>
              <div className="feature-content">
                <h3>Dental Trip</h3>
                <p>Nền tảng nha khoa du lịch dành riêng cho người nước ngoài</p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* For You Section */}
      <section className="for-you">
        <div className="for-you-container">
          <h2>Dành cho bạn</h2>

          <div className="for-you-grid">
            <div className="for-you-card">
              <div className="card-image">
                <div className="image-placeholder">👨‍⚕️ Dịch vụ y tế</div>
              </div>
            </div>

            <div className="for-you-card">
              <div
                className="card-image"
                style={{
                  background:
                    'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
                }}
              >
                <div className="image-placeholder">📋 Thông tin sức khỏe</div>
              </div>
            </div>

            <div className="for-you-card">
              <div
                className="card-image"
                style={{
                  background:
                    'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
                }}
              >
                <div className="image-placeholder">📋 Thông tin sức khỏe</div>
              </div>
            </div>

            <div className="for-you-card">
              <div
                className="card-image"
                style={{
                  background:
                    'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
                }}
              >
                <div className="image-placeholder">📋 Thông tin sức khỏe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        style={{
          padding: '50px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
        }}
      >
        <h2
          style={{
            fontSize: window.innerWidth <= 768 ? '20px' : '24px',
            marginBottom: '30px',
            color: '#333',
          }}
        >
          Dịch vụ toàn diện
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              window.innerWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '15px',
          }}
        >
          {[
            { icon: '🏥', title: 'Khám Chuyên khoa', color: '#4fc3f7' },
            { icon: '🏠', title: 'Khám từ xa', color: '#66bb6a' },
            { icon: '📋', title: 'Khám tổng quát', color: '#ffa726' },
            { icon: '🧪', title: 'Xét nghiệm y học', color: '#42a5f5' },
            { icon: '🔍', title: 'Sức khỏe tinh thần', color: '#ab47bc' },
            { icon: '🦷', title: 'Khám nha khoa', color: '#26c6da' },
            { icon: '💉', title: 'Gói Phẫu thuật', color: '#ef5350' },
            { icon: '🏃', title: 'Sống khỏe Tiểu đường', color: '#5c6bc0' },
            { icon: '📊', title: 'Bài Test Sức khỏe', color: '#ff7043' },
            { icon: '👨‍⚕️', title: 'Y tế gần bạn', color: '#26a69a' },
          ].map((service, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px 20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #e0e0e0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e3f2fd';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: service.color + '20',
                  borderRadius: '10px',
                }}
              >
                {service.icon}
              </div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                }}
              >
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties Section */}
      <section
        style={{
          padding: '50px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f5f5f5',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              fontSize: window.innerWidth <= 768 ? '20px' : '24px',
              color: '#333',
              margin: 0,
            }}
          >
            Chuyên khoa
          </h2>
          <button
            style={{
              background: '#e3f2fd',
              color: '#1976d2',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Xem thêm
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingBottom: '10px',
            }}
          >
            {[
              { icon: '🏥', title: 'Y học Cổ truyền', color: '#4fc3f7' },
              { icon: '🦴', title: 'Chấm cứu', color: '#66bb6a' },
              { icon: '👩‍⚕️', title: 'Sản Phụ khoa', color: '#ec407a' },
              { icon: '👩‍⚕️', title: 'Sản Phụ khoa', color: '#ec407a' },
              { icon: '👩‍⚕️', title: 'Sản Phụ khoa', color: '#ec407a' },
              { icon: '👩‍⚕️', title: 'Sản Phụ khoa', color: '#ec407a' },
              { icon: '👩‍⚕️', title: 'Sản Phụ khoa', color: '#ec407a' },
            ].map((specialty, index) => (
              <div
                key={index}
                style={{
                  minWidth: '200px',
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
                <div
                  style={{
                    fontSize: '60px',
                    marginBottom: '15px',
                  }}
                >
                  {specialty.icon}
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    color: '#333',
                    margin: 0,
                  }}
                >
                  {specialty.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div
        onClick={() => console.log('Trợ lý AI - Tôi có thể giúp gì cho bạn?')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#45c3d2',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(69, 195, 210, 0.4)',
          transition: 'transform 0.3s',
          zIndex: 99,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span
          style={{
            fontSize: '30px',
            color: 'white',
          }}
        >
          🤖
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: '-25px',
            fontSize: '11px',
            color: '#45c3d2',
            whiteSpace: 'nowrap',
            fontWeight: '500',
          }}
        >
          Trợ lý AI
        </span>
      </div>
      {/* Chatbot */}
      <div
        className="chatbot"
        onClick={() => alert('Trợ lý AI - Tôi có thể giúp gì cho bạn?')}
      >
        <span className="chatbot-icon">🤖</span>
        <span className="chatbot-label">Trợ lý AI</span>
      </div>
    </>
  );
}
