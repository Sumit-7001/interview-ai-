import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-cream-border py-4 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 text-midnight font-medium hover:text-primary transition-colors focus:outline-none"
      >
        <span className="font-display font-semibold text-base md:text-lg">{question}</span>
        <span className="text-primary bg-primary/5 p-1.5 rounded-lg border border-primary/10">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-48 mt-2 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-500 text-sm md:text-base leading-relaxed pl-1 pb-2">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FAQItem;
