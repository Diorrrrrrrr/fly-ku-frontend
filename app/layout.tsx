// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers"; // [NEW] 프로바이더 불러오기

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

{
  /*export const metadata: Metadata = {
  title: "FLY-KU, Fly Light",
  description: "고려대 학생이 제작한 일본행 항공권 가격 변동 예측 AI",
};
*/
}

export const metadata: Metadata = {
  title: "FLY-KU | 일본행 항공권 가격 변동 예측 AI",
  description:
    "도쿄, 오사카 갈 때 비행기표 언제 살지 고민되나요? 약 13만개의 데이터로 학습된 AI가 지금 사야 할지, 기다려야 할지 알려드립니다! ✈️",
  openGraph: {
    title: "Fly-KU",
    description: "AI가 예측하는 일본행 항공권 가격 변동",
    url: "https://fly-ku-frontend.vercel.app",
    siteName: "FLY-KU",
    locale: "ko_KR",
    type: "website",
    // 💡 이미지는 2단계에서 넣은 opengraph-image.png를 Next.js가 자동으로 매칭합니다!
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* [NEW] Providers로 전체 앱을 감싸줍니다 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
