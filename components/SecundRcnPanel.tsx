import React, { useEffect, useState } from 'react';
import { handleSecundRcnRequest } from '../pages/api/secund-rcn';
import { RCNUiFrame, RCNPhase } from '../src/services/safetyService';

interface Props {
  content: string;
  phase?: RCNPhase;
}

export function SecundRcnPanel({ content, phase = 'Perception' }: Props) {
  const [frame, setFrame] = useState<RCNUiFrame | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    handleSecundRcnRequest({ query: { content, phase } }).then((res) => {
      if (!active) return;
      if (res.status === 200) {
        setFrame(res.body as RCNUiFrame);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [content, phase]);

  if (loading) {
    return <div data-testid="rcn-loading">Betöltés...</div>;
  }

  if (!frame) {
    return <div data-testid="rcn-empty">Nincs adat</div>;
  }

  const tone = toneFromAction(frame.action);

  return (
    <div data-testid="rcn-panel" className={`border p-4 rounded bg-${tone.bg} border-${tone.border}`}>
      <header className="flex justify-between items-center mb-2">
        <span className="font-semibold">RCN Fázis: {phase}</span>
        <span className="uppercase text-sm">{frame.action}</span>
      </header>
      <p data-testid="rcn-fyi" className="text-sm mb-2">{frame.fyi}</p>
      <ul data-testid="rcn-reasons" className="list-disc list-inside text-sm mb-3">
        {frame.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <dl data-testid="rcn-metrics" className="grid grid-cols-2 gap-2 text-sm">
        <Metric label="Dignity" value={frame.metrics.dignityRisk} threshold={frame.thresholds.maxDignityRisk} />
        <Metric label="Burnout" value={frame.metrics.burnoutRisk} threshold={frame.thresholds.maxBurnoutRisk} />
        <Metric label="Legal" value={frame.metrics.legalRisk} threshold={frame.thresholds.maxLegalRisk} />
        <Metric label="Ethics" value={frame.metrics.ethicsRisk} threshold={frame.thresholds.maxEthicsRisk} />
        <Metric label="RBB" value={frame.metrics.rbb} threshold={frame.thresholds.maxRbb} />
      </dl>
    </div>
  );
}

function Metric({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const color = value >= threshold ? 'text-red-600' : 'text-emerald-700';
  return (
    <div className="flex justify-between" data-testid={`metric-${label.toLowerCase()}`}>
      <span>{label}</span>
      <span className={`${color}`}>{value.toFixed(2)} / {threshold}</span>
    </div>
  );
}

function toneFromAction(action: RCNUiFrame['action']) {
  switch (action) {
    case 'allow':
      return { border: 'emerald-500', bg: 'emerald-50' };
    case 'warn':
      return { border: 'amber-500', bg: 'amber-50' };
    case 'escalate':
      return { border: 'orange-500', bg: 'orange-50' };
    case 'block':
    default:
      return { border: 'red-500', bg: 'red-50' };
  }
}

export default SecundRcnPanel;
