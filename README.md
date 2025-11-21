# SECUND: Önjavuló AI Produktivitási Platform

[![Supabase](https://img.shields.io/badge/Supabase-Postgres-blue)](https://supabase.com) [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org) [![Gemini 2.5](https://img.shields.io/badge/Gemini-2.5-orange)](https://ai.google.dev) [![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**SECUND** egy önfejlesztő AI-vezérelt rendszer, amely ötvözi a Focus Timer-t (Pomodoro), Meeting Cost Calculator-t, AI Session Analysis-t (Gemini 2.5 Pro-val), Breakthrough Detection-t és Meta-Evolution Engine-t a folyamatos optimalizáláshoz. Cél: Segíteni a felhasználóknak maximalizálni a produktivitást adatvezérelt insights-szel, miközben a rendszer önállóan tanul és fejlődik.

## Funkciók
- **Focus Timer**: CRUD műveletek Pomodoro session-ökhöz, productivity rating-gel.
- **Meeting Cost Calculator**: Valós idejű költségszámítás résztvevők alapján, megosztható simlációkkal.
- **AI Insights**: Automatikus elemzés Lovable AI-n keresztül (Gemini 2.5), szokásajánlásokkal.
- **Meta-Evolution**: UCB-alapú prompt optimalizálás, RCN loop validációval (Perplexity integráció).
- **Deployment**: Canary rollout (5-100%), A/B testing, Supabase Edge Functions-szal.

**Jelenlegi Értékelés**: 87/100 – Működik: Auth, Sessions, AI Analysis; Részben: Emails, Meta-loop; Tervben: Redis Cache, ML Churn Prediction.

## Architektúra
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, TanStack Query (caching).
- **Backend**: Supabase Postgres (pgvector embeddings), 58 Edge Function (Deno TS), Lovable AI Gateway.
- **AI**: Gemini 2.5 Flash/Pro (Lovable), Perplexity Sonar Large (validáció), UCB score optimalizálás.
- **Deployment**: Vercel (preview branches), Supabase Branching 2.0, GitHub Actions CI/CD.
- **Monitoring**: PostHog (analytics), System Health Snapshots (error rate, latency).

További részletek: [Teljes Rendszer Dokumentáció](docs/COMPLETE_SYSTEM_ANALYSIS_FOR_AI.md) (schema, edge functions, security).

## Loop-alapú AI válaszformátum
Ha a modellnek mindig önellenőrző (RAW/REVIEW/FINAL) válaszokat kell adnia, másold a kész system promptokat a ChatGPT-hez és a Claude-hoz a [docs/LOOP_PROMPTS.md](docs/LOOP_PROMPTS.md) fájlból.

## Gyors Indítás
1. **Klónozás**:
