/**
 * Assets oficiais fornecidos pelo Lanches do Baiano (em /public/assets).
 * Dimensões reais dos arquivos — usadas pelo next/image para evitar layout shift.
 * Não substitua por imagens genéricas nem gere versões alternativas da logo.
 */

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Logo oficial, apenas recortada do fundo preto original (proporção preservada). */
export const logo: SiteImage = {
  src: "/assets/brand/logo-lanches-do-baiano.png",
  width: 668,
  height: 687,
  alt: "Logo do Lanches do Baiano — Burger and Hot Dog",
};

export const photos = {
  /** Fundo escuro, iluminação de estúdio — foto principal do Hero */
  hamburguerBaconCheddar: {
    src: "/assets/fotos/hamburguer-bacon-cheddar.jpg",
    width: 1080,
    height: 1322,
    alt: "Hambúrguer alto com bacon e cheddar derretido sobre uma tábua de madeira",
  },
  lanchesComRefrigerantes: {
    src: "/assets/fotos/lanches-com-refrigerantes.jpg",
    width: 1080,
    height: 1325,
    alt: "Três lanches recheados embrulhados em papel, com refrigerantes em lata sobre a mesa",
  },
  hamburguerDuploCheddarFrente: {
    src: "/assets/fotos/hamburguer-duplo-cheddar-frente.jpg",
    width: 1080,
    height: 1076,
    alt: "Hambúrguer duplo com cheddar cremoso e bacon, visto de frente",
  },
  hamburguerDuploCheddarBacon: {
    src: "/assets/fotos/hamburguer-duplo-cheddar-bacon.jpg",
    width: 1080,
    height: 1350,
    alt: "Hambúrguer duplo com cheddar escorrendo e bacon crocante",
  },
  lancheNaMao: {
    src: "/assets/fotos/lanche-na-mao.jpg",
    width: 1080,
    height: 969,
    alt: "Mão segurando um lanche recheado com batata palha, milho e bacon",
  },
  momentoBaiano: {
    src: "/assets/fotos/momento-baiano.jpg",
    width: 1080,
    height: 1220,
    alt: "Pessoa saboreando um lanche em frente à parede amarela",
  },
  /** Recorte limpo da fotografia de uma arte de divulgação (sem textos nem grafismos) */
  cachorroQuente: {
    src: "/assets/fotos/cachorro-quente-detalhe.jpg",
    width: 360,
    height: 360,
    alt: "Cachorro-quente com molhos sendo levado à boca",
  },
} satisfies Record<string, SiteImage>;
