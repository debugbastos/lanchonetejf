import { business, type HorarioDia } from "@/data/business";

const MINUTOS_DIA = 24 * 60;
const DIAS_SEMANA = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function horarioDoDia(dia: number): HorarioDia | undefined {
  return business.horarios.find((h) => h.dia === dia);
}

/** Intervalos [início, fim) em minutos para um dia, considerando virada da meia-noite */
function intervalos(h: HorarioDia | undefined): { hoje: [number, number] | null; madrugada: number } {
  if (!h || h.fechado || !h.abre || !h.fecha) return { hoje: null, madrugada: 0 };
  const abre = paraMinutos(h.abre);
  const fecha = paraMinutos(h.fecha);
  if (fecha > abre) return { hoje: [abre, fecha], madrugada: 0 };
  // Fecha em horário menor ou igual à abertura → atravessa a meia-noite ("00:00" = fim do dia)
  return { hoje: [abre, MINUTOS_DIA], madrugada: fecha };
}

/** Dia da semana e minutos atuais no fuso de Juiz de Fora */
export function agoraNoFuso(data: Date = new Date(), timeZone: string = business.timezone) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "0";
  const dia = DIAS_SEMANA.indexOf(valor("weekday"));
  const minutos = (Number(valor("hour")) % 24) * 60 + Number(valor("minute"));
  return { dia, minutos };
}

function formatarHora(hhmm: string): string {
  return hhmm === "00:00" ? "meia-noite" : hhmm;
}

export interface StatusFuncionamento {
  aberto: boolean;
  /** Dia atual (0 = domingo) no fuso da loja */
  hoje: number;
  /** Ex.: "Fecha à meia-noite", "Abre hoje às 17:30", "Abre amanhã às 17:30" */
  detalhe: string;
}

export function statusFuncionamento(data: Date = new Date()): StatusFuncionamento {
  const { dia, minutos } = agoraNoFuso(data);
  const hoje = intervalos(horarioDoDia(dia));
  const ontem = intervalos(horarioDoDia((dia + 6) % 7));

  // Aberto desde ontem (virada da meia-noite)
  if (minutos < ontem.madrugada) {
    const h = horarioDoDia((dia + 6) % 7)!;
    return { aberto: true, hoje: dia, detalhe: `Fecha às ${formatarHora(h.fecha!)}` };
  }

  if (hoje.hoje && minutos >= hoje.hoje[0] && minutos < hoje.hoje[1]) {
    const h = horarioDoDia(dia)!;
    const fecha = formatarHora(h.fecha!);
    return { aberto: true, hoje: dia, detalhe: fecha === "meia-noite" ? "Fecha à meia-noite" : `Fecha às ${fecha}` };
  }

  if (hoje.hoje && minutos < hoje.hoje[0]) {
    return { aberto: false, hoje: dia, detalhe: `Abre hoje às ${horarioDoDia(dia)!.abre}` };
  }

  for (let i = 1; i <= 7; i++) {
    const proximo = horarioDoDia((dia + i) % 7);
    if (proximo && !proximo.fechado && proximo.abre) {
      const quando = i === 1 ? "amanhã" : proximo.nome.toLowerCase().replace("-feira", "");
      return { aberto: false, hoje: dia, detalhe: `Abre ${quando} às ${proximo.abre}` };
    }
  }

  return { aberto: false, hoje: dia, detalhe: "Consulte o horário" };
}
