"use client"

import React from 'react'

export default function ComparativoPage() {
  const hoje = new Intl.DateTimeFormat('pt-AO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Africa/Luanda',
  }).format(new Date())
  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 900, background: 'white', color: '#111', padding: 24, borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Comparativo: Compra Direta vs Parceria SaaS</h1>
          <button className="btn-base btn-primary" onClick={() => window.print()} style={{ padding: '8px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none' }}>
            Baixar PDF (Imprimir)
          </button>
        </header>

        <p style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>Documento gerado em {hoje}. Valores em KZ. Parâmetros de SaaS conforme discutido.</p>

        <section style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Resumo Executivo</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li>Compra Direta: propriedade total imediata, maior CAPEX (65M–70M KZ).</li>
            <li>Parceria SaaS: menor entrada (12M KZ) e 1,5M KZ/mês, com buyout opcional (55M KZ até 12 meses, abatendo 65% das mensalidades).</li>
            <li>Custos totais competitivos com buyout no mês 6–12, reduzindo risco no início.</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Compra Direta</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li>Preço de aquisição: 65M–70M KZ (propriedade intelectual 100%).</li>
            <li>Suporte/manutenção opcional: 1,2M–1,8M KZ/mês com SLA definido.</li>
            <li>CAPEX alto na entrada; controle total desde o dia 1.</li>
            <li>Time‑to‑value: imediato com onboarding em 30–60 dias.</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Parceria (SaaS + Opção de Compra)</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li>Setup: 12M KZ (deploy, customização, onboarding, QA).</li>
            <li>Mensalidade: 1,5M KZ/mês (32h/mês inclusas, SLAs).</li>
            <li>Buyout até 12 meses: 55M KZ − 65% das mensalidades já pagas.</li>
            <li>OPEX baixo no início; CAPEX somente se exercer compra.</li>
            <li>Risco reduzido: validação em produção antes da aquisição.</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Cenários Financeiros</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li>SaaS 12 meses sem compra: 12M + (12 × 1,5M) = <strong>30M KZ</strong>.</li>
            <li>SaaS 12 meses com buyout: 30M + [55M − (65% × 18M)] = <strong>73,3M KZ</strong>.</li>
            <li>SaaS buyout no mês 6: (12M + 9M) + [55M − (65% × 9M)] = <strong>70,15M KZ</strong>.</li>
            <li>SaaS buyout no mês 18: (12M + 27M) + [55M − (65% × 27M)] = <strong>76,45M KZ</strong>.</li>
            <li>Compra direta + manutenção 12 meses: 65M + (12 × 1,2M) = <strong>79,4M KZ</strong>.</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Comparativo Objetivo</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li>Entrada de caixa: Parceria exige menos (12M vs 65M–70M).</li>
            <li>Custo total: Parceria com buyout mês 6–12 fica competitivo com compra direta.</li>
            <li>Flexibilidade: Parceria permite decidir compra no melhor momento.</li>
            <li>Controle: Compra dá controle pleno imediato; Parceria, controle progressivo.</li>
            <li>Sustentabilidade: Parceria tem horas inclusas e SLAs; Compra requer equipe/contrato.</li>
          </ul>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Recomendação</h2>
          <p style={{ lineHeight: 1.7 }}>
            Avançar com Parceria SaaS (12M setup + 1,5M/mês) com checkpoint no mês 6: se KPIs e parcerias estiverem fortes, executar o buyout (≈ 70,15M KZ); se não, reavaliar no mês 12 (≈ 73,3M KZ).
            Se houver orçamento e necessidade de propriedade imediata, Compra Direta em 65M–70M KZ com 2–3 meses de suporte incluso.
          </p>
        </section>

        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Definições (Glossário)</h2>
          <ul style={{ marginLeft: 18, lineHeight: 1.6 }}>
            <li><strong>OPEX</strong>: despesas operacionais recorrentes (infra, manutenção, suporte, evoluções).</li>
            <li><strong>CAPEX</strong>: investimento de capital inicial em ativos/produtos (aquisição/licença).</li>
            <li><strong>KPIs</strong>: indicadores‑chave de performance que medem metas e resultados.</li>
            <li><strong>SLAs</strong>: acordos de nível de serviço (disponibilidade, tempos de resposta/solução).</li>
            <li><strong>SaaS</strong>: software como serviço, entregue via assinatura com hospedagem gerenciada.</li>
            <li><strong>Buyout</strong>: opção de compra da plataforma após período, com abatimento das mensalidades.</li>
          </ul>
        </section>

        <footer style={{ marginTop: 24, borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>REVISTA Digital — Proposta Comparativa · {hoje}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Contato: parceria@revista.digital</div>
        </footer>

        <style>{`
          @media print {
            button { display: none !important; }
            main { padding: 0 !important; }
            h1 { font-size: 22px !important; }
            h2 { font-size: 16px !important; }
            ul { margin-left: 16px; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>
      </div>
    </main>
  )
}