import { handleSecundRcnRequest } from '../pages/api/secund-rcn';
import { evaluateWithCrcl } from '../src/services/safetyService';

describe('SECUND-RCN prototype', () => {
  it('returns a UI frame without leaking debug fields', async () => {
    const res = await handleSecundRcnRequest({ query: { content: 'neutral text', phase: 'Perception' } });
    expect(res.status).toBe(200);
    const body = res.body as any;
    expect(body.metrics).toBeDefined();
    const html = JSON.stringify(body).toLowerCase();
    expect(html).not.toContain('similarity');
    expect(html).not.toContain('highflag');
    expect(html).not.toContain('moderateflag');
    expect(html).not.toContain('debug');
  });

  it('raises risk when entering Drift phase', async () => {
    const perception = await evaluateWithCrcl({ content: 'short text', phase: 'Perception' });
    const drift = await evaluateWithCrcl({ content: 'short text', phase: 'Drift' });
    expect(drift.metrics.burnoutRisk).toBeGreaterThanOrEqual(perception.metrics.burnoutRisk);
    expect(drift.thresholds.maxBurnoutRisk).toBeGreaterThanOrEqual(perception.thresholds.maxBurnoutRisk);
  });
});
