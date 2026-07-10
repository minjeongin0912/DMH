function Dock({
  items = [],
  className = '',
  panelHeight = 56,
  baseItemSize = 38,
  magnification = 46,
}) {
  return (
    <nav
      className={`dock-outer ${className}`}
      aria-label="모바일 하단 메뉴"
      style={{
        '--dock-panel-height': `${panelHeight}px`,
        '--dock-base-size': `${baseItemSize}px`,
        '--dock-magnified-size': `${magnification}px`,
      }}
    >
      <div className="dock-panel" role="toolbar">
        {items.map((item) => (
          <button
            className={`dock-item ${item.active ? 'active' : ''} ${item.className || ''}`}
            type="button"
            onClick={item.onClick}
            aria-label={item.label}
            key={item.label}
          >
            <span className="dock-icon">{item.icon}</span>
            <span className="dock-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Dock;
