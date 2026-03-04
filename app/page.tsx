"use client";

import Link from "next/link"; // 👈 [NEW] 추가!
import AdBanner from "./components/AdBanner"; // 👈 [NEW] 배너 부품 가져오기
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"; // [NEW] 로그인 훅 추가

export default function Home() {
  const { data: session } = useSession(); // [NEW] 현재 로그인 상태 감지
  
  const [lang, setLang] = useState<"KR" | "JP">("KR");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<{ currency: number; oil_price: number } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [feedback, setFeedback] = useState({ email: "", subject: "", content: "" });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/market-data`)
      .then((res) => res.json())
      .then((data) => setMarketData(data.data))
      .catch((err) => console.error("시장 데이터를 불러오지 못했습니다.", err));
  }, []);

  const t = {
    KR: {
      langBtn: "🇯🇵 日本語",
      loginBtn: "G 구글 로그인",
      logoutBtn: "로그아웃",
      historyBtn: "📜 내 예측 기록",
      title: "Fly-KU, Fly 行く",
      subtitle: "고려대 학생이 제작한 일본행 항공권 구매 타이밍 예측 AI",
      desc1: "현재 도쿄·오사카 왕복 항공권만 지원합니다.",
      // ... (나머지 기존 텍스트 동일 생략 - 실제 파일엔 모두 유지됩니다)
      marketTitle: "🌏 실시간 시장 데이터",
      currencyLabel: "💴 현재 엔화 (100¥)",
      oilLabel: "🛢️ 국제 유가 (WTI)",
      uploadTitle: "항공권 검색 화면을 올려주세요",
      uploadSub: "클릭하여 이미지 선택 (JPG, PNG)",
      warn1: "❗행선지와 왕복 날짜 반드시 포함❗",
      warn2: "스카이스캐너나 항공사 앱 화면을 캡처해서 올리면 AI가 분석합니다.",
      warn3: "출발 100일 전 이내의 일정이 가장 정확합니다.",
      warn4: "오늘로부터 30일 이내의 가격 상승 가능성을 예측합니다.",
      btnAnalyze: "🔍 이미지 분석 및 예측하기",
      btnLoading: "AI 분석 및 예측 중... ⏳",
      resultDest: "여행지",
      resultDate: "일정",
      resultPrice: "현재 가격",
      buyTitle: "🔥 지금 구매를 추천합니다 (BUY)",
      waitTitle: "✋ 기다리세요 (WAIT)",
      probUp: "가격 상승 가능성: ",
      probDown: "가격 하락 가능성: ",
      guideTitle: "구간별 의미 안내",
      buyG1: "다양한 변수로 인해 가격 변동 가능성이 큽니다. 기다려봐도 좋습니다.",
      buyG2: "개인의 판단으로 구매해도 나쁘지 않습니다.",
      buyG3: "구매를 추천드립니다. 추후 가격 상승 가능성이 매우 높습니다.",
      buyG4: "가격이 오를 일만 남았습니다. 구매를 강력히 추천드립니다!",
      waitG1: "가격 하락 확률이 낮고 하락 폭이 적습니다. 구매를 고려해도 나쁘지 않습니다.",
      waitG2: "가격 하락 확률이 존재합니다. 기다리는 것을 추천드립니다.",
      waitG3: "높은 확률로 가격이 하락할 수 있습니다. 조금 더 기다려보세요.",
      waitG4: "거의 확실히 가격이 더 내려갈 것으로 보입니다. 기다리는 것을 강력히 추천드립니다!",
      feedbackBtn: "📧 문의 메일 보내기",
      feedbackTitle: "Fly-KU 서비스를 이용해주셔서 감사합니다. 불편한 점이나 개선할 점을 자유롭게 적어주세요! 🐯",
      phEmail: "답장 받으실 이메일 (example@korea.ac.kr)",
      phSubject: "제목",
      phContent: "내용을 입력해주세요.",
      sendBtn: "🚀 보내기",
    },
    JP: {
      langBtn: "🇰🇷 한국어",
      loginBtn: "G Google ログイン",
      logoutBtn: "ログアウト",
      historyBtn: "📜 私の予測履歴",
      title: "Fly-KU, Fly 行く",
      subtitle: "高麗大生が開発した日本行き航空券の購入タイミング予測AI",
      desc1: "現在、東京・大阪の往復航空券のみ対応しています。",
      // ... (나머지 기존 텍스트 동일 생략 - 실제 파일엔 모두 유지됩니다)
      marketTitle: "🌏 リアルタイム市場データ",
      currencyLabel: "💴 現在の円レート (100¥)",
      oilLabel: "🛢️ 国際原油価格 (WTI)",
      uploadTitle: "航空券の検索画面をアップロードしてください",
      uploadSub: "クリックして画像を選択 (JPG, PNG)",
      warn1: "❗目的地と往復の日付が必ず含まれている必要があります❗",
      warn2: "スカイスキャナーや航空会社アプリの画面をアップロードするとAIが分析します。",
      warn3: "出発100日前以内の日程が最も正確です。",
      warn4: "今日から30日以内の価格上昇の可能性を予測します。",
      btnAnalyze: "🔍 画像分析と予測",
      btnLoading: "AI 分析中... ⏳",
      resultDest: "目的地",
      resultDate: "日程",
      resultPrice: "現在の価格",
      buyTitle: "🔥 今すぐの購入をお勧めします (BUY)",
      waitTitle: "✋ 少し待ってください (WAIT)",
      probUp: "価格上昇の可能性: ",
      probDown: "価格下落の可能性: ",
      guideTitle: "確率ごとの意味",
      buyG1: "様々な要因により価格変動の可能性があります。もう少し待ってみるのも良いでしょう。",
      buyG2: "個人の判断で購入しても悪くありません。",
      buyG3: "購入をお勧めします。今後価格が上昇する可能性が非常に高いです。",
      buyG4: "価格が上がる一方です。今すぐの購入を強くお勧めします！",
      waitG1: "価格下落の確率が低く、下落幅も小さいです。購入を検討しても悪くありません。",
      waitG2: "価格下落の確率が存在します。待つことをお勧めします。",
      waitG3: "高い確率で価格が下落する可能性があります。もう少し待ってみてください。",
      waitG4: "ほぼ確実に価格がさらに下がると思われます。待つことを強くお勧めします！",
      feedbackBtn: "📧 お問い合わせ",
      feedbackTitle: "Fly-KUをご利用いただきありがとうございます。ご意見・ご要望など、自由にお書きください！ 🐯",
      phEmail: "返信先メールアドレス",
      phSubject: "件名",
      phContent: "内容を入力してください。",
      sendBtn: "🚀 送信",
    }
  };
  const ui = t[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      setResult(null);
      setShowGuide(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    // [NEW] 로그인한 상태라면 백엔드로 유저 이메일(ID)을 같이 보냅니다
    if (session?.user?.email) {
      formData.append("user_id", session.user.email);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("백엔드 서버 통신 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.email || !feedback.content) return alert("이메일과 내용을 입력해주세요.");
    setSendingEmail(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      if (res.ok) {
        alert("성공적으로 전송되었습니다!");
        setShowModal(false);
        setFeedback({ email: "", subject: "", content: "" });
      } else alert("전송에 실패했습니다.");
    } catch (err) {
      alert("서버 오류로 전송하지 못했습니다.");
    } finally {
      setSendingEmail(false);
    }
  };

  const getDDay = (dateStr: string) => {
    const depDate = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `D-${diffDays}` : "D-Day";
  };

  const getTier = (prob: number) => {
    if (prob < 60) return 1;
    if (prob < 75) return 2;
    if (prob < 90) return 3;
    return 4;
  };

  let currentProb = 0;
  let currentTier = 0;
  if (result?.prediction) {
    currentProb = result.prediction.decision === "BUY" ? result.prediction.prob_buy : result.prediction.prob_wait;
    currentTier = getTier(currentProb);
  }

  const highlightClass = "text-yellow-300 font-bold scale-[1.02] origin-left transition-all duration-300 drop-shadow-md";
  const normalClass = "text-white/80 transition-all duration-300";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 flex flex-col items-center font-sans relative">
      
      {/* [NEW] 최상단 네비게이션 바 (로그인 & 언어 변경) */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              {session.user?.image && <img src={session.user.image} alt="profile" className="w-6 h-6 rounded-full" />}
              <span className="text-sm font-bold text-gray-700">{session.user?.name}님</span>

              {/* <button className="text-sm font-bold text-[#860038] hover:text-[#6d002e] border-l pl-3 ml-1 transition">
                {ui.historyBtn}
              </button>
              */}

              {/* [수정 후] button 대신 Link를 사용합니다 */}
              <Link href="/history" className="text-sm font-bold text-[#860038] hover:text-[#6d002e] border-l pl-3 ml-1 transition">
                {ui.historyBtn}
              </Link>

              <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-600 transition ml-2">
                {ui.logoutBtn}
              </button>
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm font-bold text-sm hover:bg-gray-100 transition flex items-center gap-2">
              <span className="font-black text-[#860038]">G</span> {ui.loginBtn}
            </button>
          )}
        </div>
        
        <button onClick={() => setLang(lang === "KR" ? "JP" : "KR")} className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm font-bold text-sm hover:bg-gray-100 transition">
          {ui.langBtn}
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-5xl font-black text-[#860038] tracking-tight mb-3">{ui.title}</h1>
        <p className="text-lg text-gray-800 font-bold">{ui.subtitle}</p>
        <p className="text-sm text-gray-500 mt-1">{ui.desc1}</p>
      </div>

      {marketData && (
        <div className="w-full max-w-2xl mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-700">{ui.marketTitle}</h3>
          <div className="flex gap-4">
            <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-sm text-gray-500 font-bold mb-1">{ui.currencyLabel}</p>
              <p className="text-2xl font-black text-[#860038]">{marketData.currency.toFixed(2)} {lang === "KR" ? "원" : "KRW"}</p>
            </div>
            <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-sm text-gray-500 font-bold mb-1">{ui.oilLabel}</p>
              <p className="text-2xl font-black text-[#860038]">$ {marketData.oil_price.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 👈 [NEW] 여기에 배너를 쏙 끼워 넣습니다! */}
      {/* 👈 [NEW] 시장 데이터 아래 (가로로 2개 배치) */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-4 mb-6">
        <AdBanner 
          title="안암역 참살이길, 호호식당 🍱" 
          desc={<>Fly-KU 보여주면 <span className="text-[#860038] font-bold">가라아게 무료!</span></>} 
          emoji="🍗" 
          link="https://korea.ac.kr" 
        />
        <AdBanner 
          imageUrl="/junseo2-2.png" // (PM님이 쓰시는 이미지 파일명)
          link="https://naver.me/5HkQdUxb" 
        />
      </div>
      

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl flex flex-col items-center">
        <label className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#860038] bg-pink-50/30 rounded-xl p-10 hover:bg-pink-50 transition mb-6">
          <span className="text-4xl mb-4">📸</span>
          <span className="text-[#860038] font-bold text-lg mb-1">{ui.uploadTitle}</span>
          <span className="text-gray-500 text-sm">{ui.uploadSub}</span>
          <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
        </label>

        {previewUrl && (
          <div className="w-full flex flex-col items-center mb-6">
            <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-sm border border-gray-200 mb-4" />
            <button onClick={handleUpload} disabled={loading} className="w-full bg-[#860038] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-[#6d002e] transition disabled:bg-gray-400">
              {loading ? ui.btnLoading : ui.btnAnalyze}
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg w-full">
          <p className="font-bold text-[#860038] mb-2">{ui.warn1}</p>
          <p>{ui.warn2}</p>
          <p>{ui.warn3}</p>
          <p className="font-bold mt-1">{ui.warn4}</p>
        </div>
      </div>

      {/* 👈 [수정] sm:flex-row 뒤에 items-stretch 를 추가합니다! */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-4 mt-6">
        <AdBanner 
          title="고려대 학생 전용, KUPID 복지몰 🎁" 
          desc={<>이번 달 특가! <span className="text-[#860038] font-bold">애플 워치 15% 할인</span></>} 
          emoji="🍎" 
          link="https://kupid.korea.ac.kr/" 
        />
        <AdBanner 
          title="일본 여행 갈 땐, 트래블월렛 💳" 
          desc={<>지금 가입하면 <span className="text-blue-600 font-bold">100% 환율 우대!</span></>} 
          emoji="💴" 
          link="https://www.travel-wallet.com/" 
        />
      </div>

      {result && result.status === "success" && (
        <div className="w-full max-w-2xl mt-8 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            <div className={`p-6 text-center ${result.prediction.decision === "BUY" ? "bg-[#860038]" : "bg-gray-800"}`}>
              <h2 className="text-3xl font-bold text-white mb-3">
                {result.prediction.decision === "BUY" ? ui.buyTitle : ui.waitTitle}
              </h2>
              
              <div className="flex items-center justify-center gap-2">
                <p className="text-white/90 font-medium text-lg">
                  {result.prediction.decision === "BUY" ? ui.probUp : ui.probDown}
                  <span className="text-3xl font-black ml-1">{currentProb.toFixed(2)}%</span>
                </p>
                <button 
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-7 h-7 rounded-full border border-white/40 text-white/90 font-bold flex items-center justify-center text-sm hover:bg-white/20 transition-all focus:outline-none"
                  title="구간별 의미 보기"
                >
                  ?
                </button>
              </div>

              {/* [NEW] 동적 하이라이트가 적용된 구간 가이드 */}
              {showGuide && (
                <div className="mt-5 bg-black/20 rounded-xl p-5 text-left text-sm animate-fade-in-up border border-white/10">
                  <p className="font-bold mb-3 text-[15px] text-white">💡 {ui.guideTitle}</p>
                  <ul className="space-y-3">
                    {result.prediction.decision === "BUY" ? (
                      <>
                        <li className={`flex ${currentTier === 1 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">~ 60%</span><span>{ui.buyG1}</span></li>
                        <li className={`flex ${currentTier === 2 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">60~75%</span><span>{ui.buyG2}</span></li>
                        <li className={`flex ${currentTier === 3 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">75~90%</span><span>{ui.buyG3}</span></li>
                        <li className={`flex ${currentTier === 4 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">90% ~</span><span>{ui.buyG4}</span></li>
                      </>
                    ) : (
                      <>
                        <li className={`flex ${currentTier === 1 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">~ 60%</span><span>{ui.waitG1}</span></li>
                        <li className={`flex ${currentTier === 2 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">60~75%</span><span>{ui.waitG2}</span></li>
                        <li className={`flex ${currentTier === 3 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">75~90%</span><span>{ui.waitG3}</span></li>
                        <li className={`flex ${currentTier === 4 ? highlightClass : normalClass}`}><span className="font-bold w-[75px] shrink-0">90% ~</span><span>{ui.waitG4}</span></li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="p-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 font-bold mb-1">{ui.resultDest}</p>
                <p className="font-bold text-xl text-gray-800">✈️ {result.extracted_info.destination}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 font-bold mb-1">{ui.resultDate}</p>
                <p className="font-bold text-lg text-gray-800">{result.extracted_info.departure_date}</p>
                <p className="text-sm text-[#860038] font-black">{getDDay(result.extracted_info.departure_date)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 font-bold mb-1">{ui.resultPrice}</p>
                <p className="font-bold text-xl text-[#860038]">{result.extracted_info.price.toLocaleString()}{lang === "KR" ? "원" : "KRW"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 문의 메일 플로팅 버튼 및 모달 */}
      <button onClick={() => setShowModal(true)} className="fixed bottom-8 right-8 bg-[#860038] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition border-2 border-white z-40">
        📧
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-800 text-xl font-bold">✕</button>
            <h3 className="text-xl font-bold text-[#860038] mb-4">📧 {ui.feedbackBtn}</h3>
            <p className="text-sm text-gray-600 mb-6">{ui.feedbackTitle}</p>
            
            <input type="email" placeholder={ui.phEmail} className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#860038]" value={feedback.email} onChange={(e) => setFeedback({...feedback, email: e.target.value})} />
            <input type="text" placeholder={ui.phSubject} className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#860038]" value={feedback.subject} onChange={(e) => setFeedback({...feedback, subject: e.target.value})} />
            <textarea placeholder={ui.phContent} rows={4} className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#860038]" value={feedback.content} onChange={(e) => setFeedback({...feedback, content: e.target.value})} />
            <button onClick={handleFeedbackSubmit} disabled={sendingEmail} className="w-full bg-[#860038] text-white font-bold py-3 rounded-lg hover:bg-[#6d002e] transition disabled:bg-gray-400">
              {sendingEmail ? "전송 중..." : ui.sendBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}