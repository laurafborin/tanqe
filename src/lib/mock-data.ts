// ============================================================
// MOCK DATA CENTRAL — TANQE
// Todos os dados são cruzados e consistentes:
// um leilão concluído gera um contrato, NF-e, pagamento e pedido
// com o mesmo id, distribuidora, combustível e valores.
// ============================================================

export type Combustivel =
  | 'Gasolina Comum'
  | 'Gasolina Aditivada'
  | 'Etanol Hidratado'
  | 'Diesel S-10'
  | 'Diesel S-500'

export type LeilaoStatus =
  | 'aberto'
  | 'aguardando_pagamento'
  | 'em_entrega'
  | 'concluido'
  | 'cancelado'

export type PedidoStatus =
  | 'aguardando_coleta'
  | 'em_transito'
  | 'entregue'
  | 'atrasado'

export type ContratoStatus = 'pendente' | 'assinado' | 'cancelado'
export type PagamentoStatus = 'pendente' | 'pago' | 'atrasado'
export type LanceStatus = 'ganhando' | 'perdido' | 'vencedor' | 'recusado'

export interface Posto {
  id: string
  nome: string
  razaoSocial: string
  cnpj: string
  inscricaoEstadual: string
  endereco: string
  cidade: string
  uf: string
  cep: string
  lat: number
  lng: number
  bandeira: string
  volumeMensal: number
  capacidadeTanque: number
  combustiveis: Combustivel[]
  score: number
  totalOperacoes: number
  telefone: string
  email: string
  criadoEm: string
  responsavel: string
}

export interface Distribuidora {
  id: string
  nome: string
  razaoSocial: string
  cnpj: string
  inscricaoEstadual: string
  endereco: string
  cidade: string
  uf: string
  lat: number
  lng: number
  basesAtendidas: string[]
  combustiveis: Combustivel[]
  tempoMedioEntrega: number
  volumeMensal: number
  capacidadeLogistica: number
  score: number
  totalOperacoes: number
  telefone: string
  email: string
}

export interface Lance {
  id: string
  leilaoId: string
  distId: string
  precoLitro: number
  prazoEntrega: number
  timestamp: string
  observacoes?: string
}

export type Modalidade = 'entrega' | 'retirada'

export interface Leilao {
  id: string
  codigo: string
  postoId: string
  combustivel: Combustivel
  volume: number
  precoTeto: number
  precoAtual: number
  precoFinal?: number
  distVencedoraId?: string
  status: LeilaoStatus
  regiao: string
  formaPagamento: 'PIX' | 'Boleto' | 'Transferência'
  prazoMaximoDias: number
  modalidade: Modalidade
  createdAt: string
  endsAt: string
  lances: Lance[]
}

export interface Contrato {
  id: string
  numero: string
  leilaoId: string
  postoId: string
  distId: string
  combustivel: Combustivel
  volume: number
  precoLitro: number
  valor: number
  status: ContratoStatus
  formaPagamento: 'PIX' | 'Boleto' | 'Transferência'
  prazoEntregaDias: number
  hashContrato: string
  assinadoPostoEm?: string
  assinadoDistEm?: string
  criadoEm: string
  clausulas: string[]
}

export interface NFE {
  id: string
  contratoId: string
  numero: number
  serie: number
  chave: string
  dataEmissao: string
  combustivel: Combustivel
  volume: number
  precoLitro: number
  valorTotal: number
  icms: number
  pis: number
  cofins: number
  cide: number
  baseCalculo: number
  emitenteId: string
  destinatarioId: string
  status: 'emitida' | 'cancelada'
}

export interface Pagamento {
  id: string
  contratoId: string
  valor: number
  metodo: 'PIX' | 'Boleto' | 'Transferência'
  status: PagamentoStatus
  pagoEm?: string
  vencimento: string
  criadoEm: string
}

export interface Pedido {
  id: string
  contratoId: string
  leilaoId: string
  postoId: string
  distId: string
  combustivel: Combustivel
  volume: number
  status: PedidoStatus
  caminhaoPlaca: string
  motorista: string
  motoristaTelefone: string
  previsaoEntrega: string
  saidaEm?: string
  entregueEm?: string
  percentualConcluido: number
  ultimaLocalizacao: { lat: number; lng: number; cidade: string; atualizadoEm: string }
  origemLat: number
  origemLng: number
  destinoLat: number
  destinoLng: number
  etapas: Array<{ nome: string; concluida: boolean; quandoIso?: string }>
}

export interface Avaliacao {
  id: string
  avaliadorId: string
  avaliadoId: string
  contratoId: string
  nota: number
  comentario: string
  criterios: { pontualidade: number; qualidade: number; comunicacao: number }
  criadoEm: string
}

export interface Certificacao {
  id: string
  nome: string
  emissor: string
  numero: string
  emissaoIso: string
  vencimentoIso: string
  status: 'ativa' | 'vencida' | 'pendente'
}

// ============================================================
// USUÁRIOS LOGADOS (fixos para a demo)
// ============================================================
export const POSTO_LOGADO_ID = 'pst_001'
export const DIST_LOGADA_ID = 'dst_001'

