export type RCNPhase = 'Perception' | 'Drift' | 'Governor';

export interface CRCLInput {
  content: string;
  phase: RCNPhase;
}

export interface CRCLDecision {
  action: 'allow' | 'warn' | 'escalate' | 'block';
  reasons: string[];
  metrics: RCNMetricsSummary;
  thresholds: RCNThresholds;
  debug?: {
    similarityScore?: number;
    highFlag?: boolean;
    moderateFlag?: boolean;
    notes?: string;
  };
}

export interface RCNThresholds {
  maxDignityRisk: number;
  maxBurnoutRisk: number;
  maxLegalRisk: number;
  maxEthicsRisk: number;
  maxRbb: number;
}

export interface RCNMetricsSummary {
  dignityRisk: number;
  burnoutRisk: number;
  legalRisk: number;
  ethicsRisk: number;
  rbb: number;
}

export interface RCNUiFrame {
  phase: RCNPhase;
  action: CRCLDecision['action'];
  reasons: string[];
  metrics: RCNMetricsSummary;
  thresholds: RCNThresholds;
  fyi: string;
}

export async function evaluateWithCrcl(input: CRCLInput): Promise<CRCLDecision> {
  const baseRisk = Math.min(1, input.content.length / 500);
  const driftPenalty = input.phase === 'Drift' ? 0.1 : 0;
  const dignityRisk = clamp(baseRisk + driftPenalty, 0, 1);
  const burnoutRisk = clamp(baseRisk * 0.8 + driftPenalty, 0, 1);
  const legalRisk = clamp(baseRisk * 0.4, 0, 1);
  const ethicsRisk = clamp(baseRisk * 0.35 + (input.content.includes('harm') ? 0.25 : 0), 0, 1);
  const rbb = clamp((dignityRisk + burnoutRisk + legalRisk + ethicsRisk) / 4, 0, 1);

  const thresholds: RCNThresholds = {
    maxDignityRisk: 0.35,
    maxBurnoutRisk: input.phase === 'Drift' ? 0.4 : 0.3,
    maxLegalRisk: 0.4,
    maxEthicsRisk: 0.4,
    maxRbb: 0.5,
  };

  const metrics: RCNMetricsSummary = {
    dignityRisk,
    burnoutRisk,
    legalRisk,
    ethicsRisk,
    rbb,
  };

  const above = (value: number, limit: number, label: string) =>
    value >= limit ? `${label} (${value.toFixed(2)}) >= ${limit}` : undefined;

  const flags = [
    above(dignityRisk, thresholds.maxDignityRisk, 'Dignity'),
    above(burnoutRisk, thresholds.maxBurnoutRisk, 'Burnout'),
    above(legalRisk, thresholds.maxLegalRisk, 'Legal'),
    above(ethicsRisk, thresholds.maxEthicsRisk, 'Ethics'),
    above(rbb, thresholds.maxRbb, 'RBB'),
  ].filter(Boolean) as string[];

  const action: CRCLDecision['action'] =
    flags.length === 0 ? 'allow' : flags.length > 3 ? 'block' : input.phase === 'Perception' ? 'warn' : 'escalate';

  return {
    action,
    reasons: flags.length ? flags : ['Metrics within thresholds'],
    metrics,
    thresholds,
    debug: {
      similarityScore: Math.random(),
      highFlag: flags.length > 2,
      moderateFlag: flags.length === 1,
      notes: 'Demo decision path for SECUND-RCN',
    },
  };
}

export function buildRcnFrameFromDecision(decision: CRCLDecision): RCNUiFrame {
  const fyi = getFyi(decision.action);
  const frame: RCNUiFrame = {
    phase: 'Perception',
    action: decision.action,
    reasons: decision.reasons,
    metrics: decision.metrics,
    thresholds: decision.thresholds,
    fyi,
  };

  delete (frame as any).similarityScore;
  delete (frame as any).highFlag;
  delete (frame as any).moderateFlag;
  delete (frame as any).debug;

  return frame;
}

function getFyi(action: CRCLDecision['action']): string {
  switch (action) {
    case 'allow':
      return 'OK — proceed';
    case 'warn':
      return 'Caution — slow down and verify intent';
    case 'escalate':
      return 'Escalate — needs human review';
    case 'block':
    default:
      return 'Blocked — high risk detected';
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
