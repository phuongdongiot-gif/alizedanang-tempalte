"use client";

import { useState } from "react";
import MortgageCalculator from "../tools/MortgageCalculator";
import RentalYieldCalculator from "../tools/RentalYieldCalculator";
import TaxCalculator from "../tools/TaxCalculator";

export default function HomeTools({ data, locale }: { data: any, locale: string }) {
  const [activeTab, setActiveTab] = useState<"mortgage" | "yield" | "tax">("mortgage");
  const t = data;

  if (!t || !t.tabs) return null;

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-5xl mx-auto w-full relative border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-8 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-light text-white mb-3 tracking-tight">
          {t.title}
        </h2>
        <p className="text-gray-400 text-sm">
          {t.subtitle}
        </p>
      </div>

      {/* Cụm Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <button
          onClick={() => setActiveTab("mortgage")}
          className={`px-6 pb-2 border-b-[3px] border-double text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
            activeTab === "mortgage" 
              ? "border-gold text-gold" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          {t.tabs.mortgage}
        </button>
        <button
          onClick={() => setActiveTab("yield")}
          className={`px-6 pb-2 border-b-[3px] border-double text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
            activeTab === "yield" 
              ? "border-gold text-gold" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          {t.tabs.yield}
        </button>
        <button
          onClick={() => setActiveTab("tax")}
          className={`px-6 pb-2 border-b-[3px] border-double text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
            activeTab === "tax" 
              ? "border-gold text-gold" 
              : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
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
    </section>
  );
}
