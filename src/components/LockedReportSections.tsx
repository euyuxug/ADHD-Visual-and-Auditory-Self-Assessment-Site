import React from 'react';
import { Lock, History, Sparkles, TrendingUp, UserCheck, PhoneCall, Calendar, Video, FileBarChart, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LockedReportSectionsProps {
  onUnlockClick: () => void;
}

export default function LockedReportSections({ onUnlockClick }: LockedReportSectionsProps) {
  // Mock trend data for blurred chart visualization
  const trendData = [
    { date: '第一阶段 (服药前/高压期)', attention: 62, control: 58 },
    { date: '第二阶段 (正常作息/轻负荷)', attention: 95, control: 88 },
    { date: '第三阶段 (服用神经干预后)', attention: 112, control: 104 },
    { date: '本期评估 (当下测评值)', attention: 82, control: 78 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:hidden">
      
      {/* 3. 长期复测包 锁定卡片 */}
      <div className="border-2 border-zinc-900 rounded-[2.5rem] bg-white relative overflow-hidden flex flex-col justify-between group">
        
        {/* Absolute header indicator overlay */}
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">
            <Lock className="w-3 h-3" /> PREMIUM
          </span>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-3">
            <History className="text-purple-650 w-5 h-5 shrink-0" />
            <span className="font-extrabold uppercase text-[10px] text-purple-600 tracking-widest">
              Long-term Tracking 包
            </span>
          </div>

          <h3 className="text-2xl font-black text-zinc-940 tracking-tight leading-tight mb-2">
            想知道这是不是一次性波动？
          </h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
            单次测评只能看到当前状态，长期复测可以观察注意力是否随睡眠、压力、服药、学习任务发生变化。
          </p>

          {/* Locked / Blurred chronological trend mockup visual */}
          <div className="border border-zinc-200.50 rounded-2xl p-5 mb-6 relative bg-zinc-50/50">
            {/* Absolute blur barrier over chart */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-2xl z-20 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-500 mb-2 shadow-md shadow-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-700 animate-bounce" />
              </div>
              <p className="font-extrabold text-sm text-purple-900 tracking-tight">季度波动趋势谱图</p>
              <p className="text-[10px] text-purple-600/75 mt-0.5 font-bold">¥39 解锁后，将开始记录 3 次复测波形</p>
            </div>

            {/* Simulated Chart Container */}
            <div className="h-32 opacity-25">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="attention" stroke="#7c3aed" strokeWidth={3} dot />
                  <Line type="monotone" dataKey="control" stroke="#3b82f6" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Highlight benefit stats */}
          <div className="space-y-3 mb-8">
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>本季度可额外执行 3 次 IVA-CPT 独立量化测试</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>波谷提醒与服药对照曲线差异可视化分析</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>季末自动整合生成阶段状态自我提升与复盘小结</span>
            </div>
          </div>
        </div>

        {/* Pricing tag footer row */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-black text-purple-700 tracking-tighter">¥39</span>
            <span className="text-[10px] text-zinc-400 font-bold ml-1">/ 季度（含3次完整复测）</span>
          </div>
          <button
            id="btn_unlock_retest_pack"
            onClick={onUnlockClick}
            className="px-6 py-3.5 bg-purple-605 bg-zinc-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" /> 解锁长期复测包
          </button>
        </div>

      </div>

      {/* 4. 专家解读 锁定卡片 */}
      <div className="border-2 border-zinc-900 rounded-[2.5rem] bg-white relative overflow-hidden flex flex-col justify-between group">
        
        {/* Absolute header indicator overlay */}
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-lg">
            <Lock className="w-3 h-3" /> CLINICIAN
          </span>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="text-amber-600 w-5 h-5 shrink-0" />
            <span className="font-extrabold uppercase text-[10px] text-amber-600 tracking-widest">
              Professional Interview
            </span>
          </div>

          <h3 className="text-2xl font-black text-zinc-940 tracking-tight leading-tight mb-2">
            看不懂结果？可以让专业人士帮你解读
          </h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
            如果你正准备就医，或想判断孩子/自己的情况是否需要进一步评估，可以预约 15 分钟报告解读咨询。
          </p>

          {/* Locked / Blurred consultant guide card */}
          <div className="border border-zinc-200 rounded-2xl p-5 mb-6 relative bg-zinc-105 bg-white shadow-inner">
            {/* Absolute blur barrier over clinicians card */}
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-2xl z-20 p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-500 mb-2 shadow-md shadow-amber-500/10">
                <Video className="w-6 h-6 text-amber-750 text-amber-700 animate-pulse" />
              </div>
              <p className="font-extrabold text-sm text-amber-900 tracking-tight">1v1 专业解读咨询服务</p>
              <p className="text-[10px] text-amber-600/75 mt-0.5 font-bold">¥199 / 期，包含国家级心理专家远程答疑</p>
            </div>

            {/* Simulated interview block */}
            <div className="flex items-center gap-3 opacity-25">
              <div className="w-12 h-12 bg-zinc-200 rounded-full shrink-0" />
              <div>
                <div className="h-4 bg-zinc-300 w-24 rounded-full mb-1.5" />
                <div className="h-3 bg-zinc-200 w-44 rounded-full" />
              </div>
            </div>
          </div>

          {/* Highlight benefit stats */}
          <div className="space-y-3 mb-8">
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>持有执照的专业心理师/行为特训师 1v1 解说</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>解读听/视觉失衡原因、后程注意力下降的脑机能投射</span>
            </div>
            <div className="flex gap-2.5 items-start text-xs font-semibold text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>针对性的居家行为管理、番茄作息与就医前避坑清单</span>
            </div>
          </div>
        </div>

        {/* Pricing tag footer row */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-black text-amber-700 tracking-tighter">¥199</span>
            <span className="text-[10px] text-zinc-400 font-bold ml-1">/ 15分钟精讲诊视</span>
          </div>
          <button
            id="btn_unlock_expert_interpretation"
            onClick={onUnlockClick}
            className="px-6 py-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" /> 预约专家解答
          </button>
        </div>

      </div>

    </div>
  );
}
