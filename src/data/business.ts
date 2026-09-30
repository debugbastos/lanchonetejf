/**
 * Dados institucionais oficiais do Lanches do Baiano.
 * Fonte única: todos os componentes consomem daqui. Não repita estes dados em outros arquivos.
 */

export interface HorarioDia {
  /** 0 = domingo … 6 = sábado (mesma convenção do Date.getDay()) */
  dia: number;
  nome: string;
  abreviacao: string;
  /** "HH:MM" — ausente quando fechado */
  abre?: string;
  /** "HH:MM" — "00:00" significa meia-noite (fim do dia) */
  fecha?: string;
  fechado?: boolean;
}

const enderecoBusca = "Lanches do Baiano, Av. Dr. Simeão de Faria, 665, Juiz de Fora - MG";

export const business = {
  nome: "Lanches do Baiano",
  nomeCompleto: "Lanches do Baiano | Hambúrguer e Cachorro Quente",
  descricao: "Hambúrguer e Cachorro Quente",

  whatsapp: "5532988588079",
  telefone: "(32) 98858-8079",
  telefoneLink: "tel:+5532988588079",

  instagram: "lanchesdobaianojf",
  instagramUrl: "https://instagram.com/lanchesdobaianojf",

  endereco: {
    rua: "Av. Doutor Simeão de Faria, 665",
    cidade: "Juiz de Fora",
    estado: "MG",
    cidadeUf: "Juiz de Fora - MG",
    cep: "36087-450",
    pais: "BR",
  },

  mapa: {
    /** Embed oficial fornecido para a página de localização */
    embedUrl:
      "https://www.google.com/maps?q=Lanches+do+Baiano,+Av.+Dr.+Sime%C3%A3o+de+Faria,+665,+Juiz+de+Fora+-+MG&output=embed",
    /** Abre o local no Google Maps (Maps URLs API) */
    abrirUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoBusca)}`,
    /** Abre a rota até o local no Google Maps */
    rotaUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoBusca)}`,
  },

  /** Fuso horário de Juiz de Fora — usado no cálculo de ABERTO/FECHADO */
  timezone: "America/Sao_Paulo",

  /** Ordem de exibição: segunda → domingo */
  horarios: [
    { dia: 1, nome: "Segunda-feira", abreviacao: "Seg", abre: "17:30", fecha: "00:00" },
    { dia: 2, nome: "Terça-feira", abreviacao: "Ter", abre: "17:30", fecha: "00:00" },
    { dia: 3, nome: "Quarta-feira", abreviacao: "Qua", fechado: true },
    { dia: 4, nome: "Quinta-feira", abreviacao: "Qui", abre: "17:30", fecha: "00:00" },
    { dia: 5, nome: "Sexta-feira", abreviacao: "Sex", abre: "17:30", fecha: "00:00" },
    { dia: 6, nome: "Sábado", abreviacao: "Sáb", abre: "17:30", fecha: "00:00" },
    { dia: 0, nome: "Domingo", abreviacao: "Dom", abre: "17:30", fecha: "00:00" },
  ] satisfies HorarioDia[] as HorarioDia[],

  /** Resumo textual dos horários, usado em blocos compactos (footer, contato) */
  horarioResumo: [
    { dias: "Segunda, terça e quinta a domingo", horas: "17:30 – 00:00" },
    { dias: "Quarta-feira", horas: "Fechado" },
  ],
} as const;

/**
 * URL pública do site (usada em SEO, sitemap e Open Graph).
 * Defina NEXT_PUBLIC_SITE_URL no ambiente de produção (ex.: https://www.seudominio.com.br).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
