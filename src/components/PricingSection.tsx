import React from 'react';
import { ShieldCheck, Heart, Sparkles, Brain, CheckCircle2, History, MessageSquare, Video, ArrowRight, UserCheck } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tier: 'screening' | 'full' | 'retest' | 'expert') => void;
  hideTrialBtn?: boolean;
}

export default function PricingSection({ onSelectTier, hideTrialBtn = false }: PricingSectionProps) {
  const tiers = [
    {
      id: 'screening' as const,
      name: "1. 基础轻筛",
      price: "免费",
      sub: "适合科普与简单筛查",
      tag: "极速体验",
      tagColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
      desc: "适合初步判断自己是否存在注意力困扰，降低首次尝试门槛。",
      features: [
        "ASRS v1.1日常行为问卷",
        "日常表现度异常偏离值分析",
        "初步专注度评估结论",
        "就医倾向判断参考"
      ],
      ctaText: "免费开始轻筛",
      primary: false
    },
    {
      id: 'full' as const,
      name: "2. 完整报告",
      price: "首次免费",
      sub: "适合自我怀疑与精确自测",
      tag: "13min 专业级",
      tagColor: "bg-blue-100 text-blue-700 border-blue-200",
      desc: "通过行为数据观察注意力、冲动控制、持续专注和稳定性，解答“我是不是 ADHD”。",
      features: [
        "13分钟行为刺激IVA-CPT自测",
        "28项临床标准商数评估报告",
        "听觉/视觉注意力整合比对",
        "六项核心维度柱状分布与雷达图",
        "可作为门诊就医的前置参考依据"
      ],
      ctaText: "开始完整测评",
      primary: true
    },
    {
      id: 'retest' as const,
      name: "3. 长期复测包",
      price: "¥39 / 季度",
      sub: "适合规律服药与学习追踪",
      tag: "推荐：适合长期追踪",
      tagColor: "bg-purple-100 text-purple-700 border-purple-200 animate-pulse",
      desc: "记录服药前后、日常压力期、期末考试期、睡眠变动后的注意力波动，用趋势图对比状态。",
      features: [
        "季度内享受 3 次完整复测额度",
        "可生成三次检测的历史波动趋势图",
        "支持特定触发场景记录与标签分类",
        "系统复测提醒（周/月周期）",
        "生成季度分析总结报告"
      ],
      ctaText: "解锁长期复测",
      primary: false
    },
    {
      id: 'expert' as const,
      name: "4. 专家解读",
      price: "¥199 / 次",
      sub: "适合深度答疑与儿童家长评估",
      tag: "高信任需求",
      tagColor: "bg-amber-100 text-amber-700 border-amber-200",
      desc: "适合对报告结果仍有疑问，或希望在真正进一步就医前获得专业解释和针对性行动建议。",
      features: [
        "由持有国家执业证书的心理师解读",
        "15分钟视频/语音1v1精准咨询",
        "解答有关报告中红字异常指标",
        "提供专业的行为管理/居家调整计划",
        "明确是否建议就医及后续评测建议"
      ],
      ctaText: "预约专家解读",
      primary: false
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          BUSINESS MODEL 服务分层与定价
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 mt-3">
          选择适合你的注意力状态服务
        </h2>
        <p className="mt-2 text-sm text-zinc-500 font-medium max-w-lg mx-auto">
          从一次轻筛，到长期追踪，逐步看懂自己的注意力状态。
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`border-2 rounded-[2rem] p-6 flex flex-col justify-between transition-all ${
              tier.primary
                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10 lg:-translate-y-2"
                : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg text-zinc-900"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-[10px] font-black border uppercase tracking-wider rounded-lg ${tier.primary ? "bg-blue-600 border-transparent text-white" : tier.tagColor}`}>
                  {tier.tag}
                </span>
              </div>

              <h3 className="text-lg font-black tracking-tight mb-1">{tier.name}</h3>
              <p className={`text-xs mb-4 min-h-[32px] ${tier.primary ? 'text-zinc-300' : 'text-zinc-400'}`}>
                {tier.sub}
              </p>

              {/* Price */}
              <div className="mb-5 flex items-baseline gap-1">
                <span className={`text-3xl font-black tracking-tighter ${tier.primary ? 'text-blue-400' : 'text-zinc-900'}`}>
                  {tier.price}
                </span>
              </div>

              {/* Desc */}
              <p className={`text-xs leading-relaxed mb-6 font-medium ${tier.primary ? 'text-zinc-300' : 'text-zinc-500'}`}>
                {tier.desc}
              </p>

              {/* Features List */}
              <ul className="space-y-2.5 mb-8 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs font-semibold">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.primary ? "text-blue-400" : "text-emerald-500"}`} />
                    <span className={tier.primary ? "text-zinc-200" : "text-zinc-600"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Option */}
            <button
              id={`btn_pricing_cta_${tier.id}`}
              onClick={() => onSelectTier(tier.id)}
              className={`w-full py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tier.primary
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 active:scale-95 border border-zinc-200"
              }`}
            >
              {tier.ctaText} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
