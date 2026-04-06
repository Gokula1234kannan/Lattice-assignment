import React from 'react';

const GlassCard = ({ children, className = '', title, icon: Icon }) => {
  return (
    <div className={`glass-card ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-4 opacity-80">
          {Icon && <Icon size={20} className="text-primary" />}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
