import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, description, trend, trendType }) => {
  return (
    <div className="glass-card p-4 sm:p-5 shadow-xs border border-cream-border/60 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between bg-white/90 rounded-2xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">{title}</span>
          <span className="font-display font-extrabold text-2xl text-midnight mt-0.5">{value}</span>
        </div>
        <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl border border-primary/20 flex items-center justify-center shrink-0">
          <Icon size={17} />
        </div>
      </div>
      
      {(description || trend) && (
        <div className="mt-3 pt-2.5 border-t border-cream-border/40 flex items-center justify-between text-xs">
          {description && <span className="text-gray-500 text-[11px] truncate max-w-[130px]">{description}</span>}
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trendType === 'up'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                : trendType === 'down'
                ? 'bg-red-50 text-red-600 border border-red-200/60'
                : 'bg-gray-100 text-gray-600'
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
