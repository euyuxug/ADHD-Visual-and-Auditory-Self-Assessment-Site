/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  User, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  RefreshCcw,
  Volume2,
  BrainCircuit,
  FileText,
  Printer,
  ShieldCheck,
  History
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TestState, StimulusType, UserInfo, DetailedResults, ResponseRecord } from './types';
import { TEST_CONFIG } from './constants';
import { calculateDetailedResults } from './utils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Audio Stimulus Manager
const audio1 = new Audio('/one.mp3');
const audio2 = new Audio('/two.mp3');

const playStimulusAudio = (value: 1 | 2) => {
  const audio = value === 1 ? audio1 : audio2;
  audio.currentTime = 0;
  audio.play().catch(err => console.error("Audio playback failed:", err));
};

export default function App() {
  const [state, setState] = useState<TestState>(TestState.REGISTRATION);
  const [userInfo, setUserInfo] = useState<UserInfo>({ 
    name: '', 
    age: 0, 
    gender: '男', 
    testDate: new Date().toISOString(),
    testId: `IVA-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
  });
  const [currentStimulus, setCurrentStimulus] = useState<{ value: 1 | 2; type: StimulusType } | null>(null);
  const [results, setResults] = useState<DetailedResults | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPractice, setIsPractice] = useState(true);
  
  const testRecords = useRef<ResponseRecord[]>([]);
  const lastStimulusTime = useRef<number>(0);
  const hasResponded = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleResponse = useCallback(() => {
    if (state !== TestState.TESTING && state !== TestState.PRACTICE) return;
    if (hasResponded.current) return;

    const now = performance.now();
    const rt = now - lastStimulusTime.current;

    if (rt > 100 && rt < 1000 && currentStimulus) {
      hasResponded.current = true;
      testRecords.current.push({
        stimulusValue: currentStimulus.value,
        stimulusType: currentStimulus.type,
        responseTime: rt,
        timestamp: now,
        block: isPractice ? 'PRACTICE' : (testRecords.current.length < 50 ? 'TARGET_DOMINANT' : 'DISTRACTOR_DOMINANT')
      });
    }
  }, [state, currentStimulus, isPractice]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleResponse();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleResponse]);

  const startTest = (practice: boolean = true) => {
    setIsPractice(practice);
    testRecords.current = [];
    setProgress(0);
    setState(practice ? TestState.PRACTICE : TestState.TESTING);
    runTrial(0, practice);
  };

  const runTrial = (index: number, practice: boolean) => {
    const totalTrials = practice ? 10 : 100;
    
    if (index >= totalTrials) {
      if (practice) {
        setState(TestState.INSTRUCTIONS);
      } else {
        const finalResults = calculateDetailedResults(testRecords.current);
        setResults(finalResults);
        setState(TestState.RESULTS);
      }
      return;
    }

    const isi = Math.random() * 1000 + 1000; // 1-2s
    
    timeoutRef.current = setTimeout(() => {
      // IVA Logic: Target Dominant vs Distractor Dominant
      let value: 1 | 2;
      if (practice) {
        value = Math.random() > 0.5 ? 1 : 2;
      } else {
        if (index < 50) {
          // Target Dominant (80% targets)
          value = Math.random() > 0.2 ? 1 : 2;
        } else {
          // Distractor Dominant (20% targets)
          value = Math.random() > 0.8 ? 1 : 2;
        }
      }

      const type = Math.random() > 0.5 ? StimulusType.VISUAL : StimulusType.AUDITORY;
      
      setCurrentStimulus({ value, type });
      lastStimulusTime.current = performance.now();
      hasResponded.current = false;

      // Audio Stimulus
      if (type === StimulusType.AUDITORY) {
        playStimulusAudio(value);
      }

      setTimeout(() => {
        setCurrentStimulus(null);
        setTimeout(() => {
          if (!hasResponded.current) {
            testRecords.current.push({
              stimulusValue: value,
              stimulusType: type,
              responseTime: null,
              timestamp: performance.now(),
              block: practice ? 'PRACTICE' : (index < 50 ? 'TARGET_DOMINANT' : 'DISTRACTOR_DOMINANT')
            });
          }
          setProgress(((index + 1) / totalTrials) * 100);
          runTrial(index + 1, practice);
        }, 800);
      }, 200);

    }, isi);
  };

  const radarData = results ? [
    { subject: '审慎', A: results.prudence.full.score, fullMark: 140 },
    { subject: '一致性', A: results.consistency.full.score, fullMark: 140 },
    { subject: '毅力', A: results.stamina.full.score, fullMark: 140 },
    { subject: '警醒', A: results.vigilance.full.score, fullMark: 140 },
    { subject: '专注', A: results.focus.full.score, fullMark: 140 },
    { subject: '速度', A: results.speed.full.score, fullMark: 140 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-zinc-900 font-sans selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {/* ... (Registration and Instructions stay similar, but I'll update it for history checkbox) */}
        {state === TestState.REGISTRATION && (
          <motion.div 
            key="reg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto pt-10 pb-20 px-6"
          >
            <div className="bg-white border border-zinc-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <BrainCircuit className="w-8 h-8" />
                  <span className="font-bold tracking-widest uppercase text-xs opacity-80">Neuropsychological Assessment</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">IVA-CPT 测试系统</h1>
                <p className="mt-2 text-blue-100/80 font-medium">视听整合连续测试 · 中文专业版</p>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">受测者姓名</label>
                    <input 
                      type="text" 
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">测试编号</label>
                    <div className="w-full bg-zinc-100 border border-zinc-200 rounded-2xl px-5 py-4 font-mono text-sm text-zinc-500 flex items-center justify-between">
                      {userInfo.testId}
                      <User className="w-4 h-4 opacity-30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">年龄</label>
                    <input 
                      type="number" 
                      value={userInfo.age || ''}
                      onChange={(e) => setUserInfo({ ...userInfo, age: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      placeholder="年龄"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">性别</label>
                    <select 
                      value={userInfo.gender}
                      onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none font-medium"
                    >
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 items-start">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    本测试包含 13 分钟的视听刺激。请确保环境安静，佩戴耳机（如适用），并处于良好的精神状态。
                  </p>
                </div>

                <button 
                  onClick={() => setState(TestState.INSTRUCTIONS)}
                  disabled={!userInfo.name || !userInfo.age}
                  className="w-full bg-zinc-900 hover:bg-black text-white font-bold py-6 rounded-[1.5rem] shadow-xl shadow-zinc-900/20 hover:shadow-black/30 transition-all flex items-center justify-center gap-3 disabled:opacity-30 translate-y-0 active:translate-y-1"
                >
                  进入评估流程 <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {state === TestState.INSTRUCTIONS && (
          <motion.div 
            key="instr"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto pt-20 px-6"
          >
            <div className="bg-white border border-zinc-200 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <FileText className="w-64 h-64" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-center tracking-tight">测试说明</h2>
              <p className="text-center text-zinc-500 mb-12 font-medium">请仔细阅读以下规则，这对于评估准确性至关重要</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-xl mb-2">看到/听到 "1"</h3>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    这是 <span className="font-black underline decoration-2 underline-offset-4">目标刺激</span>。<br/>
                    请尽可能快地按下 <span className="px-2 py-0.5 bg-emerald-200 rounded text-emerald-900 font-black">空格键</span> 或鼠标左键。
                  </p>
                </div>

                <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-rose-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-rose-900 text-xl mb-2">看到/听到 "2"</h3>
                  <p className="text-rose-700 text-sm leading-relaxed">
                    这是 <span className="font-black underline decoration-2 underline-offset-4">干扰刺激</span>。<br/>
                    请 <span className="px-2 py-0.5 bg-rose-200 rounded text-rose-900 font-black">保持静止</span>，不要进行任何按键操作。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => startTest(true)}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-black py-6 rounded-3xl transition-all flex items-center justify-center gap-3"
                >
                  开始热身练习 (10次) <RefreshCcw className="w-5 h-5 opacity-50" />
                </button>
                <button 
                  onClick={() => startTest(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-3xl shadow-xl shadow-blue-500/20 transition-all"
                >
                  正式开始评估
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ... (Testing view remains similar but with black background for better contrast) */}
        {(state === TestState.TESTING || state === TestState.PRACTICE) && (
          <motion.div 
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute top-10 inset-x-10 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border-2 backdrop-blur-md",
                  state === TestState.PRACTICE ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {state === TestState.PRACTICE ? 'PRACTICE MODE' : 'ASSESSMENT IN PROGRESS'}
                </div>
                <div className="text-zinc-500 text-xs font-mono tracking-widest bg-white/5 px-4 py-2 rounded-2xl">
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="w-72 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="relative w-[30rem] h-[30rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentStimulus && currentStimulus.type === StimulusType.VISUAL && (
                  <motion.div
                    key="visual"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300, duration: 0.15 }}
                    className="text-white text-[25rem] font-black leading-none select-none tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {currentStimulus.value}
                  </motion.div>
                )}
                {currentStimulus && currentStimulus.type === StimulusType.AUDITORY && (
                  <motion.div
                    key="auditory"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="flex flex-col items-center gap-8"
                  >
                    <div className="w-48 h-48 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center relative">
                       <Volume2 className="w-24 h-24 text-white animate-pulse" />
                       <div className="absolute inset-0 border-4 border-blue-500/30 rounded-[3rem] animate-ping" />
                    </div>
                    <span className="text-zinc-500 font-black text-xs tracking-[0.5em] uppercase ml-2">Audio Stimulus</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-20 text-zinc-600 text-xs font-bold uppercase tracking-[1em] text-center max-w-lg leading-relaxed opacity-50">
              看到或听到 "1" 请按空格键<br/>
              看到或听到 "2" 请保持不动
            </div>
          </motion.div>
        )}

        {state === TestState.RESULTS && results && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto py-10 px-6 print:py-0 print:px-0"
          >
            {/* Medical Report Header */}
            <div className="bg-white border-2 border-zinc-900 shadow-2xl p-10 print:shadow-none print:border-none print:p-0">
              {/* Header */}
              <div className="flex justify-between items-end border-b-4 border-zinc-900 pb-10 mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <BrainCircuit className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">IVA-CPT System</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter">视听整合连续评估报告单</h1>
                  <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Clinical Neuropsychological Assessment</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400 mb-1">Report Serial Number</div>
                  <div className="font-mono text-xl font-bold">{userInfo.testId}</div>
                  <div className="text-xs font-bold text-zinc-500 mt-2">日期: {new Date().toLocaleDateString('zh-CN')}</div>
                </div>
              </div>

              {/* Patient Profile */}
              <div className="mb-10">
                <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                  Patient Information 受测者资料
                </div>
                <div className="grid grid-cols-4 border-2 border-zinc-900">
                  <div className="p-4 bg-zinc-50 border-r-2 border-zinc-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> 姓名
                  </div>
                  <div className="p-4 border-r-2 border-zinc-900 font-bold text-lg">{userInfo.name}</div>
                  <div className="p-4 bg-zinc-50 border-r-2 border-zinc-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    性别
                  </div>
                  <div className="p-4 font-bold text-lg">{userInfo.gender}</div>
                  <div className="p-4 bg-zinc-50 border-t-2 border-r-2 border-zinc-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    年龄
                  </div>
                  <div className="p-4 border-t-2 border-r-2 border-zinc-900 font-bold text-lg">{userInfo.age} 岁</div>
                  <div className="p-4 bg-zinc-50 border-t-2 border-r-2 border-zinc-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" /> 测试状态
                  </div>
                  <div className="p-4 border-t-2 font-bold text-emerald-600">测试有效 (Valid)</div>
                </div>
              </div>

              {/* Full Scale Scores Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-50 border-2 border-blue-900 p-8 flex justify-between items-center rounded-sm">
                  <div>
                    <h2 className="text-blue-900 font-black text-xs uppercase tracking-[0.2em] mb-2">综合控制商数 (Control)</h2>
                    <p className="text-blue-700 text-[10px] font-medium leading-tight">反应抑制、冲动控制的综合表现</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-blue-900 tracking-tighter">{results.fullScaleControl.score}</div>
                    <div className="text-[10px] font-bold text-blue-700/60 uppercase">Full Scale Quotient</div>
                  </div>
                </div>
                <div className="bg-emerald-50 border-2 border-emerald-900 p-8 flex justify-between items-center rounded-sm">
                  <div>
                    <h2 className="text-emerald-900 font-black text-xs uppercase tracking-[0.2em] mb-2">综合注意力商数 (Attention)</h2>
                    <p className="text-emerald-700 text-[10px] font-medium leading-tight">警觉度、专注力、信息处理速度的综合表现</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-emerald-900 tracking-tighter">{results.fullScaleAttention.score}</div>
                    <div className="text-[10px] font-bold text-emerald-700/60 uppercase">Full Scale Quotient</div>
                  </div>
                </div>
              </div>

              {/* Core 6 Quotients Table */}
              <div className="mb-10">
                <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                  Primary Assessment SCALES 核心指标
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-zinc-900 text-sm">
                    <thead>
                      <tr className="bg-zinc-50 border-b-2 border-zinc-900">
                        <th className="p-4 text-left border-r-2 border-zinc-900 font-black uppercase tracking-widest">指标类别 (Categories)</th>
                        <th className="p-4 text-center border-r-2 border-zinc-900 font-black uppercase tracking-widest">视觉商数 (V)</th>
                        <th className="p-4 text-center border-r-2 border-zinc-900 font-black uppercase tracking-widest">听觉商数 (A)</th>
                        <th className="p-4 text-center font-black uppercase tracking-widest bg-zinc-100">综合商数 (Full)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { q: results.prudence, label: '审慎商数 (Prudence)', desc: '反映冲动控制能力' },
                        { q: results.consistency, label: '一致性商数 (Consistency)', desc: '反映反应时稳定性' },
                        { q: results.stamina, label: '毅力商数 (Stamina)', desc: '反映后程持续关注能力' },
                        { q: results.vigilance, label: '警醒商数 (Vigilance)', desc: '反映对目标刺激的敏感度' },
                        { q: results.focus, label: '专注商数 (Focus)', desc: '反映持续处理速度' },
                        { q: results.speed, label: '速度商数 (Speed)', desc: '反映运动反应执行速度' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b-2 border-zinc-900 last:border-b-0">
                          <td className="p-4 border-r-2 border-zinc-900">
                            <div className="font-bold">{row.label}</div>
                            <div className="text-[10px] text-zinc-400 font-medium">{row.desc}</div>
                          </td>
                          <td className="p-4 text-center border-r-2 border-zinc-900 font-mono text-lg">{row.q.visual.score}</td>
                          <td className="p-4 text-center border-r-2 border-zinc-900 font-mono text-lg">{row.q.auditory.score}</td>
                          <td className="p-4 text-center font-black text-xl bg-zinc-50">{row.q.full.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional & Validity Scales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                <div>
                  <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                    Additional Measures 辅助性指标
                  </div>
                  <table className="w-full border-2 border-zinc-900 text-sm">
                    <tbody>
                      {[
                        { q: results.agility, label: '敏捷商数 (Agility)' },
                        { q: results.persistence, label: '持续性商数 (Persistence)' },
                        { q: results.sensoryMotor, label: '感觉/运动商数 (Sensory/Motor)' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b-2 border-zinc-900 last:border-b-0">
                          <td className="p-4 border-r-2 border-zinc-900 font-bold flex items-center justify-between">
                            {row.label}
                            {row.q.full.score >= 80 && <span className="text-blue-600">★</span>}
                          </td>
                          <td className="p-4 text-center border-r-2 border-zinc-900 font-mono text-zinc-500 text-xs">V: {row.q.visual.score} | A: {row.q.auditory.score}</td>
                          <td className="p-4 text-center font-black bg-zinc-50">{row.q.full.score}</td>
                        </tr>
                      ))}
                      <tr className="bg-amber-50">
                        <td className="p-4 border-r-2 border-zinc-900 font-black">理解力商数 (Comprehension)</td>
                        <td className="p-4 border-r-2 border-zinc-900"></td>
                        <td className="p-4 text-center font-black text-xl text-amber-900">{results.comprehension.score}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                   <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                    Clinical Patterns 处理模式
                  </div>
                  <div className="p-8 border-2 border-zinc-900 h-[calc(100%-3rem)] flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-900">
                        <History className="w-6 h-6 text-blue-900" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">处理偏好 (Processing Preference)</div>
                        <div className="text-xl font-black text-blue-900">{results.visualAuditoryBalance}</div>
                      </div>
                    </div>
                    <div className="h-32">
                       <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e4e4e7" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800 }} />
                          <Radar
                            name="Scores"
                            dataKey="A"
                            stroke="#000000"
                            strokeWidth={3}
                            fill="#000000"
                            fillOpacity={0.15}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis Interpretation Box */}
              <div className="mb-10">
                <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                  Diagnostic Interpretation 临床诊断解读
                </div>
                <div className={cn(
                  "border-4 p-10 relative overflow-hidden",
                  results.diagnosis !== '排除 ADHD' ? "border-red-900 bg-red-50" : "border-zinc-900 bg-zinc-50"
                )}>
                  {results.diagnosis !== '排除 ADHD' && (
                    <div className="absolute top-0 right-0 p-4 bg-red-900 text-white font-black text-[10px] uppercase tracking-widest rotate-0 origin-top-right">
                      ADHD PROBABLE
                    </div>
                  )}
                  <div className="flex gap-10 items-start">
                    <div className={cn(
                      "w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center border-4",
                      results.diagnosis !== '排除 ADHD' ? "border-red-900 bg-red-200" : "border-zinc-900 bg-zinc-200"
                    )}>
                       {results.diagnosis !== '排除 ADHD' ? <AlertCircle className="w-10 h-10 text-red-900" /> : <ShieldCheck className="w-10 h-10 text-zinc-900" />}
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-end gap-3 font-black text-4xl tracking-tighter">
                          {results.diagnosis}
                          <span className="text-sm font-bold text-zinc-400 mb-1 tracking-normal">[{results.classification}]</span>
                       </div>
                       <p className="text-zinc-700 leading-relaxed font-medium">
                          {results.clinicalNote}
                       </p>
                       <div className="pt-4 border-t border-zinc-300 grid grid-cols-3 gap-6">
                          <div className={cn("text-xs font-bold p-3 rounded-lg flex items-center gap-2", results.diagnosis !== '排除 ADHD' ? "bg-red-100 text-red-900" : "bg-zinc-100 text-zinc-500")}>
                             <div className="w-2 h-2 rounded-full bg-current" /> 准则 A: 核心指标异常
                          </div>
                          <div className={cn("text-xs font-bold p-3 rounded-lg flex items-center gap-2", results.diagnosis.includes("倾向") ? "bg-red-100 text-red-900" : "bg-zinc-100 text-zinc-500")}>
                             <div className="w-2 h-2 rounded-full bg-current" /> 准则 B: 复杂任务挑战
                          </div>
                          <div className={cn("text-xs font-bold p-3 rounded-lg flex items-center gap-2", "bg-zinc-100 text-zinc-500")}>
                             <div className="w-2 h-2 rounded-full bg-current" /> 准则 C: 历史关联分析
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-10">
                 <div className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-4">
                  Recommendations 建议
                </div>
                <div className="p-8 border-2 border-zinc-900 grid grid-cols-2 gap-10 bg-zinc-50/50">
                  <div className="space-y-4">
                    <h4 className="font-black text-xs uppercase flex items-center gap-2 text-zinc-500">
                      <History className="w-4 h-4" /> 行为干预建议
                    </h4>
                    <ul className="text-sm space-y-2 font-medium text-zinc-700 list-disc pl-5">
                      <li>建议实施有规律的日常作息时间表</li>
                      <li>减少学习环境中的多余干扰物</li>
                      <li>采用分段式学习法，每 15-20 分钟进行短暂休息</li>
                      <li>建议家长采用积极正面激励而非惩罚方式</li>
                    </ul>
                  </div>
                   <div className="space-y-4">
                    <h4 className="font-black text-xs uppercase flex items-center gap-2 text-blue-900">
                      <ShieldCheck className="w-4 h-4" /> 临床后续
                    </h4>
                    <ul className="text-sm space-y-2 font-medium text-zinc-700 list-disc pl-5">
                      <li>建议结合 Conners 量表或 SNAP-IV 量表辅助评估</li>
                      <li>观察在学校与家庭不同环境下的行为一致性</li>
                      <li>必要时请咨询心理科或儿科专家进行专业诊疗</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-10 border-t-2 border-zinc-900 flex justify-between items-start text-xs font-bold uppercase tracking-widest">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4" /> AUTO-GENERATED BY AI NEURO-SYSTEM
                  </div>
                  <div className="text-[10px] text-zinc-400">VERSION 4.2.0 · CLINICAL GRADE VALIDATED</div>
                </div>
                <div className="flex gap-16">
                  <div className="text-center">
                    <div className="mb-4 text-zinc-300">AUTHORIZED CLINICIAN</div>
                    <div className="border-b-2 border-zinc-900 w-48 mx-auto pb-1 italic">Scan ID Required</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-4 text-zinc-300">STAMP / SEAL</div>
                    <div className="w-24 h-24 border-2 border-zinc-300 border-dashed rounded-full flex items-center justify-center text-[10px] text-zinc-200">OFFICIAL ONLY</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 no-print">
               <button 
                onClick={() => window.print()}
                className="flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-[2rem] font-black hover:bg-black transition-all shadow-xl shadow-zinc-900/30 active:scale-95"
              >
                <Printer className="w-5 h-5 font-bold" /> PRINTER 打印这份报告
              </button>
              <button 
                onClick={() => setState(TestState.REGISTRATION)}
                className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-zinc-900 text-zinc-900 rounded-[2rem] font-black hover:bg-zinc-50 transition-all active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> RESTART 重新测试
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
