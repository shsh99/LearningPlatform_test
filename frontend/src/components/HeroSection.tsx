import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  isDark: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    bgColor: "bg-[#0c0c0c]",
    textColor: "text-white",
    title: "WELCOME TO MZRUN!",
    subtitle: "당신의 성장을 위한\n최고의 교육 플랫폼",
    description: "전문가와 함께 새로운 기술을 배워보세요.",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    isDark: true
  },
  {
    id: 2,
    bgColor: "bg-[#F3E8FF]",
    textColor: "text-gray-900",
    title: "새로운 성장 여정",
    subtitle: "나만의 커리어 로드맵\n지금 설계하세요",
    description: "초보자부터 전문가까지, 단계별 학습 가이드",
    badge: "ROADMAP",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    isDark: false
  },
  {
    id: 3,
    bgColor: "bg-[#eef2ff]",
    textColor: "text-gray-900",
    title: "AI 시대의 필수 스킬",
    subtitle: "ChatGPT 활용부터\nLLM 개발까지",
    description: "현직자가 알려주는 실무 AI 노하우",
    badge: "AI TREND",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    isDark: false
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div className="w-full overflow-hidden font-sans relative">
      <div className={`w-full ${slide.bgColor} transition-colors duration-500`}>
        <div className="max-w-[1280px] mx-auto px-4 h-[320px] md:h-[400px] flex items-center justify-between relative">

          {/* Text Content */}
          <div className="z-10 max-w-lg space-y-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${slide.isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {slide.badge}
            </span>
            <h2 className={`text-lg md:text-xl font-bold ${slide.isDark ? 'text-orange-500' : 'text-[#6600FF]'}`}>
              {slide.title}
            </h2>
            <h1 className={`text-3xl md:text-5xl font-extrabold whitespace-pre-line leading-tight ${slide.textColor}`}>
              {slide.subtitle}
            </h1>
            <p className={`text-base md:text-lg ${slide.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {slide.description}
            </p>
            <button
              onClick={() => navigate('/courses')}
              className={`mt-4 px-6 py-3 rounded-lg font-bold transition-all ${
                slide.isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-[#6600FF] text-white hover:bg-[#5500D4]'
              }`}
            >
              강의 둘러보기
            </button>
          </div>

          {/* Image Content - Right Side */}
          <div className="hidden md:block absolute right-0 bottom-0 h-full w-1/2">
            <div className="h-full w-full flex items-center justify-center p-8">
              <img
                src={slide.image}
                alt="Banner"
                className="h-[80%] w-auto object-contain rounded-lg shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#6600FF] w-5'
                : 'bg-gray-300/50 hover:bg-[#6600FF]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
