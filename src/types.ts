/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TestState {
  REGISTRATION = 'REGISTRATION',
  INSTRUCTIONS = 'INSTRUCTIONS',
  PRACTICE = 'PRACTICE',
  TESTING = 'TESTING',
  RESULTS = 'RESULTS',
}

export enum StimulusType {
  VISUAL = 'VISUAL',
  AUDITORY = 'AUDITORY',
}

export interface ResponseRecord {
  stimulusValue: 1 | 2;
  stimulusType: StimulusType;
  responseTime: number | null;
  timestamp: number;
  block: 'PRACTICE' | 'WARMUP' | 'TARGET_DOMINANT' | 'DISTRACTOR_DOMINANT' | 'COOL_DOWN';
}

export interface UserInfo {
  name: string;
  age: number;
  gender: string;
  testDate: string;
  testId: string;
}

export interface Quotient {
  score: number;
  label: string;
  isOk?: boolean; // For validity/OK ★ checks
}

export interface DetailedResults {
  // The 28 Quotients (Represented as logical groups)
  
  // Full Scales (2)
  fullScaleAttention: Quotient;
  fullScaleControl: Quotient;

  // Primary Scales (Auditory/Visual x 6 Pillars = 12)
  // Attention Pillars
  vigilance: { auditory: Quotient; visual: Quotient; full: Quotient }; // 警醒性 (3)
  focus: { auditory: Quotient; visual: Quotient; full: Quotient };     // 注意力 (3)
  speed: { auditory: Quotient; visual: Quotient; full: Quotient };     // 速度 (3)
  
  // Control Pillars
  prudence: { auditory: Quotient; visual: Quotient; full: Quotient };   // 审慎 (3)
  consistency: { auditory: Quotient; visual: Quotient; full: Quotient }; // 一致性 (3)
  stamina: { auditory: Quotient; visual: Quotient; full: Quotient };     // 毅力 (3)

  // Validation/Secondary Scales (8)
  comprehension: Quotient; // 理解力 (1)
  persistence: { auditory: Quotient; visual: Quotient; full: Quotient };   // 持续性 (3)
  sensoryMotor: { auditory: Quotient; visual: Quotient; full: Quotient };  // 感觉/运动 (3)
  agility: { auditory: Quotient; visual: Quotient; full: Quotient };      // 敏捷性 (3)
  
  // Balance
  visualAuditoryBalance: string;

  // Final Diagnosis
  diagnosis: string;
  classification: string;
  clinicalNote: string;
  records: ResponseRecord[];
}