// ============================================================
// POSTOS
// ============================================================
export const POSTOS: Posto[] = [
  {
    id: 'pst_001',
    nome: 'Auto Posto Sol Nascente',
    razaoSocial: 'Auto Posto Sol Nascente Comércio de Combustíveis Ltda',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '116.452.348.119',
    endereco: 'Av. Brasil, 1500 — Vila Mariana',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04018-002',
    lat: -23.589,
    lng: -46.635,
    bandeira: 'Bandeira Branca',
    volumeMensal: 84500,
    capacidadeTanque: 60000,
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol Hidratado', 'Diesel S-10'],
    score: 4.8,
    totalOperacoes: 47,
    telefone: '(11) 3456-7890',
    email: 'contato@postosolnascente.com.br',
    criadoEm: '2022-03-15',
    responsavel: 'João Mendes',
  },
  {
    id: 'pst_002',
    nome: 'Posto Auto Norte',
    razaoSocial: 'Posto Auto Norte Ltda',
    cnpj: '22.334.566/0001-11',
    inscricaoEstadual: '116.452.110.220',
    endereco: 'Av. Cruzeiro do Sul, 4200',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '02030-100',
    lat: -23.42,
    lng: -46.69,
    bandeira: 'Bandeira Branca',
    volumeMensal: 62000,
    capacidadeTanque: 50000,
    combustiveis: ['Gasolina Comum', 'Etanol Hidratado', 'Diesel S-10'],
    score: 4.5,
    totalOperacoes: 32,
    telefone: '(11) 2233-4455',
    email: 'contato@postoautonorte.com.br',
    criadoEm: '2022-08-22',
    responsavel: 'Maria Silva',
  },
  {
    id: 'pst_003',
    nome: 'Posto Central Campinas',
    razaoSocial: 'Posto Central Campinas Ltda',
    cnpj: '33.445.677/0001-22',
    inscricaoEstadual: '116.452.220.331',
    endereco: 'Av. Francisco Glicério, 1234',
    cidade: 'Campinas',
    uf: 'SP',
    cep: '13013-100',
    lat: -22.91,
    lng: -47.06,
    bandeira: 'Bandeira Branca',
    volumeMensal: 95000,
    capacidadeTanque: 70000,
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Diesel S-10', 'Diesel S-500'],
    score: 4.7,
    totalOperacoes: 58,
    telefone: '(19) 3344-5566',
    email: 'contato@centralcampinas.com.br',
    criadoEm: '2021-11-10',
    responsavel: 'Carlos Eduardo Ramos',
  },
  {
    id: 'pst_004',
    nome: 'Posto BR Sorocaba',
    razaoSocial: 'Posto BR Sorocaba Ltda',
    cnpj: '44.556.788/0001-33',
    inscricaoEstadual: '116.452.330.442',
    endereco: 'Av. Itavuvu, 8800',
    cidade: 'Sorocaba',
    uf: 'SP',
    cep: '18075-005',
    lat: -23.51,
    lng: -47.46,
    bandeira: 'Bandeira Branca',
    volumeMensal: 71000,
    capacidadeTanque: 55000,
    combustiveis: ['Gasolina Comum', 'Etanol Hidratado', 'Diesel S-10'],
    score: 4.6,
    totalOperacoes: 41,
    telefone: '(15) 3322-4455',
    email: 'contato@brsorocaba.com.br',
    criadoEm: '2023-02-01',
    responsavel: 'Pedro Alves',
  },
  {
    id: 'pst_005',
    nome: 'Posto Galo ABC',
    razaoSocial: 'Posto Galo Combustíveis ABC Ltda',
    cnpj: '55.667.899/0001-44',
    inscricaoEstadual: '116.452.440.553',
    endereco: 'Av. Industrial, 1450',
    cidade: 'Santo André',
    uf: 'SP',
    cep: '09080-510',
    lat: -23.67,
    lng: -46.5,
    bandeira: 'Bandeira Branca',
    volumeMensal: 58000,
    capacidadeTanque: 45000,
    combustiveis: ['Gasolina Comum', 'Diesel S-10'],
    score: 4.3,
    totalOperacoes: 22,
    telefone: '(11) 4455-6677',
    email: 'contato@postogalo.com.br',
    criadoEm: '2023-06-18',
    responsavel: 'Ana Paula Costa',
  },
  {
    id: 'pst_006',
    nome: 'Posto Via Dutra RJ',
    razaoSocial: 'Posto Via Dutra Ltda',
    cnpj: '66.778.910/0001-55',
    inscricaoEstadual: '116.452.550.664',
    endereco: 'Rod. Presidente Dutra, km 230',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '21931-200',
    lat: -22.91,
    lng: -43.21,
    bandeira: 'Bandeira Branca',
    volumeMensal: 110000,
    capacidadeTanque: 80000,
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Diesel S-10', 'Diesel S-500'],
    score: 4.6,
    totalOperacoes: 68,
    telefone: '(21) 3344-5566',
    email: 'contato@viadutra.com.br',
    criadoEm: '2021-05-20',
    responsavel: 'Roberto Tavares',
  },
]

// ============================================================
// DISTRIBUIDORAS
// ============================================================
export const DISTRIBUIDORAS: Distribuidora[] = [
  {
    id: 'dst_001',
    nome: 'BR Petro SP',
    razaoSocial: 'BR Petro Distribuidora de Combustíveis S.A.',
    cnpj: '34.567.890/0001-12',
    inscricaoEstadual: '116.452.778.119',
    endereco: 'Av. dos Imigrantes, 500 — Cumbica',
    cidade: 'Guarulhos',
    uf: 'SP',
    lat: -23.46,
    lng: -46.53,
    basesAtendidas: ['SP', 'RJ', 'MG', 'PR', 'RS'],
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol Hidratado', 'Diesel S-10', 'Diesel S-500'],
    tempoMedioEntrega: 18,
    volumeMensal: 487000,
    capacidadeLogistica: 450000,
    score: 4.7,
    totalOperacoes: 142,
    telefone: '(11) 4567-8900',
    email: 'comercial@brpetrosp.com.br',
  },
  {
    id: 'dst_002',
    nome: 'Ipiranga RJ',
    razaoSocial: 'Ipiranga Distribuidora Rio Ltda',
    cnpj: '45.678.901/0001-23',
    inscricaoEstadual: '116.452.889.220',
    endereco: 'Av. Brasil, 22000',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    lat: -22.91,
    lng: -43.21,
    basesAtendidas: ['RJ', 'ES', 'MG'],
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Diesel S-10', 'Diesel S-500'],
    tempoMedioEntrega: 24,
    volumeMensal: 320000,
    capacidadeLogistica: 280000,
    score: 4.6,
    totalOperacoes: 98,
    telefone: '(21) 4567-8900',
    email: 'comercial@ipirangarj.com.br',
  },
  {
    id: 'dst_003',
    nome: 'Raízen Campinas',
    razaoSocial: 'Raízen Distribuidora Interior SP S.A.',
    cnpj: '56.789.012/0001-34',
    inscricaoEstadual: '116.452.990.331',
    endereco: 'Rod. Anhanguera, km 95',
    cidade: 'Campinas',
    uf: 'SP',
    lat: -22.91,
    lng: -47.06,
    basesAtendidas: ['SP', 'MG', 'GO'],
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol Hidratado', 'Diesel S-10'],
    tempoMedioEntrega: 12,
    volumeMensal: 540000,
    capacidadeLogistica: 500000,
    score: 4.9,
    totalOperacoes: 178,
    telefone: '(19) 5678-9012',
    email: 'comercial@raizencampinas.com.br',
  },
  {
    id: 'dst_004',
    nome: 'Shell Sorocaba',
    razaoSocial: 'Shell Brasil Distribuidora Sorocaba Ltda',
    cnpj: '67.890.123/0001-45',
    inscricaoEstadual: '116.453.001.442',
    endereco: 'Rod. Castelo Branco, km 80',
    cidade: 'Sorocaba',
    uf: 'SP',
    lat: -23.5,
    lng: -47.46,
    basesAtendidas: ['SP', 'PR'],
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Diesel S-10'],
    tempoMedioEntrega: 16,
    volumeMensal: 280000,
    capacidadeLogistica: 250000,
    score: 4.4,
    totalOperacoes: 76,
    telefone: '(15) 6789-0123',
    email: 'comercial@shellsorocaba.com.br',
  },
  {
    id: 'dst_005',
    nome: 'Petrobras Distr. SP',
    razaoSocial: 'Petrobras Distribuidora S.A.',
    cnpj: '78.901.234/0001-56',
    inscricaoEstadual: '116.453.112.553',
    endereco: 'Av. Tiradentes, 1000',
    cidade: 'São Paulo',
    uf: 'SP',
    lat: -23.42,
    lng: -46.74,
    basesAtendidas: ['SP', 'MG', 'RJ', 'GO', 'MT'],
    combustiveis: ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol Hidratado', 'Diesel S-10', 'Diesel S-500'],
    tempoMedioEntrega: 14,
    volumeMensal: 620000,
    capacidadeLogistica: 580000,
    score: 4.7,
    totalOperacoes: 210,
    telefone: '(11) 7890-1234',
    email: 'comercial@petrobrassp.com.br',
  },
  {
    id: 'dst_006',
    nome: 'Vibra ABC',
    razaoSocial: 'Vibra Energia ABC Ltda',
    cnpj: '89.012.345/0001-67',
    inscricaoEstadual: '116.453.223.664',
    endereco: 'Av. Industrial, 4500',
    cidade: 'Santo André',
    uf: 'SP',
    lat: -23.66,
    lng: -46.53,
    basesAtendidas: ['SP'],
    combustiveis: ['Gasolina Comum', 'Etanol Hidratado', 'Diesel S-10', 'Diesel S-500'],
    tempoMedioEntrega: 10,
    volumeMensal: 215000,
    capacidadeLogistica: 200000,
    score: 4.5,
    totalOperacoes: 64,
    telefone: '(11) 8901-2345',
    email: 'comercial@vibraabc.com.br',
  },
  {
    id: 'dst_007',
    nome: 'Atem Guarulhos',
    razaoSocial: 'Atem Combustíveis Guarulhos Ltda',
    cnpj: '90.123.456/0001-78',
    inscricaoEstadual: '116.453.334.775',
    endereco: 'Av. Monteiro Lobato, 3200',
    cidade: 'Guarulhos',
    uf: 'SP',
    lat: -23.46,
    lng: -46.55,
    basesAtendidas: ['SP'],
    combustiveis: ['Gasolina Comum', 'Diesel S-10'],
    tempoMedioEntrega: 8,
    volumeMensal: 160000,
    capacidadeLogistica: 140000,
    score: 4.3,
    totalOperacoes: 38,
    telefone: '(11) 9012-3456',
    email: 'comercial@atemguarulhos.com.br',
  },
  {
    id: 'dst_008',
    nome: 'CIA Brasileira Diadema',
    razaoSocial: 'Cia Brasileira de Combustíveis Diadema Ltda',
    cnpj: '01.234.567/0001-89',
    inscricaoEstadual: '116.453.445.886',
    endereco: 'Av. Antônio Piranga, 2200',
    cidade: 'Diadema',
    uf: 'SP',
    lat: -23.69,
    lng: -46.62,
    basesAtendidas: ['SP'],
    combustiveis: ['Gasolina Comum', 'Etanol Hidratado', 'Diesel S-10'],
    tempoMedioEntrega: 11,
    volumeMensal: 195000,
    capacidadeLogistica: 180000,
    score: 4.6,
    totalOperacoes: 52,
    telefone: '(11) 0123-4567',
    email: 'comercial@ciabrasileiradiadema.com.br',
  },
]

