import { buildRcnFrameFromDecision, evaluateWithCrcl, RCNPhase } from '../../src/services/safetyService';

export interface MockRequest {
  query: {
    content?: string;
    phase?: RCNPhase;
  };
}

export interface MockResponse {
  status: number;
  body: unknown;
}

export async function handleSecundRcnRequest(req: MockRequest): Promise<MockResponse> {
  const content = req.query.content ?? '';
  const phase: RCNPhase = req.query.phase ?? 'Perception';

  const decision = await evaluateWithCrcl({ content, phase });
  const frame = buildRcnFrameFromDecision(decision);

  const enrichedFrame = {
    ...frame,
    phase,
    thresholds: decision.thresholds,
  };

  return {
    status: 200,
    body: enrichedFrame,
  };
}
