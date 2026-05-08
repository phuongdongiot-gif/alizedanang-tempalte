"use client";
import React, { useState } from "react";
import { FloorPlansData } from "../types";

export default function FloorPlans({ data }: { data: FloorPlansData }) {
  const [activeTab, setActiveTab] = useState("plan-1pn");

  return (
    <section id="floorplans" className="pt-40 pb-32 bg-midnight-blue text-pearl-white border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24">
          <div className="max-w-3xl">
            <span className="text-[10px] text-gold tracking-[0.4em] uppercase font-light mb-6 block opacity-80">{data.sectionTag}</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] font-light tracking-tight">{data.title}</h2>
            <p className="mt-6 text-champagne/60 font-light text-sm max-w-2xl leading-[2]">{data.description}</p>
          </div>
        </div>

        <div className="flex space-x-8 md:space-x-16 mb-10 md:mb-14 border-b border-white/10 w-full overflow-x-auto pb-6">
          {data.plans.map((p) => (
            <button key={p.id} onClick={() => setActiveTab(p.id)} className={`pb-2 whitespace-nowrap font-light text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 border-b ${activeTab === p.id ? "text-gold border-gold" : "text-champagne/40 border-transparent hover:text-pearl-white"}`}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="relative min-h-[500px]">
          {data.plans.map((p) => (
             <div key={p.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center transition-all duration-700 absolute inset-0 z-10 w-full ${activeTab === p.id ? "opacity-100 relative" : "opacity-0 pointer-events-none"}`}>
               <div className="lg:col-span-7 bg-jet-black/40 p-10 flex justify-center items-center h-[550px] border border-white/5 relative overflow-hidden rounded">
                 <div className="absolute inset-0 bg-white/5 opacity-50"></div>
                 <div className="text-center font-light text-champagne/30 text-[11px] uppercase tracking-[0.3em] relative z-10 w-full h-full flex justify-center items-center">
                   {p.img ? <img src={p.img} className="max-w-full max-h-full object-contain" alt="" /> : `[ Floor Plan Mockup: ${p.name} ]`}
                 </div>
               </div>
               <div className="lg:col-span-5">
                 <h3 className="font-serif text-3xl lg:text-4xl font-light mb-8 text-pearl-white">{p.spaceName}</h3>
                 <p className="text-champagne/60 mb-12 font-light leading-[2] text-sm">{p.desc}</p>
                 <div className="grid grid-cols-2 gap-y-10 gap-x-8 pt-10 border-t border-white/10">
                   <div><span className="block text-[10px] uppercase tracking-[0.2em] text-champagne/40 mb-2">{p.specLeftLabel}</span><span className="text-xl font-light text-gold">{p.specLeftValue}</span></div>
                   <div><span className="block text-[10px] uppercase tracking-[0.2em] text-champagne/40 mb-2">{p.specRightLabel}</span><span className="text-xl font-light text-pearl-white">{p.specRightValue}</span></div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
