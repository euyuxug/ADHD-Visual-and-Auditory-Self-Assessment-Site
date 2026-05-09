/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple beep sounds as placeholders for "1" and "2"
// In a real app, these would be high-quality voice recordings.
export const TEST_CONFIG = {
  STIMULUS_DURATION: 200, // ms
  MIN_ISI: 1000, // ms
  MAX_ISI: 2000, // ms
  PRACTICE_TRIALS: 10,
  TEST_TRIALS_PER_BLOCK: 50, // Standard IVA-CPT has a lot of trials
  BLOCKS: ['TARGET_DOMINANT', 'DISTRACTOR_DOMINANT'] as const,
};
