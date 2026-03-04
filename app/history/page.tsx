"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      if (status === "unauthenticated") setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/history?user_id=${session.user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setHistory(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("기록을 불러오지 못했습니다.", err);
        setLoading(false);
      });
  }, [session, status]);

  // [NEW] 1. 공항 코드 -> 도시 이름 + 코드 변환기
  const getCityName = (code: string) => {
    const map: Record<string, string> = {
      NRT: "도쿄 NRT",
      HND: "도쿄 HND",
      KIX: "오사카 KIX",
      FUK: "후쿠오카 FUK",
      OKA: "오키나와 OKA",
      NGO: "나고야 NGO",
      CTS: "삿포로 CTS",
    };
    return map[code?.toUpperCase()] || code; // 매핑 안 되면 원래 코드 반환
  };

  // [NEW] 3. 현재 날짜 기준 D-Day 실시간 계산기
  const getDDay = (dateStr: string) => {
    if (!dateStr) return "";
    const depDate = new Date(dateStr);
    const today = new Date();
    depDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return "D-Day";
    return `D+${Math.abs(diffDays)} (종료됨)`; // 이미 지난 일정 표시
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">기록을 불러오는 중... ⏳</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요한 페이지입니다. 🔒</h2>
        <Link href="/" className="bg-[#860038] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#6d002e] transition">
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-[#860038]">📜 내 예측 기록</h1>
        <Link href="/" className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm font-bold text-sm hover:bg-gray-100 transition">
          ⬅️ 메인으로
        </Link>
      </div>

      <div className="w-full max-w-3xl">
        {history.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 font-bold">
            아직 예측 기록이 없습니다. 항공권을 업로드해 보세요! ✈️
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((log) => (
              <div key={log.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition">
                <div className="flex flex-col gap-1">
                  
                  {/* 목적지와 D-Day 뱃지 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                      ✈️ {getCityName(log.destination_str)}
                    </span>
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${
                      getDDay(log.departure_date).includes('+') ? 'bg-gray-200 text-gray-500' : 'bg-pink-100 text-[#860038]'
                    }`}>
                      {getDDay(log.departure_date)}
                    </span>
                  </div>

                  {/* [NEW] 2. 출발 날짜 ↔ 복귀 날짜 */}
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    🗓️ {log.departure_date} ↔ {log.return_date || "편도/미정"}
                  </p>
                  
                  <p className="text-xl font-black text-gray-800 mt-1">
                    {log.price.toLocaleString()}원
                  </p>
                </div>

                <div className={`px-5 py-3 rounded-xl font-black text-white flex flex-col items-center justify-center ${log.ai_decision === 'BUY' ? 'bg-[#860038]' : 'bg-gray-800'}`}>
                  <span>{log.ai_decision}</span>
                  <span className="text-xs font-normal opacity-80">{log.ai_prob.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}