import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, category, icon: Icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen 
          ? 'bg-white shadow-premium border-primary/30 ring-1 ring-primary/20' 
          : 'bg-white/70 hover:bg-white border-white/90 hover:border-cream-border/90 shadow-glass'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left p-5 md:p-6 text-midnight gap-4 focus:outline-none group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen 
              ? 'bg-primary text-white shadow-glow' 
              : 'bg-cream-darker/80 text-gray-400 group-hover:text-primary group-hover:bg-primary/10'
          }`}>
            {Icon ? <Icon size={18} /> : <HelpCircle size={18} />}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            {category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {category}
              </span>
            )}
            <span className={`font-display font-bold text-base md:text-lg transition-colors duration-200 ${
              isOpen ? 'text-primary' : 'text-midnight group-hover:text-primary'
            }`}>
              {question}
            </span>
          </div>
        </div>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-primary/10 text-primary rotate-180' 
            : 'bg-cream-darker/70 text-gray-400 group-hover:text-primary group-hover:bg-primary/10'
        }`}>
          <ChevronDown size={16} />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-5 pb-6 md:px-6 md:pb-6 pt-1 text-gray-600 text-sm md:text-[15px] leading-relaxed border-t border-cream-border/50">
          <p className="pl-0 md:pl-[3.35rem]">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
