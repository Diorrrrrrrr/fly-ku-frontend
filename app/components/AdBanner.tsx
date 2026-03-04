// app/components/AdBanner.tsx
import React from "react";

interface AdBannerProps {
  title?: string;
  desc?: React.ReactNode;
  emoji?: string;
  link: string;
  imageUrl?: string;
}

export default function AdBanner({ title, desc, emoji, link, imageUrl }: AdBannerProps) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      // 👈 [수정 1] flex-1을 줘서 짝꿍 배너와 똑같은 비율(50:50)로 늘어나게 합니다.
      className="flex-1 flex flex-col w-full hover:scale-[1.02] transition-transform duration-300"
    >
      {imageUrl ? (
        // 📸 이미지가 있을 때
        // 👈 [수정 2] flex-1로 부모 높이를 채우고, 이미지를 absolute로 액자에 꽉 끼웁니다.
        <div className="flex-1 w-full relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 min-h-[100px]">
          <img src={imageUrl} alt="Advertisement" className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute top-2 right-2 text-[10px] font-black text-white bg-black/40 px-2 py-0.5 rounded tracking-wider z-10">
            AD
          </span>
        </div>
      ) : (
        // 📝 텍스트 배너일 때
        // 👈 [수정 3] 여기도 flex-1을 줘서 높이가 부족해도 끝까지 늘어나게 만듭니다.
        <div className="flex-1 w-full bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden min-h-[100px]">
          <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
          <div className="flex flex-col z-10 mr-2">
            <span className="text-xs font-black text-[#860038] mb-1 bg-white/60 w-max px-2 py-0.5 rounded text-[10px] tracking-wider">
              SPONSOR
            </span>
            <h4 className="text-base font-black text-gray-800 tracking-tight mb-0.5 leading-tight">
              {title}
            </h4>
            <p className="text-xs text-gray-600 font-medium">
              {desc}
            </p>
          </div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-red-100 z-10 shrink-0">
            {emoji}
          </div>
        </div>
      )}
    </a>
  );
}