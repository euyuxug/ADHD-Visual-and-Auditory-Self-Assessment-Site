import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Image, Check, X, FileText, QrCode, ClipboardCheck, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    age: number;
    gender: string;
    testDate: string;
    riskLevel: string;
    summaryText: string;
    preference: string;
  };
}

export default function ShareModal({ isOpen, onClose, userData }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [saveImageMessage, setSaveImageMessage] = useState(false);

  if (!isOpen) return null;

  // Mask name for privacy as instructed ("默认使用匿名表达")
  const maskedName = userData.name ? `${userData.name.charAt(0)}**` : '匿名受测者';
  const shareDate = new Date(userData.testDate).toLocaleDateString('zh-CN');

  const shareText = `【注意力状态评估报告】\n我完成了一次注意力状态自测。结果显示，我的双规注意力偏离等级为 [${userData.riskLevel}]。${userData.summaryText} 处理表现上呈 [${userData.preference}]。测评不代替终期医学诊断，但能让我更科学地理解自己的日常精力分配状态与认知波动。 
👉 快速评估你的注意力：https://ais-pre-nwa7svrzljkjzibg5vvlwl-201908168484.us-west2.run.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveImage = () => {
    setSaveImageMessage(true);
    setTimeout(() => setSaveImageMessage(false), 4000);
  };

  return (
    <AnimatePresence>
      <div 
        id="share_modal_overlay"
        className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
      >
        {/* Overlay click to exit */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          id="share_modal_card"
          className="relative bg-zinc-900 text-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-800 z-10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold tracking-tight text-lg">分享我的注意力状态报告</span>
            </div>
            <button 
              onClick={onClose}
              id="btn_close_share_modal"
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Copy success bubble */}
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <ClipboardCheck className="w-4 h-4" /> 报告摘要已成功复制到剪贴板，您可以立即分享给家人、老师或医生啦！
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simulated Save Bubble */}
            <AnimatePresence>
              {saveImageMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-indigo-600 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0 animate-spin" /> 保存图片功能为 Demo 演示，正式版本将渲染高分辨率无损 PNG 图片包。
                </motion.div>
              )}
            </AnimatePresence>

            {/* VISUAL SHARE POSTER CARD PANEL (Aesthetic bento poster layout) */}
            <div>
              <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2.5">
                Visualization Card 分享海报预览
              </div>
              
              <div 
                id="share_poster_card"
                className="bg-white text-zinc-900 rounded-[2rem] p-6 border-2 border-zinc-900 shadow-xl relative overflow-hidden"
              >
                {/* Branding Top Badge */}
                <div className="flex justify-between items-center border-b border-zinc-150 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center text-white text-xs font-black">
                      Ψ
                    </div>
                    <span className="font-black text-xs uppercase tracking-tight text-zinc-900">
                      ADHD 视听自测平台
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">
                    {shareDate}
                  </span>
                </div>

                {/* Patient Profile anonymous */}
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  受测成员
                </div>
                <div className="font-black text-sm text-zinc-900 mb-4 tracking-tight">
                  {maskedName} ({userData.age}岁 · {userData.gender})
                </div>

                {/* Risk state display */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col items-center text-center gap-1.5 mb-4">
                  <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    注意力状态异常偏离偏级
                  </div>
                  <div className="font-black text-2xl text-indigo-700 leading-none">
                    {userData.riskLevel}
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-normal font-semibold mt-1">
                    {userData.summaryText}
                  </p>
                </div>

                {/* Preference indicators and QR block in adjacent split columns */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                      脑信息加工优势
                    </span>
                    <span className="font-extrabold text-xs text-zinc-850 bg-blue-50 text-blue-800 border border-blue-100 px-2.5 py-1 rounded-lg inline-block">
                      {userData.preference}
                    </span>
                  </div>

                  <div className="flex justify-end items-center gap-2">
                    <div className="text-right">
                      <span className="text-[8px] font-bold text-zinc-400 tracking-wide block">
                        扫描二维码
                      </span>
                      <span className="text-[9px] font-black text-indigo-600 block">
                        参与双规测试
                      </span>
                    </div>
                    {/* Placeholder beautiful QR matrix */}
                    <div className="w-10 h-10 border border-zinc-300 rounded-md flex items-center justify-center bg-zinc-50">
                      <QrCode className="w-7 h-7 text-zinc-700" />
                    </div>
                  </div>
                </div>

                {/* Disclaimer disclaimer bottom of visual card */}
                <div className="mt-5 pt-3.5 border-t border-dashed border-zinc-200 flex items-start gap-1">
                  <span className="text-[8px] text-zinc-400 font-medium leading-relaxed">
                    * 声明：本卡片结果仅提供给家属或心理学同好用于注意力习惯性测评参考，不附带任何执业精神科门诊药方法律指控力。
                  </span>
                </div>
              </div>
            </div>

            {/* Split actions */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                id="btn_copy_summary"
                onClick={handleCopy}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> 复制文本摘要
              </button>
              
              <button
                id="btn_save_share_image"
                onClick={handleSaveImage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Image className="w-3.5 h-3.5" /> 保存到相册
              </button>
            </div>

            <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-800 flex gap-3 items-start text-[11px] text-zinc-400 leading-relaxed font-semibold">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-700 text-[9px] shrink-0 font-bold select-none mt-0.5">
                i
              </span>
              <p>为了全面保障您的医学隐私，自动生成的分享卡片已隐去报告编号及您的真实全名。默认采用首字匿名（如：张**）遮蔽方式。</p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
