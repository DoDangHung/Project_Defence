import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminLayout({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  menuItems,
  activeTab,
  setActiveTab,
}) {
  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64' : 'w-20'}
        bg-gradient-to-b from-blue-700 to-blue-900 text-white
        transition-all duration-300 flex flex-col h-full z-50
        fixed lg:relative
        ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}
    >
      {/* Toggle Desktop */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 p-1.5 rounded-full shadow text-white"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Close Mobile */}
      <button
        onClick={() => setMobileMenuOpen(false)}
        className="lg:hidden absolute right-4 top-4 p-2 text-white"
      >
        <X size={20} />
      </button>

      {/* Title */}
      <div className="p-6 border-b border-blue-600">
        {sidebarOpen ? (
          <>
            <h1 className="font-bold text-xl">🏥 Admin Panel</h1>
            <p className="text-blue-200 text-sm">Hospital Management</p>
          </>
        ) : (
          <div className="text-2xl text-center">🏥</div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 border-l-4 border-white'
                : 'hover:bg-blue-600/50'
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
