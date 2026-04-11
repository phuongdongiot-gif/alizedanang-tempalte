"use client";

import { useState, use } from "react";
import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";
import MortgageCalculator from "@/components/tools/MortgageCalculator";
import RentalYieldCalculator from "@/components/tools/RentalYieldCalculator";
import TaxCalculator from "@/components/tools/TaxCalculator";
import { getDictionary } from "@/dictionaries";

export default function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [activeTab, setActiveTab] = useState<"mortgage" | "yield" | "tax">("mortgage");
  
  // Lấy dữ liệu đa ngôn ngữ trực tiếp từ hàm đồng bộ
  const dict = getDictionary(locale);
  const t = dict.portal.tools;

  return (
    <div className="bg-[#070A10] min-h-screen font-sans selection:bg-gold/30 flex flex-col">
      <PortalHeader nav={dict.portal.nav} locale={locale} />
      
      <main className="flex-1pt-32 pb-24 pt-32 lg:pt-40 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Cụm Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <button
            onClick={() => setActiveTab("mortgage")}
            className={`px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
              activeTab === "mortgage" 
                ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.tabs.mortgage}
          </button>
          <button
            onClick={() => setActiveTab("yield")}
            className={`px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
              activeTab === "yield" 
                ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.tabs.yield}
          </button>
          <button
            onClick={() => setActiveTab("tax")}
            className={`px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
              activeTab === "tax" 
                ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.tabs.tax}
          </button>
        </div>

        {/* Nội dung Tool */}
        <div className="w-full relative min-h-[500px]">
          {activeTab === "mortgage" && <MortgageCalculator dict={t.mortgage} />}
          {activeTab === "yield" && <RentalYieldCalculator dict={t.yield} />}
          {activeTab === "tax" && <TaxCalculator dict={t.tax} />}
        </div>
      </main>

      <PortalFooter footer={dict.portal.footer} locale={locale} />
    </div>
  );
}
