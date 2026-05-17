"use client";

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Loader2 } from 'lucide-react';

const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Placeholder
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "propertyId", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "buyShares",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export interface PurchaseButtonProps {
  propertyId: string | number;
  amount: number;
  priceNative: string; // e.g., "0.1" for 0.1 ETH/MATIC
  locale: string;
}

export function PurchaseButton({ propertyId, amount, priceNative, locale }: PurchaseButtonProps) {
  const { isConnected } = useAccount();
  const [isSuccessLocal, setIsSuccessLocal] = useState(false);

  const { writeContract, data: hash, error: writeError, isPending: isWriting } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash, 
  });

  const handlePurchase = () => {
    // @ts-ignore: Wagmi v2 strict typing issue with missing optional properties
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'buyShares',
      args: [BigInt(propertyId), BigInt(amount)],
      value: parseEther(priceNative),
    });
  };

  if (!isConnected) {
    return (
      <div className="w-full">
        {/* Render w3m connect button inside a div so it fills space nicely if needed */}
        {/* @ts-ignore: Web component from Web3Modal */}
        <w3m-button size="md" />
        <p className="text-xs text-champagne/60 mt-2 font-light">
          {locale === 'vi' ? 'Vui lòng kết nối ví Web3 để đúc (Mint) cổ phần.' : 'Please connect your Web3 wallet to mint shares.'}
        </p>
      </div>
    );
  }

  if (isConfirmed || isSuccessLocal) {
    return (
      <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-center">
        <h4 className="font-bold text-sm mb-1">{locale === 'vi' ? 'Giao dịch thành công!' : 'Transaction Successful!'}</h4>
        <p className="text-xs font-light">
          {locale === 'vi' ? 'Bạn đã đúc thành công cổ phần của dự án này.' : 'You have successfully minted shares for this project.'}
        </p>
        {hash && (
          <a href={`https://amoy.polygonscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[10px] uppercase tracking-widest border-b border-green-500/50 hover:text-green-300">
            {locale === 'vi' ? 'Xem trên Polygonscan' : 'View on Polygonscan'}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <button 
        onClick={handlePurchase}
        disabled={isWriting || isConfirming}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-jet-black py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.3)]"
      >
        {(isWriting || isConfirming) ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isConfirming ? (locale === 'vi' ? 'Đang xác nhận chuỗi...' : 'Confirming on chain...') : (locale === 'vi' ? 'Đang chờ ký ví...' : 'Waiting for signature...')}
          </>
        ) : (
          locale === 'vi' ? `Mua ${amount} cổ phần (${priceNative} MATIC)` : `Mint ${amount} Shares (${priceNative} MATIC)`
        )}
      </button>
      
      {writeError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mt-2 font-light break-words">
          {locale === 'vi' ? 'Lỗi giao dịch:' : 'Transaction Error:'} {writeError.message.slice(0, 100)}...
        </div>
      )}
    </div>
  );
}
