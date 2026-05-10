import { TrendingUp, Calculator, PieChart, Info } from "lucide-react";

interface ApartmentInvestmentProps {
  pricePerM2: string;
  estRent: string;
  estYield: string;
}

export default function ApartmentInvestment({ pricePerM2, estRent, estYield }: ApartmentInvestmentProps) {
  return (
    <div className="mb-4 md:mb-8">
      <h2 className="font-serif text-3xl font-light mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
        <TrendingUp className="text-gold" size={28} />
        Phân Tích & Đầu Tư
      </h2>
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
              <Calculator size={14} />
              <span>Đơn Giá Ước Tính</span>
            </div>
            <div className="text-2xl font-serif text-white">{pricePerM2} <span className="text-sm font-sans text-white/50">VNĐ/m²</span></div>
          </div>
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:px-6">
            <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
              <PieChart size={14} />
              <span>Giá Thuê Đề Xuất</span>
            </div>
            <div className="text-2xl font-serif text-white">{estRent} <span className="text-sm font-sans text-white/50">VNĐ/Tháng</span></div>
          </div>
          <div className="text-center md:text-left md:pl-6 relative">
            <div className="flex items-center justify-center md:justify-start gap-2 text-champagne/60 text-xs tracking-widest uppercase mb-3">
              <TrendingUp size={14} />
              <span>Tỷ Suất Sinh Lời (ROI)</span>
              <div className="group cursor-help relative">
                <Info size={12} className="text-gold" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-jet-black text-[10px] p-2 border border-white/10 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                  Tính toán dựa trên giá thuê trung bình 0.5% giá trị BĐS / tháng.
                </div>
              </div>
            </div>
            <div className="text-3xl font-serif text-gold">~{estYield}% <span className="text-sm font-sans text-white/50">/Năm</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
