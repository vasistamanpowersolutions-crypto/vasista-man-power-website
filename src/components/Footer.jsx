import React from 'react';

const Footer = () => {
  return (
    <footer className="hidden lg:block relative bg-primary overflow-hidden">
      {/* Top Curved Wave - Seamlessly connected to content above */}
      <div className="footer-wave absolute top-0 left-0 w-full h-[60px] bg-white z-0">
        <svg 
          viewBox="0 0 1440 100" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
        >
          <path 
            fill="#002147" 
            d="M0,80 C400,100 1000,0 1440,30 L1440,100 L0,100 Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10 pt-20 pb-12">
        <div className="flex justify-center md:justify-end md:pr-10 lg:pr-32">
          <div className="max-w-[420px] flex items-start gap-4">
            {/* White Quotation Icon */}
            <div className="shrink-0 mt-1">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M10 11H6C5.44772 11 5 10.5523 5 10V7C5 6.44772 5.44772 6 6 6H9C9.55228 6 10 6.44772 10 7V13C10 14.6569 8.65685 16 7 16" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M19 11H15C14.4477 11 14 10.5523 14 10V7C14 6.44772 14.4477 6 15 6H18C18.5523 6 19 6.44772 19 7V13C19 14.6569 17.6569 16 16 16" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Mission Text */}
            <p className="text-white text-[15px] md:text-base font-medium leading-relaxed opacity-95">
              Our mission is to empower people and businesses <br className="hidden md:block" /> to achieve more together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
