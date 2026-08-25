import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, description, trend, trendType }) => {
  return (
    <div className="glass-card p-6 shadow-premium border border-cream-border/60 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</span>
          <span className="font-display font-bold text-3xl text-midnight mt-1">{value}</span>
        </div>
        <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
          <Icon size={20} />
        </div>
      </div>
      
      {(description || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs">
          {description && <span className="text-gray-500">{description}</span>}
          {trend && (
            <span className={`font-semibold ${
              trendType === 'up' ? 'text-green-500' : trendType === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
