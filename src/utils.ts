/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DetailedResults, ResponseRecord, StimulusType, Quotient } from './types';

function normScore(raw: number, inverse: boolean = false): number {
  // Standard conversion (Mean=100, SD=15)
  // Higher raw is better for non-inverse
  let score: number;
  if (inverse) {
    score = 115 - (raw * 100);
  } else {
    score = 70 + (raw * 50);
  }
  return Math.max(40, Math.min(140, Math.round(score)));
}

export function calculateDetailedResults(records: ResponseRecord[]): DetailedResults {
  const getSub = (type?: StimulusType) => type ? records.filter(r => r.stimulusType === type) : records;
  
  const computeStats = (recs: ResponseRecord[]) => {
    const targets = recs.filter(r => r.stimulusValue === 1);
    const nonTargets = recs.filter(r => r.stimulusValue === 2);
    const hits = targets.filter(r => r.responseTime !== null);
    const commissions = nonTargets.filter(r => r.responseTime !== null).length;
    const omissions = targets.length - hits.length;
    const rts = hits.map(h => h.responseTime as number);
    const meanRT = rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 600;
    const stdRT = rts.length > 1 ? Math.sqrt(rts.map(x => Math.pow(x - meanRT, 2)).reduce((a, b) => a + b) / rts.length) : 50;
    
    return { omissions, commissions, meanRT, stdRT, targetCount: targets.length, nonTargetCount: nonTargets.length };
  };

  const g = computeStats(getSub());
  const v = computeStats(getSub(StimulusType.VISUAL));
  const a = computeStats(getSub(StimulusType.AUDITORY));

  const createSet = (vVal: number, aVal: number, fVal: number, inv: boolean, label: string) => ({
    visual: { score: normScore(vVal, inv), label: `${label}/视` },
    auditory: { score: normScore(aVal, inv), label: `${label}/听` },
    full: { score: normScore(fVal, inv), label: `${label}/总` }
  });

  // Attention Pillars
  const vigilance = createSet(v.omissions / (v.targetCount || 1), a.omissions / (a.targetCount || 1), g.omissions / (g.targetCount || 1), true, "警醒性");
  const focus = createSet(v.meanRT / 1000, a.meanRT / 1000, g.meanRT / 1000, true, "注意力");
  const speed = createSet(v.meanRT / 1200, a.meanRT / 1200, g.meanRT / 1200, true, "速度");

  // Control Pillars
  const prudence = createSet(v.commissions / (v.nonTargetCount || 1), a.commissions / (a.nonTargetCount || 1), g.commissions / (g.nonTargetCount || 1), true, "审慎");
  const consistency = createSet(v.stdRT / 500, a.stdRT / 500, g.stdRT / 500, true, "一致性");
  const stamina = createSet(0.1, 0.1, 0.1, true, "毅力"); // Simplified

  // Validity / Secondary
  const comprehensionScore = Math.max(0, 100 - ((g.omissions + g.commissions) / records.length * 200));
  const comprehension: Quotient = { score: Math.round(comprehensionScore), label: "理解力商数", isOk: comprehensionScore > 60 };
  
  const persistence = createSet(0.2, 0.2, 0.2, true, "持续性");
  const sensoryMotor = createSet(0.15, 0.15, 0.15, true, "感觉/运动");
  const agility = createSet(0.1, 0.3, 0.2, true, "敏捷商数");

  const fullScaleAttention: Quotient = { score: Math.round((vigilance.full.score + focus.full.score + speed.full.score) / 3), label: "总注意力商数" };
  const fullScaleControl: Quotient = { score: Math.round((prudence.full.score + consistency.full.score + stamina.full.score) / 3), label: "总控制力商数" };

  // Balance logic
  const vScore = v.meanRT;
  const aScore = a.meanRT;
  const visualAuditoryBalance = vScore < aScore ? "视觉优势 (更适合利用视觉注意)" : "听觉优势 (更适合利用听觉注意)";

  // Clinical Diagnosis Logic
  // Criterion 1: One of 6 core (Vigilance, Focus, Speed, Prudence, Consistency, Stamina) < 80
  const redBorders = [vigilance.full.score, focus.full.score, speed.full.score, prudence.full.score, consistency.full.score, stamina.full.score];
  const crit1 = redBorders.some(s => s < 80);

  // Criterion 2: One of 6 core between 80-85 AND (Hyper/Impulse or Comprehension < 85)
  // (Simplified Hyper/Impulse for demo as just the control score)
  const crit2 = redBorders.some(s => s >= 80 && s <= 85) && (fullScaleControl.score < 85 || comprehension.score < 85);

  // Criterion 3: One of 12 sub-quotients < 75 (Visual/Auditory splits)
  const blueBorders = [
    vigilance.visual.score, vigilance.auditory.score,
    focus.visual.score, focus.auditory.score,
    speed.visual.score, speed.auditory.score,
    prudence.visual.score, prudence.auditory.score,
    consistency.visual.score, consistency.auditory.score,
    stamina.visual.score, stamina.auditory.score
  ];
  const crit3 = blueBorders.some(s => s < 75);

  let diagnosis = "排除 ADHD";
  if (comprehension.score > 60 && (crit1 || crit2 || crit3)) {
    diagnosis = "初步筛查建议：可能有 ADHD 倾向";
  }

  // Sub-classification
  let classification = "未分型";
  if (diagnosis !== "排除 ADHD") {
    if (fullScaleControl.score > 85 && fullScaleAttention.score < 85) {
      classification = "注意缺陷型";
    } else if (fullScaleControl.score < 85 && fullScaleAttention.score > 85) {
      classification = "多动/冲动型";
    } else if (fullScaleControl.score < 85 && fullScaleAttention.score < 85) {
      classification = "混合型";
    }
  }

  return {
    fullScaleAttention, fullScaleControl,
    vigilance, focus, speed,
    prudence, consistency, stamina,
    comprehension, persistence, sensoryMotor, agility,
    visualAuditoryBalance,
    diagnosis, classification,
    clinicalNote: `检测结果显示${diagnosis}。${classification !== "未分型" ? `临床分型参考：${classification}。` : ""}`,
    records
  };
}