// ============================================================
// HELPERS DE DATA
// ============================================================
const HOURS = (h: number) => h * 3600_000
const DAYS = (d: number) => d * 24 * HOURS(1)
const now = Date.now()
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString()

// ============================================================
// LEILÕES (mix de status, cross-referenciados com contratos/pedidos)
// ============================================================
function buildLances(leilaoId: string, lances: Array<{ distId: string; precoLitro: number; prazoEntrega: number; offsetMin: number; obs?: string }>): Lance[] {
  return lances.map((l, i) => ({
    id: `${leilaoId}_lc_${i + 1}`,
    leilaoId,
    distId: l.distId,
    precoLitro: l.precoLitro,
    prazoEntrega: l.prazoEntrega,
    timestamp: iso(-HOURS(l.offsetMin / 60)),
    observacoes: l.obs,
  }))
}

export const LEILOES: Leilao[] = [
  // ---- ABERTOS ----
  {
    id: 'lei_001',
    codigo: 'LEI-2026-0142',
    postoId: 'pst_001',
    combustivel: 'Gasolina Comum',
    volume: 30000,
    precoTeto: 5.82,
    precoAtual: 5.61,
    status: 'aberto',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 5,
    modalidade: 'entrega',
    createdAt: iso(-HOURS(10)),
    endsAt: iso(HOURS(14) + 32 * 60_000),
    lances: buildLances('lei_001', [
      { distId: 'dst_003', precoLitro: 5.78, prazoEntrega: 4, offsetMin: 500, obs: 'Pronta entrega via Anhanguera' },
      { distId: 'dst_001', precoLitro: 5.69, prazoEntrega: 3, offsetMin: 320, obs: 'Frete dedicado incluso' },
      { distId: 'dst_005', precoLitro: 5.61, prazoEntrega: 3, offsetMin: 80, obs: 'Margem mínima — terminal Paulínia' },
    ]),
  },
  {
    id: 'lei_002',
    codigo: 'LEI-2026-0143',
    postoId: 'pst_001',
    combustivel: 'Diesel S-10',
    volume: 25000,
    precoTeto: 5.94,
    precoAtual: 5.78,
    status: 'aberto',
    regiao: 'Grande São Paulo',
    formaPagamento: 'Boleto',
    prazoMaximoDias: 7,
    modalidade: 'entrega',
    createdAt: iso(-HOURS(18)),
    endsAt: iso(HOURS(6) + 18 * 60_000),
    lances: buildLances('lei_002', [
      { distId: 'dst_001', precoLitro: 5.88, prazoEntrega: 6, offsetMin: 900 },
      { distId: 'dst_005', precoLitro: 5.84, prazoEntrega: 5, offsetMin: 600 },
      { distId: 'dst_006', precoLitro: 5.81, prazoEntrega: 4, offsetMin: 400 },
      { distId: 'dst_003', precoLitro: 5.79, prazoEntrega: 4, offsetMin: 180 },
      { distId: 'dst_001', precoLitro: 5.78, prazoEntrega: 3, offsetMin: 30, obs: 'Cobertura agressiva' },
    ]),
  },
  {
    id: 'lei_003',
    codigo: 'LEI-2026-0144',
    postoId: 'pst_003',
    combustivel: 'Etanol Hidratado',
    volume: 12000,
    precoTeto: 3.85,
    precoAtual: 3.62,
    status: 'aberto',
    regiao: 'Interior SP',
    formaPagamento: 'PIX',
    prazoMaximoDias: 3,
    modalidade: 'retirada',
    createdAt: iso(-HOURS(22)),
    endsAt: iso(HOURS(22) + 11 * 60_000),
    lances: buildLances('lei_003', [
      { distId: 'dst_003', precoLitro: 3.74, prazoEntrega: 3, offsetMin: 1200 },
      { distId: 'dst_005', precoLitro: 3.62, prazoEntrega: 2, offsetMin: 90, obs: 'Etanol anidro premium' },
    ]),
  },
  {
    id: 'lei_004',
    codigo: 'LEI-2026-0145',
    postoId: 'pst_002',
    combustivel: 'Gasolina Aditivada',
    volume: 18000,
    precoTeto: 6.05,
    precoAtual: 5.85,
    status: 'aberto',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 4,
    modalidade: 'entrega',
    createdAt: iso(-HOURS(5)),
    endsAt: iso(HOURS(31)),
    lances: buildLances('lei_004', [
      { distId: 'dst_001', precoLitro: 5.94, prazoEntrega: 4, offsetMin: 240 },
      { distId: 'dst_005', precoLitro: 5.85, prazoEntrega: 3, offsetMin: 60 },
    ]),
  },
  {
    id: 'lei_005',
    codigo: 'LEI-2026-0146',
    postoId: 'pst_004',
    combustivel: 'Diesel S-500',
    volume: 22000,
    precoTeto: 5.78,
    precoAtual: 5.62,
    status: 'aberto',
    regiao: 'Sorocaba e região',
    formaPagamento: 'Boleto',
    prazoMaximoDias: 6,
    modalidade: 'entrega',
    createdAt: iso(-HOURS(3)),
    endsAt: iso(HOURS(45)),
    lances: buildLances('lei_005', [
      { distId: 'dst_004', precoLitro: 5.71, prazoEntrega: 5, offsetMin: 150 },
      { distId: 'dst_001', precoLitro: 5.62, prazoEntrega: 4, offsetMin: 25 },
    ]),
  },
  {
    id: 'lei_006',
    codigo: 'LEI-2026-0147',
    postoId: 'pst_006',
    combustivel: 'Diesel S-10',
    volume: 35000,
    precoTeto: 5.96,
    precoAtual: 5.82,
    status: 'aberto',
    regiao: 'Rio de Janeiro',
    formaPagamento: 'Transferência',
    prazoMaximoDias: 8,
    modalidade: 'entrega',
    createdAt: iso(-HOURS(2)),
    endsAt: iso(HOURS(70)),
    lances: buildLances('lei_006', [
      { distId: 'dst_002', precoLitro: 5.88, prazoEntrega: 7, offsetMin: 90 },
      { distId: 'dst_002', precoLitro: 5.82, prazoEntrega: 6, offsetMin: 20 },
    ]),
  },

  // ---- AGUARDANDO PAGAMENTO ----
  {
    id: 'lei_010',
    codigo: 'LEI-2026-0138',
    postoId: 'pst_001',
    combustivel: 'Gasolina Comum',
    volume: 18000,
    precoTeto: 5.88,
    precoAtual: 5.58,
    precoFinal: 5.58,
    distVencedoraId: 'dst_003',
    status: 'aguardando_pagamento',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 5,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(2)),
    endsAt: iso(-HOURS(8)),
    lances: buildLances('lei_010', [
      { distId: 'dst_001', precoLitro: 5.7, prazoEntrega: 4, offsetMin: 2400 },
      { distId: 'dst_003', precoLitro: 5.58, prazoEntrega: 3, offsetMin: 600, obs: 'Aceito pelo posto' },
    ]),
  },
  {
    id: 'lei_011',
    codigo: 'LEI-2026-0139',
    postoId: 'pst_003',
    combustivel: 'Diesel S-10',
    volume: 28000,
    precoTeto: 5.98,
    precoAtual: 5.71,
    precoFinal: 5.71,
    distVencedoraId: 'dst_001',
    status: 'aguardando_pagamento',
    regiao: 'Interior SP',
    formaPagamento: 'Boleto',
    prazoMaximoDias: 6,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(3)),
    endsAt: iso(-DAYS(1)),
    lances: buildLances('lei_011', [
      { distId: 'dst_003', precoLitro: 5.78, prazoEntrega: 5, offsetMin: 4000 },
      { distId: 'dst_001', precoLitro: 5.71, prazoEntrega: 4, offsetMin: 1800 },
    ]),
  },

  // ---- EM ENTREGA ----
  {
    id: 'lei_020',
    codigo: 'LEI-2026-0130',
    postoId: 'pst_001',
    combustivel: 'Diesel S-10',
    volume: 25000,
    precoTeto: 5.95,
    precoAtual: 5.61,
    precoFinal: 5.61,
    distVencedoraId: 'dst_001',
    status: 'em_entrega',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 3,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(4)),
    endsAt: iso(-DAYS(3)),
    lances: buildLances('lei_020', [
      { distId: 'dst_005', precoLitro: 5.78, prazoEntrega: 4, offsetMin: 5400 },
      { distId: 'dst_001', precoLitro: 5.61, prazoEntrega: 3, offsetMin: 4800 },
    ]),
  },
  {
    id: 'lei_021',
    codigo: 'LEI-2026-0131',
    postoId: 'pst_001',
    combustivel: 'Gasolina Aditivada',
    volume: 20000,
    precoTeto: 6.1,
    precoAtual: 5.79,
    precoFinal: 5.79,
    distVencedoraId: 'dst_003',
    status: 'em_entrega',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 5,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(5)),
    endsAt: iso(-DAYS(4)),
    lances: buildLances('lei_021', [
      { distId: 'dst_001', precoLitro: 5.92, prazoEntrega: 5, offsetMin: 6200 },
      { distId: 'dst_003', precoLitro: 5.79, prazoEntrega: 4, offsetMin: 5800 },
    ]),
  },
  {
    id: 'lei_022',
    codigo: 'LEI-2026-0132',
    postoId: 'pst_003',
    combustivel: 'Etanol Hidratado',
    volume: 15000,
    precoTeto: 3.92,
    precoAtual: 3.68,
    precoFinal: 3.68,
    distVencedoraId: 'dst_003',
    status: 'em_entrega',
    regiao: 'Interior SP',
    formaPagamento: 'PIX',
    prazoMaximoDias: 3,
    modalidade: 'retirada',
    createdAt: iso(-DAYS(6)),
    endsAt: iso(-DAYS(5)),
    lances: buildLances('lei_022', [
      { distId: 'dst_003', precoLitro: 3.68, prazoEntrega: 3, offsetMin: 7000 },
    ]),
  },

  // ---- CONCLUÍDOS ----
  {
    id: 'lei_030',
    codigo: 'LEI-2026-0118',
    postoId: 'pst_001',
    combustivel: 'Diesel S-10',
    volume: 30000,
    precoTeto: 5.99,
    precoAtual: 5.68,
    precoFinal: 5.68,
    distVencedoraId: 'dst_001',
    status: 'concluido',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 4,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(15)),
    endsAt: iso(-DAYS(14)),
    lances: [],
  },
  {
    id: 'lei_031',
    codigo: 'LEI-2026-0119',
    postoId: 'pst_001',
    combustivel: 'Gasolina Comum',
    volume: 22000,
    precoTeto: 5.85,
    precoAtual: 5.55,
    precoFinal: 5.55,
    distVencedoraId: 'dst_003',
    status: 'concluido',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 5,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(20)),
    endsAt: iso(-DAYS(19)),
    lances: [],
  },
  {
    id: 'lei_032',
    codigo: 'LEI-2026-0120',
    postoId: 'pst_001',
    combustivel: 'Etanol Hidratado',
    volume: 14000,
    precoTeto: 3.95,
    precoAtual: 3.71,
    precoFinal: 3.71,
    distVencedoraId: 'dst_001',
    status: 'concluido',
    regiao: 'Grande São Paulo',
    formaPagamento: 'Boleto',
    prazoMaximoDias: 3,
    modalidade: 'retirada',
    createdAt: iso(-DAYS(25)),
    endsAt: iso(-DAYS(24)),
    lances: [],
  },
  {
    id: 'lei_033',
    codigo: 'LEI-2026-0121',
    postoId: 'pst_001',
    combustivel: 'Diesel S-500',
    volume: 32000,
    precoTeto: 5.78,
    precoAtual: 5.42,
    precoFinal: 5.42,
    distVencedoraId: 'dst_006',
    status: 'concluido',
    regiao: 'ABC Paulista',
    formaPagamento: 'PIX',
    prazoMaximoDias: 6,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(30)),
    endsAt: iso(-DAYS(29)),
    lances: [],
  },
  {
    id: 'lei_034',
    codigo: 'LEI-2026-0122',
    postoId: 'pst_001',
    combustivel: 'Gasolina Aditivada',
    volume: 16000,
    precoTeto: 6.12,
    precoAtual: 5.82,
    precoFinal: 5.82,
    distVencedoraId: 'dst_003',
    status: 'concluido',
    regiao: 'Grande São Paulo',
    formaPagamento: 'PIX',
    prazoMaximoDias: 4,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(35)),
    endsAt: iso(-DAYS(34)),
    lances: [],
  },

  // ---- CANCELADOS ----
  {
    id: 'lei_040',
    codigo: 'LEI-2026-0100',
    postoId: 'pst_001',
    combustivel: 'Gasolina Comum',
    volume: 12000,
    precoTeto: 5.5,
    precoAtual: 5.5,
    status: 'cancelado',
    regiao: 'Grande São Paulo',
    formaPagamento: 'Boleto',
    prazoMaximoDias: 5,
    modalidade: 'entrega',
    createdAt: iso(-DAYS(40)),
    endsAt: iso(-DAYS(39)),
    lances: [],
  },
]

