"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type MortgageDict = {
  propertyValue: string;
  loanPercent: string;
  interestRate: string;
  loanTerm: string;
  resultsTitle: string;
  monthlyPayment: string;
  totalPrincipal: string;
  totalInterest: string;
  chartPrincipal: string;
  chartInterest: string;
};

export default function MortgageCalculator({ dict }: { dict: MortgageDict }) {
  const [propertyValue, setPropertyValue] = useState<number>(3000000000);
  const [loanPercent, setLoanPercent] = useState<number>(70);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);

  // Vay = Giá trị nhà * (Tỷ lệ vay / 100)
  const principalAmount = propertyValue * (loanPercent / 100);
  // Lãi suất tháng
  const monthlyRate = interestRate / 100 / 12;
  // Tổng số tháng
  const totalMonths = loanTerm * 12;

  // Tính số tiền phải trả hàng tháng (Công thức PMT)
  const monthlyPayment = 
    (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  // Tổng tiền lãi = (Tiền trả hàng tháng * Tổng tháng) - Tiền gốc
  const totalInterest = (monthlyPayment * totalMonths) - principalAmount;

  const chartData = [
    { name: dict.chartPrincipal, value: principalAmount, color: "#D4AF37" }, // Gold
    { name: dict.chartInterest, value: totalInterest, color: "#1F2937" } // Dark gray
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(val));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
      {/* Cột Trái: Input Controls */}
      <div className="flex flex-col gap-6">
        {/* Tùy chỉnh Giá Trị */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.propertyValue}</label>
            <span className="text-gold font-bold">{formatCurrency(propertyValue)}</span>
          </div>
          <input 
            type="range" min="500000000" max="50000000000" step="100000000"
            value={propertyValue} onChange={e => setPropertyValue(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>

        {/* Tỷ lệ vay */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.loanPercent}</label>
            <span className="text-gold font-bold">{loanPercent}%</span>
          </div>
          <input 
            type="range" min="10" max="100" step="5"
            value={loanPercent} onChange={e => setLoanPercent(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>

        {/* Lãi suất */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.interestRate}</label>
            <span className="text-gold font-bold">{interestRate}%</span>
          </div>
          <input 
            type="range" min="1" max="20" step="0.1"
            value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>

        {/* Thời gian vay */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2">
            <label className="text-gray-300 font-medium">{dict.loanTerm}</label>
            <span className="text-gold font-bold">{loanTerm} {dict.loanTerm.includes('Years') || dict.loanTerm.includes('Năm') ? (dict.loanTerm.includes('Years') ? 'years' : 'năm') : ''}</span>
          </div>
          <input 
            type="range" min="1" max="35"
            value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}
            className="w-full g-slider"
          />
        </div>
      </div>

      {/* Cột Phải: Biểu Đồ & Kết Quả */}
      <div className="bg-charcoal/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">{dict.resultsTitle}</h3>
        
        {/* Kết quả chính */}
        <div className="text-center mb-6 w-full">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">{dict.monthlyPayment}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gold tracking-tight break-words">{formatCurrency(monthlyPayment)}</p>
        </div>

        {/* Biểu đồ Donut */}
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData} cx="50%" cy="50%"
                innerRadius={60} outerRadius={80}
                paddingAngle={5} dataKey="value" stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê Footer */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t border-white/10 pt-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase mb-1">{dict.totalPrincipal}</p>
            <p className="font-semibold text-white break-words">{formatCurrency(principalAmount)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs uppercase mb-1">{dict.totalInterest}</p>
            <p className="font-semibold text-white break-words">{formatCurrency(totalInterest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
