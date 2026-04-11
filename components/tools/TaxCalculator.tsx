"use client";

import { useState } from "react";

type TaxDict = {
  propertyValue: string;
  resultsTitle: string;
  personalIncomeTax: string;
  registrationFee: string;
  appraisalFee: string;
  notaryFee: string;
  totalEstimated: string;
  note: string;
};

export default function TaxCalculator({ dict }: { dict: TaxDict }) {
  const [propertyValue, setPropertyValue] = useState<number>(3000000000);

  // Thuế TNCN (2%)
  const personalIncomeTax = propertyValue * 0.02;
  // Lệ phí trước bạ (0.5%)
  const registrationFee = propertyValue * 0.005;
  // Phí thẩm định hồ sơ (0.15%, tối đa thường 5 triệu nhưng ước tính chuẩn 0.15%)
  let appraisalFee = propertyValue * 0.0015;
  if (appraisalFee > 5000000) appraisalFee = 5000000;
  
  // Ước lượng phí công chứng (nằm trong khoảng bậc thang, đơn giản hóa lấy mốc cơ bản)
  // Thực tế: Tỷ lệ luỹ thoái tuỳ giá trị, giả lập nhanh: ~ 0.1% hoặc mốc theo luật định. 
  // Để đơn giản, tính 0.1% nhưng không quá 10.000.000 VNĐ.
  let notaryFee = propertyValue * 0.001;
  if (notaryFee > 10000000) notaryFee = 10000000;

  const totalTax = personalIncomeTax + registrationFee + appraisalFee + notaryFee;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(val));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Input */}
      <div className="bg-charcoal/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 mb-8">
        <div className="flex justify-between mb-2">
          <label className="text-gray-300 font-medium">{dict.propertyValue}</label>
          <span className="text-gold font-bold text-xl">{formatCurrency(propertyValue)}</span>
        </div>
        <input 
          type="range" min="500000000" max="50000000000" step="50000000"
          value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))}
          className="w-full g-slider mt-4"
        />
      </div>

      {/* Kết quả chi tiết */}
      <div className="bg-gradient-to-br from-charcoal/60 to-[#0B101A] backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-center">{dict.resultsTitle}</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-white/5">
            <span className="text-gray-400">{dict.personalIncomeTax}</span>
            <span className="text-white font-medium text-lg mt-1 sm:mt-0">{formatCurrency(personalIncomeTax)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-white/5">
            <span className="text-gray-400">{dict.registrationFee}</span>
            <span className="text-white font-medium text-lg mt-1 sm:mt-0">{formatCurrency(registrationFee)}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-white/5">
            <span className="text-gray-400">{dict.appraisalFee}</span>
            <span className="text-white font-medium text-lg mt-1 sm:mt-0">{formatCurrency(appraisalFee)}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-white/5">
            <span className="text-gray-400">{dict.notaryFee}</span>
            <span className="text-white font-medium text-lg mt-1 sm:mt-0">{formatCurrency(notaryFee)}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/30">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gold/10 p-4 rounded-xl border border-gold/20">
            <span className="text-gold font-bold uppercase tracking-wider mb-2 sm:mb-0">{dict.totalEstimated}</span>
            <span className="text-3xl font-light text-gold">{formatCurrency(totalTax)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 italic">{dict.note}</p>
      </div>
    </div>
  );
}