// ============================================================
// CONTRATOS (derivados de leilões em aguardando_pagamento, em_entrega, concluido)
// ============================================================
const CLAUSULAS_PADRAO: string[] = [
  'O presente contrato refere-se ao fornecimento de combustível conforme especificações ANP vigentes.',
  'O volume total será entregue em remessa única dentro do prazo acordado, em horário comercial.',
  'O preço acordado é fixo e inclui frete CIF até o posto comprador.',
  'O pagamento será realizado conforme forma e prazo estipulados, contados após confirmação da entrega.',
  'Ambas as partes concordam com os termos da plataforma TANQE e legislação vigente.',
]

function makeHash(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export const CONTRATOS: Contrato[] = LEILOES
  .filter(l => l.status !== 'aberto' && l.status !== 'cancelado' && l.distVencedoraId && l.precoFinal)
  .map((l, i) => {
    const valor = (l.precoFinal as number) * l.volume
    const isAssinado = l.status !== 'aguardando_pagamento'
    return {
      id: `con_${String(i + 1).padStart(3, '0')}`,
      numero: `C-2026-${String(140 + i).padStart(4, '0')}`,
      leilaoId: l.id,
      postoId: l.postoId,
      distId: l.distVencedoraId as string,
      combustivel: l.combustivel,
      volume: l.volume,
      precoLitro: l.precoFinal as number,
      valor,
      status: isAssinado ? ('assinado' as ContratoStatus) : ('pendente' as ContratoStatus),
      formaPagamento: l.formaPagamento,
      prazoEntregaDias: l.prazoMaximoDias,
      hashContrato: makeHash(),
      assinadoPostoEm: isAssinado ? iso(-DAYS(l.status === 'em_entrega' ? 4 : 14)) : undefined,
      assinadoDistEm: isAssinado ? iso(-DAYS(l.status === 'em_entrega' ? 4 : 14)) : undefined,
      criadoEm: l.endsAt,
      clausulas: CLAUSULAS_PADRAO,
    }
  })

// ============================================================
// NF-e (derivadas de contratos assinados)
// ============================================================
export const NFES: NFE[] = CONTRATOS
  .filter(c => c.status === 'assinado')
  .map((c, i) => {
    const valor = c.valor
    return {
      id: `nfe_${String(i + 1).padStart(3, '0')}`,
      contratoId: c.id,
      numero: 142 + i,
      serie: 1,
      chave: Array.from({ length: 44 }, () => Math.floor(Math.random() * 10)).join(''),
      dataEmissao: c.assinadoDistEm ?? c.criadoEm,
      combustivel: c.combustivel,
      volume: c.volume,
      precoLitro: c.precoLitro,
      valorTotal: valor,
      icms: valor * 0.18,
      pis: valor * 0.0165,
      cofins: valor * 0.076,
      cide: valor * 0.01,
      baseCalculo: valor,
      emitenteId: c.distId,
      destinatarioId: c.postoId,
      status: 'emitida',
    }
  })

// ============================================================
// PAGAMENTOS
// ============================================================
export const PAGAMENTOS: Pagamento[] = CONTRATOS.map((c, i) => {
  const pago = c.status === 'assinado'
  return {
    id: `pag_${String(i + 1).padStart(3, '0')}`,
    contratoId: c.id,
    valor: c.valor,
    metodo: c.formaPagamento,
    status: pago ? ('pago' as PagamentoStatus) : ('pendente' as PagamentoStatus),
    pagoEm: pago ? c.assinadoDistEm : undefined,
    vencimento: c.assinadoPostoEm
      ? new Date(new Date(c.assinadoPostoEm).getTime() + DAYS(3)).toISOString()
      : iso(DAYS(2)),
    criadoEm: c.criadoEm,
  }
})

// ============================================================
// PEDIDOS (derivados de contratos em_entrega/concluido)
// ============================================================
function buildPedido(c: Contrato, i: number, statusLeilao: LeilaoStatus): Pedido {
  const posto = POSTOS.find(p => p.id === c.postoId) as Posto
  const dist = DISTRIBUIDORAS.find(d => d.id === c.distId) as Distribuidora
  const isEntregue = statusLeilao === 'concluido'
  const status: PedidoStatus = isEntregue ? 'entregue' : 'em_transito'
  const motoristas = ['Carlos Souza', 'Joaquim Lima', 'Antônio Carvalho', 'Marcos Pereira', 'Edson Ferreira', 'Roberto Silva']
  const placas = ['ABC-1A23', 'BCD-2B34', 'CDE-3C45', 'DEF-4D56', 'EFG-5E67', 'FGH-6F78']
  const previsao = isEntregue ? iso(-DAYS(i + 1)) : iso(HOURS(2 + i))
  return {
    id: `ped_${String(i + 1).padStart(3, '0')}`,
    contratoId: c.id,
    leilaoId: c.leilaoId,
    postoId: c.postoId,
    distId: c.distId,
    combustivel: c.combustivel,
    volume: c.volume,
    status,
    caminhaoPlaca: placas[i % placas.length],
    motorista: motoristas[i % motoristas.length],
    motoristaTelefone: '(11) 9' + String(80000000 + i * 1234).slice(0, 8),
    previsaoEntrega: previsao,
    saidaEm: iso(-DAYS(isEntregue ? i + 2 : 1)),
    entregueEm: isEntregue ? iso(-DAYS(i + 1)) : undefined,
    percentualConcluido: isEntregue ? 100 : 45 + i * 8,
    ultimaLocalizacao: {
      lat: (posto.lat + dist.lat) / 2 + (Math.random() - 0.5) * 0.03,
      lng: (posto.lng + dist.lng) / 2 + (Math.random() - 0.5) * 0.03,
      cidade: isEntregue ? posto.cidade : 'Em trânsito',
      atualizadoEm: iso(-HOURS(0.5)),
    },
    origemLat: dist.lat,
    origemLng: dist.lng,
    destinoLat: posto.lat,
    destinoLng: posto.lng,
    etapas: [
      { nome: 'Pagamento confirmado', concluida: true, quandoIso: iso(-DAYS(isEntregue ? i + 3 : 2)) },
      { nome: 'Coleta agendada', concluida: true, quandoIso: iso(-DAYS(isEntregue ? i + 2 : 1)) },
      { nome: 'Em trânsito', concluida: true, quandoIso: iso(-DAYS(isEntregue ? i + 1 : 0.5)) },
      { nome: 'Entregue', concluida: isEntregue, quandoIso: isEntregue ? iso(-DAYS(i)) : undefined },
    ],
  }
}

export const PEDIDOS: Pedido[] = CONTRATOS
  .filter(c => c.status === 'assinado')
  .map((c, i) => {
    const leilao = LEILOES.find(l => l.id === c.leilaoId) as Leilao
    return buildPedido(c, i, leilao.status)
  })

// ============================================================
// AVALIAÇÕES
// ============================================================
const COMENTARIOS = [
  'Entrega no horário, motorista educado, qualidade do produto excelente.',
  'Comunicação clara desde o aceite. Pequeno atraso de 30min na coleta, mas resolveram bem.',
  'Distribuidora confiável, sempre dentro do prazo. Repetiríamos a operação.',
  'Documentação fiscal impecável. Recomendo.',
  'Produto entregue na especificação ANP. Sem ressalvas.',
  'Atendimento ágil, resolução rápida de imprevistos.',
]

export const AVALIACOES: Avaliacao[] = CONTRATOS
  .filter(c => c.status === 'assinado')
  .map((c, i) => ({
    id: `aval_${String(i + 1).padStart(3, '0')}`,
    avaliadorId: c.postoId,
    avaliadoId: c.distId,
    contratoId: c.id,
    nota: i % 7 === 0 ? 4 : 5,
    comentario: COMENTARIOS[i % COMENTARIOS.length],
    criterios: {
      pontualidade: 4 + (i % 2),
      qualidade: 5,
      comunicacao: 4 + ((i + 1) % 2),
    },
    criadoEm: c.assinadoPostoEm ?? c.criadoEm,
  }))

// ============================================================
// CERTIFICAÇÕES
// ============================================================
export const CERTIFICACOES_POSTO: Certificacao[] = [
  { id: 'crt_p1', nome: 'Cadastro ANP', emissor: 'Agência Nacional do Petróleo', numero: 'ANP-SP-2024-118432', emissaoIso: '2024-01-10', vencimentoIso: '2027-01-10', status: 'ativa' },
  { id: 'crt_p2', nome: 'Alvará de funcionamento', emissor: 'Prefeitura de São Paulo', numero: 'ALV-2024-22-1187', emissaoIso: '2024-03-22', vencimentoIso: '2026-03-22', status: 'ativa' },
  { id: 'crt_p3', nome: 'Licença ambiental CETESB', emissor: 'CETESB', numero: 'CTS-2023-9011', emissaoIso: '2023-09-15', vencimentoIso: '2026-09-15', status: 'ativa' },
  { id: 'crt_p4', nome: 'Inspeção tanques (NR-20)', emissor: 'INMETRO', numero: 'NR20-2025-4421', emissaoIso: '2025-02-04', vencimentoIso: '2026-02-04', status: 'pendente' },
  { id: 'crt_p5', nome: 'Corpo de Bombeiros (AVCB)', emissor: 'CBPMESP', numero: 'AVCB-2024-31889', emissaoIso: '2024-05-30', vencimentoIso: '2027-05-30', status: 'ativa' },
  { id: 'crt_p6', nome: 'ISO 14001 — Gestão Ambiental', emissor: 'BSI Brasil', numero: 'ISO14001-2024-447', emissaoIso: '2024-08-12', vencimentoIso: '2027-08-12', status: 'ativa' },
  { id: 'crt_p7', nome: 'PROCONVE — Emissões', emissor: 'IBAMA', numero: 'PRCV-2024-8821', emissaoIso: '2024-02-18', vencimentoIso: '2026-02-18', status: 'ativa' },
  { id: 'crt_p8', nome: 'Selo Combustível Sustentável', emissor: 'União Brasileira do Biodiesel', numero: 'UBB-2025-1102', emissaoIso: '2025-01-30', vencimentoIso: '2026-01-30', status: 'ativa' },
]

// ============================================================
// CONQUISTAS E RECONHECIMENTOS DO POSTO (vitrine)
// ============================================================
export interface Conquista {
  id: string
  titulo: string
  detalhe: string
  emissor: string
  data: string
  destaque?: boolean
}

export const CONQUISTAS_POSTO: Conquista[] = [
  { id: 'cq_1', titulo: 'Top 3% em economia da Grande SP', detalhe: 'Melhor performance de negociação no 1º semestre de 2026', emissor: 'TANQE Insights', data: '2026-04-01', destaque: true },
  { id: 'cq_2', titulo: 'Selo Posto Verificado', detalhe: 'Compliance regulatório completo + score acima de 4.5', emissor: 'TANQE Compliance', data: '2025-11-12' },
  { id: 'cq_3', titulo: '100+ contratos sem inadimplência', detalhe: 'Histórico de pagamento perfeito em todas as operações', emissor: 'TANQE Risk', data: '2026-02-20' },
  { id: 'cq_4', titulo: 'Pioneiro em leilão reverso digital', detalhe: 'Entre os primeiros 50 postos a aderir à plataforma', emissor: 'TANQE', data: '2024-09-01' },
  { id: 'cq_5', titulo: 'Embaixador TANQE', detalhe: 'Convidado para o painel de feedback estratégico do produto', emissor: 'Diretoria TANQE', data: '2026-03-15' },
]

// Avaliações extras pra enriquecer a vitrine do perfil
export const AVALIACOES_DESTAQUE_POSTO: Avaliacao[] = [
  { id: 'av_des_1', avaliadorId: 'dst_001', avaliadoId: 'pst_001', contratoId: 'con_001', nota: 5, comentario: 'Operação impecável do início ao fim. Documentação enviada em minutos, pagamento na hora, equipe técnica receptiva. Posto referência em São Paulo.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-04-18T14:00:00Z' },
  { id: 'av_des_2', avaliadorId: 'dst_003', avaliadoId: 'pst_001', contratoId: 'con_002', nota: 5, comentario: 'Comunicação muito clara. Recebemos confirmação de descarga com fotos. Fiscalização ANP foi tranquila pra ambas as partes. Vamos repetir mensalmente.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-03-22T10:30:00Z' },
  { id: 'av_des_3', avaliadorId: 'dst_005', avaliadoId: 'pst_001', contratoId: 'con_003', nota: 5, comentario: 'Posto com infraestrutura de ponta. Cubagem feita por terceiro independente em todas as entregas. Profissionalismo de rede grande operando em independente.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 4 }, criadoEm: '2026-02-08T16:45:00Z' },
  { id: 'av_des_4', avaliadorId: 'dst_006', avaliadoId: 'pst_001', contratoId: 'con_004', nota: 5, comentario: 'Sempre fecham na primeira oferta válida — não ficam empurrando preço pra baixo no pos-leilão. Postura comercial honesta, raro no mercado.', criterios: { pontualidade: 4, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-01-30T09:15:00Z' },
  { id: 'av_des_5', avaliadorId: 'dst_002', avaliadoId: 'pst_001', contratoId: 'con_005', nota: 5, comentario: 'Volume mensal consistente e previsível. Excelente parceria de longo prazo. Posto recomendado para distribuidoras que buscam carteira estável.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2025-12-12T11:00:00Z' },
  { id: 'av_des_6', avaliadorId: 'dst_008', avaliadoId: 'pst_001', contratoId: 'con_006', nota: 4, comentario: 'Boa experiência. Pequeno ajuste de janela de descarga no início, resolvido por telefone em 5 minutos. Operação fluida.', criterios: { pontualidade: 4, qualidade: 5, comunicacao: 5 }, criadoEm: '2025-11-28T13:20:00Z' },
]

export const CONQUISTAS_DIST: Conquista[] = [
  { id: 'cqd_1', titulo: 'Top 5 distribuidoras da Grande SP', detalhe: 'Maior volume contratado via plataforma no 1º semestre de 2026', emissor: 'TANQE Rankings', data: '2026-04-15', destaque: true },
  { id: 'cqd_2', titulo: 'Selo Entrega no Prazo', detalhe: '98,7% das entregas concluídas dentro da janela acordada', emissor: 'TANQE Operacional', data: '2026-03-08' },
  { id: 'cqd_3', titulo: 'Parceira preferencial em Diesel S-10', detalhe: 'Win rate de 72% em leilões do combustível na região', emissor: 'TANQE Insights', data: '2026-02-20' },
  { id: 'cqd_4', titulo: 'Zero penalidades regulatórias', detalhe: '24 meses sem registro de infração ANP ou ambiental', emissor: 'TANQE Compliance', data: '2026-01-10' },
  { id: 'cqd_5', titulo: 'Embaixadora do leilão reverso', detalhe: 'Parceira piloto desde o lançamento da plataforma em 2024', emissor: 'TANQE', data: '2024-09-01' },
]

export const AVALIACOES_DESTAQUE_DIST: Avaliacao[] = [
  { id: 'avd_1', avaliadorId: 'pst_001', avaliadoId: 'dst_001', contratoId: 'con_001', nota: 5, comentario: 'Caminhão chegou 30min antes do horário marcado. Cubagem conferida na minha frente. NF-e emitida antes do motorista sair do pátio. Operação que nem rede grande consegue replicar.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-04-20T15:00:00Z' },
  { id: 'avd_2', avaliadorId: 'pst_003', avaliadoId: 'dst_001', contratoId: 'con_002', nota: 5, comentario: 'Equipe comercial responde em minutos no WhatsApp. Já me avisaram 3 vezes sobre variações relevantes da ANP antes do meu próximo leilão. Parceria de verdade.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-03-30T10:15:00Z' },
  { id: 'avd_3', avaliadorId: 'pst_002', avaliadoId: 'dst_001', contratoId: 'con_003', nota: 5, comentario: 'Diesel S-10 dentro da especificação ANP em todas as 8 entregas que fizemos. Documentação fiscal sem um erro. Posto independente precisa disso.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 4 }, criadoEm: '2026-02-18T12:30:00Z' },
  { id: 'avd_4', avaliadorId: 'pst_004', avaliadoId: 'dst_001', contratoId: 'con_004', nota: 5, comentario: 'Aceita pequenas variações de volume sem complicação. Última entrega o tanque tava mais cheio do que eu esperava e eles ajustaram em 1h.', criterios: { pontualidade: 4, qualidade: 5, comunicacao: 5 }, criadoEm: '2026-01-25T16:45:00Z' },
  { id: 'avd_5', avaliadorId: 'pst_006', avaliadoId: 'dst_001', contratoId: 'con_005', nota: 5, comentario: 'Preço quase sempre 2-3 centavos abaixo da média da praça. Sustentaram isso por 6 meses. Não tem como pedir mais.', criterios: { pontualidade: 5, qualidade: 5, comunicacao: 5 }, criadoEm: '2025-12-20T11:00:00Z' },
  { id: 'avd_6', avaliadorId: 'pst_005', avaliadoId: 'dst_001', contratoId: 'con_006', nota: 4, comentario: 'Uma vez o motorista chegou em horário diferente, mas avisaram 2h antes. Tirando isso, operação muito profissional.', criterios: { pontualidade: 4, qualidade: 5, comunicacao: 5 }, criadoEm: '2025-11-30T14:20:00Z' },
]

export const CERTIFICACOES_DIST: Certificacao[] = [
  { id: 'crt_d1', nome: 'Autorização ANP — Distribuidor', emissor: 'Agência Nacional do Petróleo', numero: 'ANP-DIST-2023-2014', emissaoIso: '2023-06-01', vencimentoIso: '2028-06-01', status: 'ativa' },
  { id: 'crt_d2', nome: 'Cadastro SEFAZ-SP', emissor: 'SEFAZ-SP', numero: 'SEFAZ-SP-2024-008811', emissaoIso: '2024-01-22', vencimentoIso: '2027-01-22', status: 'ativa' },
  { id: 'crt_d3', nome: 'ISO 9001 — Qualidade', emissor: 'BSI Brasil', numero: 'ISO-9001-2024-114', emissaoIso: '2024-08-12', vencimentoIso: '2027-08-12', status: 'ativa' },
  { id: 'crt_d4', nome: 'Licença ambiental IBAMA', emissor: 'IBAMA', numero: 'IBAMA-2023-44889', emissaoIso: '2023-11-04', vencimentoIso: '2026-11-04', status: 'ativa' },
  { id: 'crt_d5', nome: 'Cadastro RNTRC', emissor: 'ANTT', numero: 'RNTRC-2025-77001', emissaoIso: '2025-01-15', vencimentoIso: '2026-01-15', status: 'vencida' },
  { id: 'crt_d6', nome: 'PROCONVE — Frota', emissor: 'IBAMA', numero: 'PRCV-DIST-2024-2002', emissaoIso: '2024-04-20', vencimentoIso: '2027-04-20', status: 'ativa' },
  { id: 'crt_d7', nome: 'OHSAS 18001 — SST', emissor: 'BSI Brasil', numero: 'OHSAS-2024-558', emissaoIso: '2024-09-30', vencimentoIso: '2027-09-30', status: 'ativa' },
  { id: 'crt_d8', nome: 'Termo de adesão CONPET', emissor: 'CONPET', numero: 'CONPET-2025-3344', emissaoIso: '2025-02-10', vencimentoIso: '2028-02-10', status: 'ativa' },
]

// ============================================================
// SÉRIES TEMPORAIS
// ============================================================
export const ANP_30D = Array.from({ length: 30 }, (_, i) => ({
  dia: `D-${29 - i}`,
  data: new Date(now - DAYS(29 - i)).toISOString(),
  gasolinaComum: 5.78 + Math.sin(i / 4) * 0.09 + (i / 30) * 0.04,
  gasolinaAditivada: 5.98 + Math.sin(i / 4 + 1) * 0.1,
  etanol: 3.91 + Math.cos(i / 3) * 0.06,
  dieselS10: 5.91 + Math.sin(i / 5) * 0.08,
  dieselS500: 5.74 + Math.cos(i / 4) * 0.07,
}))

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const HOJE = new Date()
function ultimosMeses(n: number) {
  const r: Array<{ mes: string; idx: number }> = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(HOJE.getFullYear(), HOJE.getMonth() - i, 1)
    r.push({ mes: MESES_PT[d.getMonth()], idx: n - 1 - i })
  }
  return r
}

export const ECONOMIA_12M = ultimosMeses(12).map(({ mes, idx }) => ({
  mes,
  economia: 6800 + idx * 540 + Math.round(Math.sin(idx) * 1200),
  meta: 8000,
}))

export const VOLUME_12M_POSTO = ultimosMeses(12).map(({ mes, idx }) => ({
  mes,
  volume: 62000 + idx * 1800 + Math.round(Math.sin(idx / 2) * 6000),
}))

export const RECEITA_12M_DIST = ultimosMeses(12).map(({ mes, idx }) => ({
  mes,
  receita: 1850000 + idx * 84000 + Math.round(Math.sin(idx / 2) * 180000),
}))

export const SPLIT_COMBUSTIVEL_POSTO = [
  { nome: 'Diesel S-10', valor: 38 },
  { nome: 'Gasolina Comum', valor: 26 },
  { nome: 'Gasolina Aditivada', valor: 18 },
  { nome: 'Etanol Hidratado', valor: 12 },
  { nome: 'Diesel S-500', valor: 6 },
]

export const WINRATE_COMBUSTIVEL_DIST = [
  { combustivel: 'Diesel S-10', winRate: 72 },
  { combustivel: 'Gasolina Comum', winRate: 64 },
  { combustivel: 'Gasolina Aditivada', winRate: 58 },
  { combustivel: 'Etanol Hidratado', winRate: 41 },
  { combustivel: 'Diesel S-500', winRate: 67 },
]

export const FUNIL_LEILOES_DIST = [
  { etapa: 'Convidada', valor: 184 },
  { etapa: 'Deu lance', valor: 142 },
  { etapa: 'Top 3', valor: 98 },
  { etapa: 'Venceu', valor: 91 },
]

export const PARTICIPACAO_REGIAO_DIST = [
  { regiao: 'Grande São Paulo', valor: 48 },
  { regiao: 'Interior SP', valor: 22 },
  { regiao: 'ABC', valor: 14 },
  { regiao: 'RJ', valor: 10 },
  { regiao: 'Outros', valor: 6 },
]

export const TICKET_MEDIO_12M_DIST = ultimosMeses(12).map(({ mes, idx }) => ({
  mes,
  ticket: 92000 + idx * 1200 + Math.round(Math.sin(idx / 3) * 8000),
}))

// ============================================================
// AUDITORIA: timeline de eventos (imutável)
// ============================================================
export interface EventoAuditoria {
  id: string
  quandoIso: string
  acao: string
  ator: string
  referencia?: string
  hash: string
}

export const EVENTOS_AUDITORIA_POSTO: EventoAuditoria[] = CONTRATOS
  .filter(c => c.postoId === POSTO_LOGADO_ID)
  .flatMap((c, i): EventoAuditoria[] => [
    { id: `evt_${i}_1`, quandoIso: c.criadoEm, acao: 'Contrato gerado', ator: 'Sistema', referencia: c.numero, hash: c.hashContrato.slice(0, 12) },
    ...(c.assinadoPostoEm ? [{ id: `evt_${i}_2`, quandoIso: c.assinadoPostoEm, acao: 'Contrato assinado pelo posto', ator: 'Auto Posto Sol Nascente', referencia: c.numero, hash: c.hashContrato.slice(12, 24) }] : []),
    ...(c.assinadoDistEm ? [{ id: `evt_${i}_3`, quandoIso: c.assinadoDistEm, acao: 'Contrato assinado pela distribuidora', ator: DISTRIBUIDORAS.find(d => d.id === c.distId)?.nome ?? '—', referencia: c.numero, hash: c.hashContrato.slice(24, 36) }] : []),
  ])

// ============================================================
// HELPERS DE BUSCA
// ============================================================
export const getPosto = (id: string) => POSTOS.find(p => p.id === id)
export const getDist = (id: string) => DISTRIBUIDORAS.find(d => d.id === id)
export const getLeilao = (id: string) => LEILOES.find(l => l.id === id)
export const getContrato = (id: string) => CONTRATOS.find(c => c.id === id)
export const getContratoByLeilao = (leilaoId: string) => CONTRATOS.find(c => c.leilaoId === leilaoId)
export const getNfeByContrato = (contratoId: string) => NFES.find(n => n.contratoId === contratoId)
export const getPagamentoByContrato = (contratoId: string) => PAGAMENTOS.find(p => p.contratoId === contratoId)
export const getPedidoByContrato = (contratoId: string) => PEDIDOS.find(p => p.contratoId === contratoId)

export const leiloesByPosto = (postoId: string) => LEILOES.filter(l => l.postoId === postoId)
export const leiloesAbertos = () => LEILOES.filter(l => l.status === 'aberto')
export const contratosByPosto = (postoId: string) => CONTRATOS.filter(c => c.postoId === postoId)
export const contratosByDist = (distId: string) => CONTRATOS.filter(c => c.distId === distId)
export const nfesByPosto = (postoId: string) => NFES.filter(n => n.destinatarioId === postoId)
export const nfesByDist = (distId: string) => NFES.filter(n => n.emitenteId === distId)
export const pedidosByPosto = (postoId: string) => PEDIDOS.filter(p => p.postoId === postoId)
export const pedidosByDist = (distId: string) => PEDIDOS.filter(p => p.distId === distId)
export const lancesByDist = (distId: string): Array<{ lance: Lance; leilao: Leilao; status: LanceStatus }> => {
  const out: Array<{ lance: Lance; leilao: Leilao; status: LanceStatus }> = []
  for (const l of LEILOES) {
    for (const lance of l.lances) {
      if (lance.distId !== distId) continue
      let status: LanceStatus
      if (l.status === 'aberto') {
        const melhor = Math.min(...l.lances.map(x => x.precoLitro))
        status = lance.precoLitro === melhor ? 'ganhando' : 'perdido'
      } else if (l.distVencedoraId === distId) {
        status = 'vencedor'
      } else {
        status = 'perdido'
      }
      out.push({ lance, leilao: l, status })
    }
  }
  return out.sort((a, b) => new Date(b.lance.timestamp).getTime() - new Date(a.lance.timestamp).getTime())
}
export const avaliacoesRecebidasPorDist = (distId: string) => AVALIACOES.filter(a => a.avaliadoId === distId)
export const avaliacoesRecebidasPorPosto = (postoId: string) => AVALIACOES.filter(a => a.avaliadoId === postoId)

/**
 * Label da distribuidora em um leilão respeitando anonimato.
 * Enquanto o leilão está aberto, identidades ficam ocultas (estilo licitação).
 * Depois que o leilão encerra, identidades são reveladas.
 *
 * @param viewerDistId — se fornecido, a própria distribuidora vê "Você" no lance dela.
 */
export function distLabelInLeilao(
  leilao: Leilao,
  distId: string,
  viewerDistId?: string,
): { label: string; revelado: boolean } {
  if (leilao.status !== 'aberto') {
    return { label: getDist(distId)?.nome ?? 'Distribuidora', revelado: true }
  }
  if (viewerDistId && viewerDistId === distId) {
    return { label: 'Você', revelado: true }
  }
  const order: string[] = []
  for (const l of leilao.lances) {
    if (!order.includes(l.distId)) order.push(l.distId)
  }
  const idx = order.indexOf(distId)
  return { label: `Concorrente ${String.fromCharCode(65 + idx)}`, revelado: false }
}

export function modalidadeLabel(m: Modalidade): string {
  return m === 'entrega' ? 'Entrega CIF (distribuidora entrega)' : 'Retirada FOB (posto retira)'
}

export function modalidadeBadge(m: Modalidade): string {
  return m === 'entrega' ? 'Entrega' : 'Retirada'
}

export function melhorLance(l: Leilao): Lance | undefined {
  if (l.lances.length === 0) return undefined
  return [...l.lances].sort((a, b) => a.precoLitro - b.precoLitro)[0]
}

export function completudeCadastro(p: Posto | Distribuidora): number {
  const campos = [p.nome, p.razaoSocial, p.cnpj, p.endereco, p.cidade, p.uf, p.telefone, p.email, (p as Posto).bandeira ?? 'X']
  const preenchidos = campos.filter(Boolean).length
  return Math.round((preenchidos / campos.length) * 100)
}
