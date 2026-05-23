import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Calendar, Lock, CheckCircle2, DollarSign, X, HelpCircle, Activity, Sparkles, MessageCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockFullReport: () => void;
}

export default function PaymentModal({ isOpen, onClose, onUnlockFullReport }: PaymentModalProps) {
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoAction = (type: 'retest' | 'expert') => {
    if (type === 'retest') {
      setDemoMessage('💰 支付功能为 Demo 演示，正式版本将接入微信/支付宝支付系统（¥39/季度）。');
    } else {
      setDemoMessage('📅 专家解读功能为 Demo 演示，正式版本将实时同步执业心理专家日程安排，开放 1v1 预约（¥199/次）。');
    }
    setTimeout(() => {
      setDemoMessage(null);
    }, 5000);
  };

  const options = [
    {
      title: "选项一：完整自测报告",
      price: "首次免费",
      originalPrice: "¥19.00",
      isFree: true,
      tag: "当前测试解锁",
      tagColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      benefits: [
        "13分钟严格行为生物标点IVA-CPT测试",
        "28项临床统计学商数（Vigilance、Prudence等）",
        "听觉与视觉核心辨鸣优势评估",
        "ADHD高度怀疑状态/高多动偏离临床等级提示",
        "PDF终身免费下载与存档打印支持"
      ],
      btnText: "查看完整报告",
      action: () => {
        onUnlockFullReport();
        onClose();
      }
    },
    {
      title: "选项二：长期复测包",
      price: "¥39 / 季度",
      originalPrice: "¥58.00",
      tag: "推荐：长期追踪",
      tagColor: "bg-purple-50 text-purple-600 border-purple-200",
      benefits: [
        "额外解锁 3 次独立完整的 IVA-CPT 测评次数",
        "自动化记录每一次专注值，输出多周期波动趋势折线",
        "追踪服药变化、睡眠质量、学术期压力的注意力对比",
        "支持对比不同时期的视觉/听觉转换速度，量化波幅及差值",
        "季度进度分析，定制个性化日常居家专注干预指南"
      ],
      btnText: "解锁复测包",
      action: () => handleDemoAction('retest')
    },
    {
      title: "选项三：专家精准解读",
      price: "¥199 / 次",
      originalPrice: "¥299.00",
      tag: "高信任需求推荐",
      tagColor: "bg-amber-50 text-amber-600 border-amber-200",
      benefits: [
        "国家二级心理咨询师/三甲儿科顾问远程 15分钟深度视频",
        "结合受测者临床量表（ASRS等）及生活困扰立体剖析",
        "全面解释听觉/视觉失衡、抗漏率低等生物数值背后的生活投射",
        "就医方案建议：明确说明是否需要进一步做神经递质等多道检测",
        "家长特训或成人注意力训练科学作业包指导"
      ],
      btnText: "预约专家解读",
      action: () => handleDemoAction('expert')
    }
  ];

  return (
    <AnimatePresence>
      <div 
        id="payment_modal_overlay"
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      >
        {/* Underlay click closes */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Content container with responsive animations */}
        <motion.div
          initial={{ y: "100%", opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          id="payment_modal_card"
          className="relative bg-white w-full md:max-w-4xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden border-t md:border border-zinc-200"
        >
          {/* Sticky Header */}
          <div className="p-6 md:p-8 border-b border-zinc-150 relative bg-[#F9FAFB]">
            {/* Close button */}
            <button 
              onClick={onClose}
              id="payment_modal_close_btn"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 pr-10">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] uppercase font-black text-blue-600 tracking-widest">Report Depth Interpretation</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight leading-snug">
              下一步，你想怎样理解这份报告？
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
              不是只告诉你结果，而是帮你判断：现在的状态意味着什么，下一步该怎么做。
            </p>
          </div>

          {/* Scrolling Content - Tiers selection */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            
            {/* Demo Toast Message */}
            <AnimatePresence>
              {demoMessage && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-amber-500 text-white font-semibold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg leading-relaxed"
                >
                  <Sparkles className="w-4 h-4 shrink-0 animate-bounce" />
                  {demoMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {options.map((opt, i) => (
                <div 
                  key={i}
                  className={`border-2 rounded-[2rem] p-5 flex flex-col justify-between transition-all bg-zinc-50/50 ${
                    opt.isFree 
                      ? "border-emerald-600/30 bg-emerald-50/10 shadow-sm" 
                      : "border-zinc-200"
                  }`}
                >
                  <div>
                    {/* Header tag */}
                    <div className="mb-3 flex justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider ${opt.tagColor}`}>
                        {opt.tag}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-zinc-900 mb-1">{opt.title}</h3>
                    
                    {/* Price and Original */}
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className={`text-xl font-black ${opt.isFree ? "text-emerald-600" : "text-zinc-900"}`}>
                        {opt.price}
                      </span>
                      <span className="text-[10px] text-zinc-400 line-through font-bold">
                        {opt.originalPrice}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 border-t border-zinc-150 pt-3.5 mb-6">
                      {opt.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex gap-2 items-start text-[11px] font-semibold text-zinc-600 leading-relaxed">
                          <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${opt.isFree ? "text-emerald-500" : "text-blue-500"}`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Submit CTA */}
                  <button
                    id={`btn_payment_options_cta_${i}`}
                    onClick={opt.action}
                    className={`w-full py-3 rounded-xl text-xs font-black select-none transition-all cursor-pointer ${
                      opt.isFree 
                        ? "bg-slate-900 hover:bg-black text-white" 
                        : "bg-white border-2 border-zinc-910 text-zinc-900 hover:bg-zinc-55 hover:border-zinc-500"
                    }`}
                  >
                    {opt.btnText}
                  </button>
                </div>
              ))}
            </div>

            {/* Close action fallback */}
            <div className="text-center pt-2">
              <button 
                onClick={onClose}
                id="payment_modal_dismiss"
                className="text-xs text-zinc-400 hover:text-zinc-600 font-bold underline px-4 py-2 cursor-pointer transition-all"
              >
                暂时查看免费精炼报告 &gt;
              </button>
            </div>
          </div>

          {/* Sticky Legal compliance footer note */}
          <div className="p-5 md:p-6 bg-zinc-50 border-t border-zinc-150 text-[10px] text-zinc-400 leading-relaxed text-center font-medium">
            ⚠️ <strong>合规安全提示：</strong>本测评结果及报告解读建议仅用于注意力状态自我了解、科普认知以及日常健康管理参考，并不能替代医院执业临床专家的临床门诊诊断。如您日常生活感到明显的社会功能受损、注意力缺陷对学业或职业造成长期困扰，强烈建议前往正规三甲医院精神心理科进行面诊与多道量理学诊断评估。
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
