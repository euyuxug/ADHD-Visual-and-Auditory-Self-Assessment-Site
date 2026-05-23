import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, HelpCircle, ArrowRight, ShieldCheck, Heart, ArrowLeft, RefreshCcw } from 'lucide-react';

interface MiniScreeningProps {
  onBack: () => void;
  onStartFullAssessment: () => void;
}

const QUESTIONS = [
  { id: 1, text: "在日常工作、学习或活动中，我常常因为粗心犯错，很难长时间将精力集中在单一任务上。" },
  { id: 2, text: "当别人直接对我说话时，我经常显得心思飞散、没有在听，或者在做事时容易丢三落四、找不到日常用品。" },
  { id: 3, text: "我难以有条理地组织日常生活与复杂工作，经常严重 procrastinate (拖延) 或逃避需要高度脑力的项目。" },
  { id: 4, text: "在需要安静的场合下，我经常手脚不停、坐立不安，或是感觉身体里装了一个“不停运转的马达”。" },
  { id: 5, text: "我经常说话过多，在他人问题还没说完时便抢先作答，在日常排队或轮流等待时感到极其痛苦与不耐烦。" }
];

const OPTIONS = [
  { label: "从不或极少", score: 0, desc: "频率低于10%" },
  { label: "偶尔发生", score: 1, desc: "频率约10% - 30%" },
  { label: "经常发生", score: 2, desc: "频率约30% - 70%" },
  { label: "总是如此", score: 3, desc: "频率超过70%" }
];

export default function MiniScreening({ onBack, onStartFullAssessment }: MiniScreeningProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSelectOption = (score: number) => {
    const updatedAnswers = [...answers, score];
    setAnswers(updatedAnswers);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const maxScore = QUESTIONS.length * 3;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  let riskLevel = "低风险";
  let riskColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  let bgGradient = "from-emerald-500/10 to-teal-500/5";
  let summaryText = "您的日常表现较为稳定，注意力和自我冲动控制水平处在良好健康范围内。";

  if (totalScore >= 10) {
    riskLevel = "高风险";
    riskColor = "text-rose-600 bg-rose-50 border-rose-100";
    bgGradient = "from-rose-500/10 to-orange-500/0";
    summaryText = "您的自测答案显示在专注力和冲动控制上存在较为明显的困扰，达到了注意力缺损/多动的筛查提示水位。";
  } else if (totalScore >= 5) {
    riskLevel = "中度风险";
    riskColor = "text-amber-600 bg-amber-50 border-amber-100";
    bgGradient = "from-amber-500/10 to-orange-500/5";
    summaryText = "您在某些特定场景下存在注意力波动或轻微的冲动表现，可能受到近期压力、环境变化或睡眠不足的影响。";
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Back Header */}
      <button 
        onClick={onBack}
        id="btn_back_to_main"
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 text-sm font-medium mb-6 cursor-pointer bg-white/60 hover:bg-white border border-zinc-200/50 px-4 py-2 rounded-full transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> 返回主面板
      </button>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="question_card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-zinc-200 shadow-xl rounded-[2rem] p-8 md:p-10 relative overflow-hidden"
          >
            {/* Top Indicator */}
            <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  ADHD 5分钟日常轻筛
                </span>
              </div>
              <span className="text-zinc-600 font-bold font-mono text-sm bg-zinc-100 px-3 py-1 rounded-full">
                {currentIdx + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-150 rounded-full overflow-hidden mb-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="min-h-[100px] mb-8">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest inline-block mb-2">
                问题 {currentIdx + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 leading-normal tracking-tight">
                {QUESTIONS[currentIdx].text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  id={`btn_screening_opt_${i}`}
                  onClick={() => handleSelectOption(opt.score)}
                  className="w-full text-left bg-zinc-50 border border-zinc-200/80 hover:bg-indigo-50/50 hover:border-indigo-400 p-5 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-800 text-base md:text-lg group-hover:text-indigo-900">
                      {opt.label}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1">
                      {opt.desc}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-200 group-hover:border-indigo-500 group-hover:bg-indigo-100 flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 text-transparent group-hover:text-indigo-600 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center gap-3 text-zinc-400 text-xs font-medium justify-between">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> 本量表参考 ASRS v1.1 经典临床速筛问卷
              </span>
              <span className="text-zinc-300">匿名安全保障</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result_card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-zinc-200 shadow-xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
          >
            {/* Visual background blend */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${bgGradient} opacity-50 pointer-events-none`} />

            <div className="relative">
              {/* Indicator */}
              <div className="flex justify-center mb-6">
                <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border ${riskColor}`}>
                  {riskLevel} (日常自测)
                </span>
              </div>

              <h2 className="text-3xl font-black text-center text-zinc-900 tracking-tight mb-4">
                日常专注状态速筛结果
              </h2>
              <p className="text-center text-zinc-500 font-medium text-sm mb-8">
                本测依据日常行为问卷，总分为您在近期的量化得分：<span className="font-bold text-indigo-600">{totalScore}</span> / {maxScore} 分
              </p>

              {/* Progress visual */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40 rounded-full border-8 border-zinc-150 flex flex-col items-center justify-center bg-white shadow-md">
                  <span className="text-4xl font-extrabold text-zinc-800 tracking-tight">{scorePercent}%</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider mt-1">异常偏离度</span>
                </div>
              </div>

              {/* Summary Description Card */}
              <div className="bg-zinc-50/80 border border-zinc-200 rounded-2xl p-6 mb-8 text-center">
                <p className="text-zinc-700 leading-relaxed font-semibold text-lg">
                  {summaryText}
                </p>
                <div className="flex justify-center gap-4 mt-4 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 临床比对</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> 专注关怀</span>
                </div>
              </div>

              {/* Dynamic Warning Alert */}
              <div className="p-5 bg-blue-50/50 border border-blue-105 rounded-2xl flex gap-4 items-start mb-8 text-left">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">自评估科学建议</h4>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium mt-1">
                    自评问卷主要观测日常行为的主观投射，容易受到情绪、近两天工作强度以及环境变动的影响。
                    若要获得客观、无伪装的行为统计学报告（如反应速度、多任务抗干扰指数），强烈建议进行标准的 <strong>IVA-CPT 13分钟视听连续行为检测</strong>，首次完整评估免费！
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  id="btn_launch_full_evaluation"
                  onClick={onStartFullAssessment}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-5 rounded-[1.25rem] shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Brain className="w-5 h-5" /> 开启13分钟 IVA-CPT 完整评估 (首次免费)
                </button>
                <button
                  id="btn_retry_screening"
                  onClick={handleReset}
                  className="w-full bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100 text-zinc-700 font-bold py-4 rounded-[1.15rem] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4" /> 重新筛查
                </button>
              </div>

              <div className="mt-8 text-center text-[10px] text-zinc-400 leading-relaxed px-6">
                提示：本快速轻筛属于自评表范畴，不作为任何临床ADHD或精神医学诊断的必然结论。如遇到长期工作、社交或学业严重受损，请前往三甲医院精神科。
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
