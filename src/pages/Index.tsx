import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Shield, Truck, Lock, Package, Syringe, ClipboardCheck, UserCheck } from "lucide-react";
import govLogo from "@/assets/gov-logo.png";
import drogasilLogo from "@/assets/drogasil-logo.png";
import mounjaroPens from "@/assets/PRINCIPAL.png";

// ── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [sec, setSec] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : initial)), 1000);
    return () => clearInterval(t);
  }, [initial]);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "O que é o Mounjaro (Tirzepatida)?",
    a: "O Mounjaro é um medicamento injetável aprovado pela ANVISA para tratamento de obesidade e controle metabólico. Ele atua nos receptores GIP e GLP-1, promovendo saciedade, redução de apetite e melhora nos marcadores metabólicos. É aplicado uma vez por semana com caneta auto-injetável.",
  },
  {
    q: "Quem pode participar do Programa de Acesso?",
    a: "Podem participar pacientes maiores de 18 anos, com CPF ativo e IMC acima de 27. O programa é voltado para pessoas que buscam controle de peso com acompanhamento clínico. A verificação de elegibilidade é feita no momento da inscrição.",
  },
  {
    q: "O subsídio é realmente do Governo Federal?",
    a: "Sim. O Programa de Acesso à Saúde Metabólica é uma iniciativa de parceria público-privada entre o Ministério da Saúde e redes farmacêuticas credenciadas, como a Drogasil. O subsídio é limitado por CPF e sujeito à disponibilidade de vagas na sua região.",
  },
  {
    q: "Como funciona a entrega do tratamento?",
    a: "Após a confirmação da sua inscrição e pagamento da taxa subsidiada, o kit de tratamento é enviado via Sedex com código de rastreamento para o endereço informado. O prazo médio de entrega é de 3 a 7 dias úteis, com cadeia fria garantida.",
  },
  {
    q: "Posso cancelar ou solicitar reembolso?",
    a: "Sim. O programa oferece garantia de satisfação de 30 dias. Caso não se adapte ao tratamento, entre em contato com a central de atendimento para solicitar o cancelamento e reembolso integral da taxa subsidiada.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between py-4 text-left gap-3"
      >
        <span className="font-semibold text-foreground text-sm leading-snug">{q}</span>
        {open
          ? <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
          : <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />}
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const countdown = useCountdown(9 * 60 + 58);
  const [vagas] = useState(47);
  const [selected, setSelected] = useState(2);
  const navigate = useNavigate();

  const kits = [
    {
      id: 1,
      label: "Tratamento 01 Mês",
      desc: "Dose de adaptação (1 canetas)",
      original: "R$ 1.100",
      price: "R$ 97,00",
      icon: <img src="https://product-data.raiadrogasil.io/images/16451727.webp" alt="Kit 1 mês" className="h-12 w-12 rounded object-cover" />,
      badge: null,
      highlight: false,
      productImg: "https://product-data.raiadrogasil.io/images/16451727.webp",
    },
    {
      id: 2,
      label: "Tratamento 03 Meses",
      desc: "Ciclo de Redução Padrão (3 canetas)",
      original: "R$ 3.300",
      price: "R$ 169,00",
      icon: <img src="https://product-data.raiadrogasil.io/images/16451727.webp" alt="Kit 3 meses" className="h-12 w-12 rounded object-cover" />,
      badge: "RECOMENDADO PELO MINISTÉRIO",
      highlight: true,
      productImg: "https://product-data.raiadrogasil.io/images/16451727.webp",
    },
    {
      id: 3,
      label: "Tratamento 06 Meses",
      desc: "Ciclo Completo de Emagrecimento (6 canetas)",
      original: "R$ 6.600",
      price: "R$ 227,00",
      icon: <img src="https://product-data.raiadrogasil.io/images/16451727.webp" alt="Kit 6 meses" className="h-12 w-12 rounded object-cover" />,
      badge: "MELHOR CUSTO-BENEFÍCIO",
      highlight: false,
      productImg: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400",
    },
  ];

  const selectedKit = kits.find((k) => k.id === selected)!;

  // Função para serializar kit (remove propriedade icon que é JSX)
  const serializeKit = (kit: typeof kits[0]) => {
    const { icon, ...serializableKit } = kit;
    return serializableKit;
  };

  // Salva o kit padrão no localStorage ao carregar a página
  useEffect(() => {
    const defaultKit = kits.find((k) => k.id === 2);
    if (defaultKit) {
      localStorage.setItem("selectedKit", JSON.stringify(serializeKit(defaultKit)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-secondary pb-24">

      {/* ── TICKER BAR ───────────────────────────────────────────────────── */}
      <div className="bg-brand-red text-primary-foreground text-center text-xs font-medium py-2 px-4">
        ⚠️ Aviso: Subsídio limitado por CPF. Vagas remanescentes para sua região.
      </div>

      {/* ── STICKY HEADER ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3 flex flex-col items-center gap-3">
          <div className="relative w-full flex items-center justify-center">
            <img 
              src={drogasilLogo} 
              alt="Drogasil" 
              className="mx-auto h-[73px] w-auto object-contain sm:h-[83px]" 
              style={{ maxWidth: '286px', width: '80vw' }}
            />
           
          </div>

          <div className="flex gap-2 w-full">
            <div className="flex-1 bg-brand-dark rounded-lg px-3 py-2 text-center text-primary-foreground">
              <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Promoção expira em:</div>
              <div className="font-black text-2xl tabular-nums leading-none mt-0.5">{countdown}</div>
            </div>
            <div className="flex-1 bg-brand-green rounded-lg px-3 py-2 text-center text-primary-foreground">
              <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Unidades Disponível:</div>
              <div className="font-black text-2xl leading-none mt-0.5">{vagas}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-4 pt-6 text-center">
        <div className="inline-block bg-brand-red/10 text-brand-red rounded-full px-5 py-2 font-bold text-sm mb-5">
          COMPRA ÚNICA POR CPF
        </div>

        <h1 className="text-2xl font-black text-foreground leading-tight mb-4">
          Garanta seu Tratamento com Mounjaro (Tirzepatida) via Parceria Público-Privada
        </h1>

        <p className="text-sm text-muted-foreground mb-6 px-4">
          O Ministério da Saúde em conjunto com a rede Drogasil liberou o subsídio direto para pacientes com indicação de controle de IMC. Verifique a disponibilidade para o seu CPF abaixo.
        </p>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-background p-4 flex items-center justify-center">
          <img src={mounjaroPens} alt="Produto Drogasil" className="w-full max-w-xs object-contain mx-auto" />
        </div>
      </section>

      {/* ── REQUISITOS ───────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-4 pt-10">
        <h2 className="text-xl font-black text-foreground text-center mb-4">Requisitos para Participação</h2>
        <div className="rounded-2xl border border-border bg-background p-5 flex flex-col gap-3">
          {[
            { icon: <UserCheck className="h-5 w-5 text-brand-green" />, text: "Ser maior de 18 anos" },
            { icon: <ClipboardCheck className="h-5 w-5 text-brand-green" />, text: "Possuir CPF ativo e regular" },
            { icon: <Syringe className="h-5 w-5 text-brand-green" />, text: "Estar com IMC acima de 27" },
          ].map((req) => (
            <div key={req.text} className="flex items-center gap-3">
              {req.icon}
              <span className="text-sm font-medium text-foreground">{req.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── KITS / TRATAMENTOS ───────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-4 pt-10">
        <h2 className="text-xl font-black text-foreground text-center mb-6">Selecione o Tempo de Tratamento</h2>

        <div className="flex flex-col gap-4">
          {kits.map((kit) => {
            const isSelected = selected === kit.id;
            return (
              <div key={kit.id} className="relative">
                {kit.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-brand-red text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap">
                    {kit.badge}
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelected(kit.id);
                    localStorage.setItem("selectedKit", JSON.stringify(serializeKit(kit)));
                  }}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                    kit.highlight
                      ? "border-brand-red bg-brand-red/5"
                      : isSelected
                        ? "border-brand-green bg-background"
                        : "border-border bg-background hover:border-brand-red/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-lg flex items-center justify-center shrink-0 ${
                      kit.highlight ? "bg-brand-red" : "bg-muted"
                    }`}>
                      {kit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground text-lg">{kit.label}</div>
                      <div className="text-xs text-muted-foreground italic">{kit.desc}</div>
                      <div className="mt-2 font-bold text-xl" style={{ color: kit.highlight ? "hsl(var(--brand-red))" : "hsl(var(--brand-green))" }}>
                        {kit.price}{" "}
                        <span className="text-xs text-muted-foreground line-through font-normal">{kit.original}</span>
                      </div>
                      {/* imagem removida conforme solicitado */}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <button
          className="mt-8 w-full rounded-2xl bg-brand-green py-4 font-black text-xl text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all"
          onClick={() => {
            const kit = kits.find((k) => k.id === selected);
            if (kit) {
              localStorage.setItem("selectedKit", JSON.stringify(serializeKit(kit)));
            }
            navigate("/Checkout");
          }}
        >
          RESERVAR MEU TRATAMENTO AGORA
        </button>

        <div className="mt-4 flex justify-center gap-4 text-[10px] text-muted-foreground uppercase font-bold">
          <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Transação Criptografada</span>
          <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Entrega via Sedex</span>
        </div>
      </section>

      {/* ── PROVA SOCIAL ─────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-4 pt-10">
        <h2 className="text-xl font-black text-foreground text-center mb-6">Depoimentos de Pacientes do Programa</h2>
        <div className="flex flex-col gap-3">
          {[
            { name: "Maria S.", city: "São Paulo, SP", text: "Perdi 14kg em 3 meses de tratamento. Mudou minha vida completamente. O programa é sério e confiável.", time: "2 semanas atrás", img: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Carlos R.", city: "Rio de Janeiro, RJ", text: "Meu endocrinologista já tinha indicado o Mounjaro, mas o custo era absurdo. Com o subsídio consegui fazer o ciclo completo.", time: "1 mês atrás", img: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Ana Paula M.", city: "Belo Horizonte, MG", text: "Estava com IMC 34 e hoje estou com 27. A caneta é super fácil de aplicar e os efeitos colaterais foram mínimos.", time: "3 semanas atrás", img: "https://randomuser.me/api/portraits/women/65.jpg" },
            { name: "Roberto F.", city: "Curitiba, PR", text: "Recebi em 5 dias úteis, tudo lacrado e dentro da cadeia fria. Produto 100% original com nota fiscal.", time: "1 semana atrás", img: "https://randomuser.me/api/portraits/men/41.jpg" },
            { name: "Fernanda L.", city: "Salvador, BA", text: "Já estou no segundo mês e perdi 8kg. A saciedade que o medicamento dá é impressionante, nem sinto fome.", time: "2 semanas atrás", img: "https://randomuser.me/api/portraits/women/68.jpg" },
            { name: "João Pedro A.", city: "Brasília, DF", text: "Fiz questão de verificar a procedência e está tudo certo. Programa legítimo com respaldo do Ministério da Saúde.", time: "1 mês atrás", img: "https://randomuser.me/api/portraits/men/55.jpg" },
            { name: "Luciana T.", city: "Porto Alegre, RS", text: "Minha glicose normalizou e perdi 11kg em 2 meses. Meu médico ficou impressionado com os resultados.", time: "3 semanas atrás", img: "https://randomuser.me/api/portraits/women/12.jpg" },
            { name: "Marcos V.", city: "Recife, PE", text: "Tentei de tudo para emagrecer e nada funcionava. Com o Mounjaro finalmente vi resultado real e sustentável.", time: "2 semanas atrás", img: "https://randomuser.me/api/portraits/men/23.jpg" },
            { name: "Patrícia C.", city: "Goiânia, GO", text: "Atendimento excelente, tiraram todas as minhas dúvidas antes de eu fazer a inscrição. Super recomendo o programa.", time: "1 semana atrás", img: "https://randomuser.me/api/portraits/women/29.jpg" },
            { name: "Eduardo N.", city: "Fortaleza, CE", text: "Comprei o ciclo de 3 meses e já estou vendo resultados no primeiro mês. Melhor investimento que fiz na minha saúde.", time: "4 dias atrás", img: "https://randomuser.me/api/portraits/men/12.jpg" },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover shrink-0 border border-border" />
                <div>
                  <div className="font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.city}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
              <p className="text-xs text-muted-foreground mt-2">✓ Participante verificado · {t.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-4 pt-12">
        <h2 className="text-xl font-black text-foreground mb-4">Perguntas Frequentes</h2>
        <div className="rounded-2xl border border-border bg-background px-4 divide-y divide-border">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="max-w-xl mx-auto px-4 pt-12 pb-4 text-center">
        <div className="border-t border-border pt-6">
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-bold"><Shield className="h-4 w-4 text-brand-green" /> Site Protegido</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-bold"><ClipboardCheck className="h-4 w-4 text-brand-red" /> Ministério da Saúde</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-bold"><Truck className="h-4 w-4 text-brand-green" /> Distribuição Drogasil</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            © 2026 Programa de Acesso à Saúde Metabólica. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-4 text-xs text-brand-red mt-2">
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <span className="text-border">|</span>
            <a href="#" className="hover:underline">Termos de Uso</a>
          </div>
        </div>
      </footer>

      {/* ── STICKY BOTTOM BAR ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Selecionado:</div>
            <div className="font-black text-sm text-foreground">
              {selectedKit.label}{" "}
              <span className="text-brand-green">{selectedKit.price}</span>
            </div>
          </div>
          <button
            className="shrink-0 rounded-xl bg-brand-red px-5 py-3 font-black text-sm text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
            onClick={() => navigate("/Checkout")}
          >
            RESERVAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
}
