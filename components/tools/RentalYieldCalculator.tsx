"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type YieldDict = {
  propertyValue: string;
  monthlyRent: string;
  operatingCost: string;
  resultsTitle: string;
  grossYield: string;
  netYield: string;
  annualIncome: string;
  annualExpenses: string;
};

export default function RentalYieldCalculator({ dict }: { dict: YieldDict }) {
  const [propertyValue, setPropertyValue] = useState<number>(5000000000);
  const [monthlyRent, setMonthlyRent] = useState<number>(25000000);
  const [operatingCost, setOperatingCost] = useState<number>(10);

  // Thu nhập hàng năm (Annual Rent)
  const annualRent = monthlyRent * 12;
  // Tổng chi phí vận hành hàng năm
  const annualExpenses = annualRent * (operatingCost / 100);
  // Doanh thu ròng
  const netIncome = annualRent - annualExpenses;

  // Lợi nhuận Gộp (Gross Yield) = (Doanh thu năm / Giá trị tài sản) * 100
  const grossYield = (annualRent / propertyValue) * 100;
  // Lợi nhuận Ròng (Net Yield) = (Doanh thu ròng / Giá trị tài sản) * 100
  const netYield = (netIncome / propertyValue) * 100;

  const chartData = [
    { name: "Gross", label: dict.grossYield, value: Number(grossYield.toFixed(2)), color: "#D4AF37" },
    { name: "Net", label: dict.netYield, value: Number(netYield.toFixed(2)), color: "#10B981" }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(val));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
      {/* Cột Trái: Input Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.propertyValue}</label>
            <span className="text-gold font-bold">{formatCurrency(propertyValue)}</span>
          </div>
          <input 
            type="range" min="1000000000" max="50000000000" step="50000000"
            value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.monthlyRent}</label>
            <span className="text-gold font-bold">{formatCurrency(monthlyRent)}</span>
          </div>
          <input 
            type="range" min="3000000" max="200000000" step="1000000"
            value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.operatingCost}</label>
            <span className="text-gold font-bold">{operatingCost}%</span>
          </div>
          <input 
            type="range" min="0" max="50" step="1"
            value={operatingCost} onChange={e => setOperatingCost(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>
      </div>

      {/* Cột Phải: Biểu Đồ & Kết Quả */}
      <div className="bg-charcoal/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">{dict.resultsTitle}</h3>
        
        {/* Kết quả chính */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Gross Yield</p>
            <p className="text-3xl font-light text-gold tracking-tight">{grossYield.toFixed(2)}%</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Net Yield</p>
            <p className="text-3xl font-light text-[#10B981] tracking-tight">{netYield.toFixed(2)}%</p>
          </div>
        </div>

        {/* Biểu đồ Cột */}
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                formatter={(value: number) => [`${value}%`, 'Tỷ suất']}
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê Footer */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-white/10 pt-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase mb-1">{dict.annualIncome}</p>
            <p className="font-semibold text-white break-words">{formatCurrency(annualRent)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase mb-1">{dict.annualExpenses}</p>
            <p className="font-semibold text-rose-400 break-words">-{formatCurrency(annualExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
