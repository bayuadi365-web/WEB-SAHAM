// ═══════════════════════════════════════════════════════════════════════════
// DATABASE LENGKAP SAHAM BURSA EFEK INDONESIA (IDX / BEI)
// Mencakup 200+ emiten dari seluruh sektor IDX
// ═══════════════════════════════════════════════════════════════════════════

export const IDX_SECTORS = [
  { id: 'financials', name: 'Keuangan (Financials)', icon: 'Landmark', change: 1.24, indexValue: 1485.6 },
  { id: 'energy', name: 'Energi (Energy)', icon: 'Flame', change: -0.65, indexValue: 2120.4 },
  { id: 'basic_materials', name: 'Barang Baku (Basic Materials)', icon: 'Layers', change: 0.82, indexValue: 1290.1 },
  { id: 'consumer_non_cyclical', name: 'Konsumer Primer (Non-Cyclicals)', icon: 'ShoppingBag', change: 0.35, indexValue: 745.8 },
  { id: 'consumer_cyclical', name: 'Konsumer Non-Primer (Cyclicals)', icon: 'ShoppingBag', change: -0.18, indexValue: 810.3 },
  { id: 'healthcare', name: 'Kesehatan (Healthcare)', icon: 'Activity', change: 0.92, indexValue: 1390.5 },
  { id: 'technology', name: 'Teknologi (Technology)', icon: 'Cpu', change: 2.15, indexValue: 3890.2 },
  { id: 'infrastructure', name: 'Infrastruktur (Infrastructure)', icon: 'Wifi', change: -0.42, indexValue: 885.7 },
  { id: 'properties', name: 'Properti & Real Estate', icon: 'Building2', change: 0.12, indexValue: 715.4 },
  { id: 'industrials', name: 'Perindustrian (Industrials)', icon: 'Factory', change: 0.48, indexValue: 1080.6 },
  { id: 'transportation', name: 'Transportasi & Logistik', icon: 'Truck', change: -0.31, indexValue: 1540.2 },
];

export const IHSG_DATA = {
  ticker: 'COMPOSITE',
  symbol: '^JKSE',
  name: 'Indeks Harga Saham Gabungan (IHSG)',
  price: 6526.81,
  change: 64.52,
  changePercent: 1.00,
  previousClose: 6462.29,
  open: 6450.10,
  dayHigh: 6545.30,
  dayLow: 6440.80,
  volume: 18450000000,
  turnover: 11850000000000,
  advancers: 284,
  decliners: 210,
  unchanged: 196,
};

// ─── Helper: auto-generate fundamental ratios dari harga & profil sederhana ───
function genFundamentals(price, opts = {}) {
  const {
    peRatio = +(8 + Math.random() * 20).toFixed(1),
    pbvRatio = +(0.5 + Math.random() * 4).toFixed(2),
    evEbitda = +(3 + Math.random() * 15).toFixed(1),
    roe = +(5 + Math.random() * 25).toFixed(1),
    roa = +(1 + Math.random() * 15).toFixed(1),
    npm = +(3 + Math.random() * 30).toFixed(1),
    gpm = +(15 + Math.random() * 50).toFixed(1),
    operatingMargin = +(5 + Math.random() * 35).toFixed(1),
    der = +(0.1 + Math.random() * 1.5).toFixed(2),
    currentRatio = +(0.8 + Math.random() * 3).toFixed(2),
    quickRatio = +(0.5 + Math.random() * 2.5).toFixed(2),
    revenueGrowthYoY = +(-10 + Math.random() * 30).toFixed(1),
    netIncomeGrowthYoY = +(-15 + Math.random() * 40).toFixed(1),
    epsGrowth = +(-15 + Math.random() * 40).toFixed(1),
    dividendYield = +(0 + Math.random() * 8).toFixed(2),
    dividendPayoutRatio = +(20 + Math.random() * 60).toFixed(0),
    dps = Math.round(price * (dividendYield / 100)),
    marketCap = null,
    sharesOutstanding = null,
  } = opts;

  const mcap = marketCap || Math.round(price * (sharesOutstanding || (5e9 + Math.random() * 100e9)));
  
  return {
    valuation: { peRatio, pbvRatio, evEbitda, psRatio: +(0.5 + Math.random() * 5).toFixed(1) },
    profitability: { roe, roa, npm, gpm, operatingMargin },
    solvency: { der, currentRatio, quickRatio, car: null },
    growth: { revenueGrowthYoY, netIncomeGrowthYoY, epsGrowth },
    dividend: { dividendYield: +dividendYield, dividendPayoutRatio: +dividendPayoutRatio, dps },
    marketCap: mcap,
    sharesOutstanding: sharesOutstanding || Math.round(mcap / price),
  };
}

// ─── Helper: auto-generate simple financialStatements ───
function genFinStatements(baseRevenue, baseNetIncome) {
  const years = ['2021', '2022', '2023', '2024'];
  let rev = baseRevenue * 0.75;
  let ni = baseNetIncome * 0.65;
  return years.map(year => {
    rev = Math.round(rev * (1 + 0.04 + Math.random() * 0.12));
    ni = Math.round(ni * (1 + 0.02 + Math.random() * 0.16));
    return { year, revenue: rev, netIncome: ni, operatingProfit: Math.round(ni * 1.3), eps: Math.round(ni / 10) };
  });
}

// ─── Helper: auto-generate price & change for a stock ───
function genPriceData(basePrice, volatility = 0.02) {
  const changePct = +((Math.random() - 0.48) * volatility * 100).toFixed(2);
  const change = Math.round(basePrice * changePct / 100);
  const dayRange = Math.round(basePrice * 0.015);
  return {
    price: basePrice,
    change,
    changePercent: changePct,
    previousClose: basePrice - change,
    open: basePrice - Math.round(change * 0.3),
    dayHigh: basePrice + Math.abs(dayRange),
    dayLow: basePrice - Math.abs(dayRange),
    volume: Math.round((5 + Math.random() * 100) * 1e6),
    turnover: Math.round(basePrice * (5 + Math.random() * 100) * 1e6),
  };
}

function formatMCap(mc) {
  if (mc >= 1e15) return `Rp ${(mc / 1e12).toFixed(0)} T`;
  if (mc >= 1e12) return `Rp ${(mc / 1e12).toFixed(1)} T`;
  if (mc >= 1e9) return `Rp ${(mc / 1e9).toFixed(1)} M`;
  return `Rp ${mc.toLocaleString('id-ID')}`;
}

// ─── Build a stock entry (detailed or auto-generated) ───
function makeStock(ticker, name, sector, sectorId, subSector, price, overrides = {}) {
  const pd = genPriceData(price);
  const fund = genFundamentals(price, overrides.fund || {});
  const mcap = overrides.marketCap || fund.marketCap;
  
  return {
    ticker,
    symbol: `${ticker}.JK`,
    name,
    sector,
    sectorId,
    subSector,
    ...pd,
    ...overrides,
    // restore price data if overrides clobber it
    price: overrides.price || price,
    change: overrides.change !== undefined ? overrides.change : pd.change,
    changePercent: overrides.changePercent !== undefined ? overrides.changePercent : pd.changePercent,
    previousClose: overrides.previousClose || pd.previousClose,
    open: overrides.open || pd.open,
    dayHigh: overrides.dayHigh || pd.dayHigh,
    dayLow: overrides.dayLow || pd.dayLow,
    volume: overrides.volume || pd.volume,
    turnover: overrides.turnover || pd.turnover,
    marketCap: mcap,
    marketCapFormatted: formatMCap(mcap),
    sharesOutstanding: fund.sharesOutstanding,
    fiftyTwoWeekHigh: overrides.fiftyTwoWeekHigh || Math.round(price * 1.25),
    fiftyTwoWeekLow: overrides.fiftyTwoWeekLow || Math.round(price * 0.72),
    description: overrides.description || `${name} adalah perusahaan publik yang tercatat di Bursa Efek Indonesia pada sektor ${sector}, sub-sektor ${subSector}.`,
    valuation: overrides.valuation || fund.valuation,
    profitability: overrides.profitability || fund.profitability,
    solvency: overrides.solvency || fund.solvency,
    growth: overrides.growth || fund.growth,
    dividend: overrides.dividend || fund.dividend,
    peers: overrides.peers || [],
    financialStatements: overrides.financialStatements || genFinStatements(
      overrides.baseRevenue || Math.round(price * 50),
      overrides.baseNetIncome || Math.round(price * 10)
    ),
    news: overrides.news || [
      { id: Math.random(), title: `${name} Catat Kinerja Positif di Kuartal Berjalan, Manajemen Optimistis Capai Target Tahunan`, source: 'Bisnis.com', time: `${Math.floor(Math.random() * 12 + 1)} jam lalu`, sentiment: Math.random() > 0.3 ? 'bullish' : 'neutral', readTime: '3 min' },
    ],
  };
}


// ═══════════════════════════════════════════════════════════════════════════
//  DAFTAR LENGKAP EMITEN IDX (200+ saham, semua sektor)
// ═══════════════════════════════════════════════════════════════════════════

export const IDX_STOCKS = [

  // ───────────────────────────────────────
  //  SEKTOR KEUANGAN (FINANCIALS) — PERBANKAN, ASURANSI, MULTIFINANCE, SEKURITAS
  // ───────────────────────────────────────
  makeStock('BBCA', 'PT Bank Central Asia Tbk', 'Keuangan', 'financials', 'Perbankan Swasta', 9175, {
    price: 9175, change: 25, changePercent: 0.27, previousClose: 9150, open: 9150, dayHigh: 9225, dayLow: 9100,
    volume: 58400000, turnover: 535570000000, marketCap: 1131000000000000,
    sharesOutstanding: 123275050000, fiftyTwoWeekHigh: 10450, fiftyTwoWeekLow: 8700,
    description: 'Bank swasta terbesar di Indonesia dengan ekosistem perbankan digital terdepan (BCA Mobile, myBCA), pertumbuhan kredit stabil, dan rasio CASA di atas 80%.',
    valuation: { peRatio: 23.4, pbvRatio: 4.6, evEbitda: 17.1, psRatio: 11.8 },
    profitability: { roe: 21.8, roa: 3.6, npm: 48.6, gpm: 76.5, operatingMargin: 61.2 },
    solvency: { der: 0.16, currentRatio: 1.28, quickRatio: 1.22, car: 29.4 },
    growth: { revenueGrowthYoY: 14.2, netIncomeGrowthYoY: 18.1, epsGrowth: 17.8 },
    dividend: { dividendYield: 2.85, dividendPayoutRatio: 62.4, dps: 270 },
    peers: ['BBRI', 'BMRI', 'BBNI', 'BRIS'],
    financialStatements: [
      { year: '2021', revenue: 76800, netIncome: 31400, operatingProfit: 39500, eps: 255 },
      { year: '2022', revenue: 86400, netIncome: 40700, operatingProfit: 50800, eps: 330 },
      { year: '2023', revenue: 99300, netIncome: 48600, operatingProfit: 60200, eps: 394 },
      { year: '2024', revenue: 112500, netIncome: 55400, operatingProfit: 68900, eps: 450 },
    ],
    news: [
      { id: 1, title: 'BCA Bukukan Laba Bersih Rekor Baru, Kredit Korporasi & Konsumer Tumbuh Solid', source: 'Bisnis.com', time: '2 jam lalu', sentiment: 'bullish', readTime: '3 min' },
      { id: 2, title: 'Transaksi Digital BCA Tembus Puluhan Miliar, CASA di Atas 81%', source: 'Kontan', time: '6 jam lalu', sentiment: 'bullish', readTime: '2 min' },
      { id: 3, title: 'RUPS BCA Setujui Dividen Tunai Final Rp 270 per Saham', source: 'CNBC Indonesia', time: '1 hari lalu', sentiment: 'neutral', readTime: '4 min' },
    ]
  }),
  makeStock('BBRI', 'PT Bank Rakyat Indonesia (Persero) Tbk', 'Keuangan', 'financials', 'Perbankan BUMN & UMKM', 5550, {
    price: 5550, change: 25, changePercent: 0.45, previousClose: 5525, open: 5525, dayHigh: 5600, dayLow: 5500,
    volume: 89600000, turnover: 497280000000, marketCap: 841000000000000,
    sharesOutstanding: 151559000000, fiftyTwoWeekHigh: 6350, fiftyTwoWeekLow: 4620,
    description: 'Bank BUMN terbesar dengan fokus utama segmen mikro dan UMKM melalui jaringan AgenBRILink terluas di Indonesia.',
    valuation: { peRatio: 12.8, pbvRatio: 2.3, evEbitda: 9.8, psRatio: 4.2 },
    profitability: { roe: 18.4, roa: 2.9, npm: 32.5, gpm: 68.2, operatingMargin: 42.1 },
    solvency: { der: 0.42, currentRatio: 1.15, quickRatio: 1.08, car: 25.2 },
    growth: { revenueGrowthYoY: 9.6, netIncomeGrowthYoY: 8.2, epsGrowth: 8.1 },
    dividend: { dividendYield: 6.72, dividendPayoutRatio: 80.0, dps: 335 },
    peers: ['BBCA', 'BMRI', 'BBNI', 'BBTN'],
    financialStatements: [
      { year: '2021', revenue: 142500, netIncome: 31060, operatingProfit: 41200, eps: 205 },
      { year: '2022', revenue: 156300, netIncome: 51400, operatingProfit: 64800, eps: 339 },
      { year: '2023', revenue: 174800, netIncome: 60400, operatingProfit: 76500, eps: 398 },
      { year: '2024', revenue: 188200, netIncome: 63800, operatingProfit: 80400, eps: 421 },
    ],
    news: [
      { id: 4, title: 'BRI Konsisten Bagikan Dividen Jumbo, Payout Ratio 80%', source: 'Investor Daily', time: '3 jam lalu', sentiment: 'bullish', readTime: '3 min' },
      { id: 5, title: 'Kredit Ultra Mikro BRI Tembus Target, AgenBRILink Catat Transaksi Rp 1.400 T', source: 'Detik Finance', time: '12 jam lalu', sentiment: 'bullish', readTime: '2 min' },
    ]
  }),
  makeStock('BMRI', 'PT Bank Mandiri (Persero) Tbk', 'Keuangan', 'financials', 'Perbankan BUMN Korporasi', 6025, {
    price: 6025, change: 50, changePercent: 0.84, previousClose: 5975, open: 5975, dayHigh: 6075, dayLow: 5950,
    volume: 64200000, turnover: 386805000000, marketCap: 562000000000000,
    sharesOutstanding: 93333333333, fiftyTwoWeekHigh: 7450, fiftyTwoWeekLow: 5650,
    description: 'Bank dengan aset terbesar di Indonesia, unggul di segmen korporasi (Livin by Mandiri, Kopra).',
    valuation: { peRatio: 11.2, pbvRatio: 2.1, evEbitda: 8.9, psRatio: 4.1 },
    profitability: { roe: 20.4, roa: 2.8, npm: 36.8, gpm: 69.4, operatingMargin: 46.5 },
    solvency: { der: 0.38, currentRatio: 1.18, quickRatio: 1.12, car: 22.8 },
    growth: { revenueGrowthYoY: 13.5, netIncomeGrowthYoY: 16.8, epsGrowth: 16.5 },
    dividend: { dividendYield: 5.35, dividendPayoutRatio: 60.0, dps: 356 },
    peers: ['BBCA', 'BBRI', 'BBNI'],
    financialStatements: [
      { year: '2021', revenue: 104500, netIncome: 28030, operatingProfit: 37400, eps: 300 },
      { year: '2022', revenue: 119800, netIncome: 41180, operatingProfit: 54200, eps: 441 },
      { year: '2023', revenue: 138400, netIncome: 55060, operatingProfit: 71200, eps: 590 },
      { year: '2024', revenue: 154200, netIncome: 62100, operatingProfit: 79800, eps: 665 },
    ],
    news: [{ id: 6, title: 'Bank Mandiri Catat Pertumbuhan Kredit Konsolidasi 19% YoY', source: 'Bisnis.com', time: '4 jam lalu', sentiment: 'bullish', readTime: '3 min' }]
  }),
  makeStock('BBNI', 'PT Bank Negara Indonesia (Persero) Tbk', 'Keuangan', 'financials', 'Perbankan BUMN', 3750, {
    price: 3750, change: 0, changePercent: 0.00, previousClose: 3750, open: 3750, dayHigh: 3800, dayLow: 3720,
    volume: 32400000, turnover: 121500000000, marketCap: 140000000000000,
    sharesOutstanding: 37299694460, fiftyTwoWeekHigh: 6250, fiftyTwoWeekLow: 3720,
    description: 'Bank BUMN fokus bisnis internasional, korporasi tier-1, dan transformasi digital Wondr by BNI.',
    valuation: { peRatio: 9.4, pbvRatio: 1.35, evEbitda: 7.5, psRatio: 3.2 },
    profitability: { roe: 15.2, roa: 2.2, npm: 32.1, gpm: 66.5, operatingMargin: 40.8 },
    solvency: { der: 0.45, currentRatio: 1.14, quickRatio: 1.09, car: 21.5 },
    growth: { revenueGrowthYoY: 9.8, netIncomeGrowthYoY: 12.4, epsGrowth: 12.0 },
    dividend: { dividendYield: 5.14, dividendPayoutRatio: 50.0, dps: 280 },
    peers: ['BBCA', 'BBRI', 'BMRI', 'BRIS'],
    financialStatements: [
      { year: '2021', revenue: 53200, netIncome: 10890, operatingProfit: 14500, eps: 292 },
      { year: '2022', revenue: 61800, netIncome: 18310, operatingProfit: 24200, eps: 491 },
      { year: '2023', revenue: 65400, netIncome: 20910, operatingProfit: 27800, eps: 561 },
      { year: '2024', revenue: 71200, netIncome: 23100, operatingProfit: 30400, eps: 619 },
    ],
    news: [{ id: 16, title: 'Wondr by BNI Catat Lonjakan Pengguna Aktif dan Nilai Transaksi', source: 'Bisnis.com', time: '10 jam lalu', sentiment: 'bullish', readTime: '3 min' }]
  }),
  makeStock('BBTN', 'PT Bank Tabungan Negara (Persero) Tbk', 'Keuangan', 'financials', 'Perbankan KPR / Properti', 940, {
    peers: ['BBRI', 'BMRI', 'BBNI', 'BRIS'],
    description: 'Bank BUMN spesialis pembiayaan perumahan (KPR) dan kredit konstruksi sektor properti.',
  }),
  makeStock('BRIS', 'PT Bank Syariah Indonesia Tbk', 'Keuangan', 'financials', 'Perbankan Syariah', 1710, {
    peers: ['BBCA', 'BBRI', 'BMRI', 'BBNI'],
    description: 'Bank syariah terbesar di Indonesia hasil merger BSM, BRI Syariah, dan BNI Syariah.',
  }),
  makeStock('BNGA', 'PT Bank CIMB Niaga Tbk', 'Keuangan', 'financials', 'Perbankan Swasta', 1760, { peers: ['BBCA', 'BDMN', 'BNII', 'NISP'] }),
  makeStock('BDMN', 'PT Bank Danamon Indonesia Tbk', 'Keuangan', 'financials', 'Perbankan Swasta & MUFG', 2380, { peers: ['BBCA', 'BNGA', 'NISP'] }),
  makeStock('BNII', 'PT Bank Maybank Indonesia Tbk', 'Keuangan', 'financials', 'Perbankan Asing (Maybank)', 336, { peers: ['BNGA', 'BDMN', 'NISP'] }),
  makeStock('NISP', 'PT Bank OCBC NISP Tbk', 'Keuangan', 'financials', 'Perbankan Asing (OCBC)', 1215, { peers: ['BNGA', 'BDMN', 'BNII'] }),
  makeStock('MEGA', 'PT Bank Mega Tbk', 'Keuangan', 'financials', 'Perbankan Swasta (CT Corp)', 3800, { peers: ['BBCA', 'BNGA'] }),
  makeStock('PNBN', 'PT Bank Pan Indonesia Tbk', 'Keuangan', 'financials', 'Perbankan Swasta', 1120, { peers: ['BNGA', 'BDMN'] }),
  makeStock('BTPS', 'PT Bank BTPN Syariah Tbk', 'Keuangan', 'financials', 'Perbankan Syariah Mikro', 1260, { peers: ['BRIS'] }),
  makeStock('ARTO', 'PT Bank Jago Tbk', 'Keuangan', 'financials', 'Perbankan Digital', 1850, { peers: ['BBYB', 'AMAR'] }),
  makeStock('BBYB', 'PT Bank Neo Commerce Tbk', 'Keuangan', 'financials', 'Perbankan Digital', 278, { peers: ['ARTO', 'AMAR'] }),
  makeStock('AMAR', 'PT Bank Amar Indonesia Tbk', 'Keuangan', 'financials', 'Perbankan Digital UMKM', 190, { peers: ['ARTO', 'BBYB'] }),
  makeStock('BJTM', 'PT Bank Pembangunan Daerah Jawa Timur Tbk', 'Keuangan', 'financials', 'Bank Daerah (BPD)', 710, { peers: ['BJBR', 'BJTM'] }),
  makeStock('BJBR', 'PT Bank Pembangunan Daerah Jawa Barat dan Banten Tbk', 'Keuangan', 'financials', 'Bank Daerah (BPD)', 1190, { peers: ['BJTM'] }),
  makeStock('BBMD', 'PT Bank Mestika Dharma Tbk', 'Keuangan', 'financials', 'Bank Swasta Regional', 3650, { peers: ['BJTM', 'BJBR'] }),
  // Asuransi, Multifinance, Sekuritas
  makeStock('PNLF', 'PT Panin Financial Tbk', 'Keuangan', 'financials', 'Asuransi & Holding Keuangan', 258, { peers: ['LPGI', 'ABDA'] }),
  makeStock('LPGI', 'PT Lippo General Insurance Tbk', 'Keuangan', 'financials', 'Asuransi Umum', 3800, { peers: ['PNLF', 'ABDA'] }),
  makeStock('ABDA', 'PT Asuransi Bina Dana Arta Tbk', 'Keuangan', 'financials', 'Asuransi Umum', 6525, { peers: ['LPGI', 'PNLF'] }),
  makeStock('ADMF', 'PT Adira Dinamika Multi Finance Tbk', 'Keuangan', 'financials', 'Multifinance Otomotif', 9050, { peers: ['BFIN', 'WOMF'] }),
  makeStock('BFIN', 'PT BFI Finance Indonesia Tbk', 'Keuangan', 'financials', 'Multifinance', 1045, { peers: ['ADMF', 'WOMF'] }),
  makeStock('WOMF', 'PT Wahana Ottomitra Multiartha Tbk', 'Keuangan', 'financials', 'Multifinance Motor', 198, { peers: ['ADMF', 'BFIN'] }),
  makeStock('TRIM', 'PT Trimegah Sekuritas Indonesia Tbk', 'Keuangan', 'financials', 'Sekuritas & Manajer Investasi', 386, { peers: ['PANS'] }),
  makeStock('PANS', 'PT Panin Sekuritas Tbk', 'Keuangan', 'financials', 'Sekuritas', 895, { peers: ['TRIM'] }),

  // ───────────────────────────────────────
  //  SEKTOR ENERGI (ENERGY) — BATU BARA, MINYAK & GAS, ENERGI TERBARUKAN
  // ───────────────────────────────────────
  makeStock('ADRO', 'PT Adaro Energy Indonesia Tbk', 'Energi', 'energy', 'Batu Bara & Energi Hijau', 2590, {
    price: 2590, change: 0, changePercent: 0.00, previousClose: 2590, open: 2590, dayHigh: 2640, dayLow: 2570,
    volume: 45100000, turnover: 116809000000, marketCap: 80300000000000,
    sharesOutstanding: 30985962000, fiftyTwoWeekHigh: 4120, fiftyTwoWeekLow: 2360,
    description: 'Produsen batu bara termal dan metalurgi terbesar kedua di Indonesia, diversifikasi ke energi hijau dan smelter aluminium.',
    valuation: { peRatio: 4.8, pbvRatio: 0.95, evEbitda: 2.8, psRatio: 1.1 },
    profitability: { roe: 22.5, roa: 15.2, npm: 26.8, gpm: 39.5, operatingMargin: 33.2 },
    solvency: { der: 0.28, currentRatio: 2.45, quickRatio: 2.15, car: null },
    growth: { revenueGrowthYoY: -12.4, netIncomeGrowthYoY: -16.2, epsGrowth: -16.0 },
    dividend: { dividendYield: 12.5, dividendPayoutRatio: 65.0, dps: 460 },
    peers: ['PTBA', 'ITMG', 'MEDC', 'PGAS'],
    financialStatements: [
      { year: '2021', revenue: 56900, netIncome: 14100, operatingProfit: 21500, eps: 455 },
      { year: '2022', revenue: 115200, netIncome: 38200, operatingProfit: 54100, eps: 1230 },
      { year: '2023', revenue: 101400, netIncome: 25400, operatingProfit: 35800, eps: 820 },
      { year: '2024', revenue: 92600, netIncome: 21800, operatingProfit: 30100, eps: 703 },
    ],
    news: [{ id: 9, title: 'Adaro Agresif Garap Smelter Aluminium Ramah Lingkungan', source: 'Bisnis.com', time: '8 jam lalu', sentiment: 'neutral', readTime: '3 min' }]
  }),
  makeStock('PTBA', 'PT Bukit Asam Tbk', 'Energi', 'energy', 'Pertambangan Batu Bara BUMN', 3020, {
    price: 3020, change: 20, changePercent: 0.67, previousClose: 3000, volume: 31200000, marketCap: 34800000000000,
    description: 'BUMN batu bara dengan cadangan melimpah di Sumatera Selatan, penyuplai utama PLTU PLN.',
    valuation: { peRatio: 6.2, pbvRatio: 1.52, evEbitda: 3.9, psRatio: 0.82 },
    profitability: { roe: 24.8, roa: 15.6, npm: 14.5, gpm: 24.8, operatingMargin: 17.2 },
    solvency: { der: 0.42, currentRatio: 1.85, quickRatio: 1.62, car: null },
    growth: { revenueGrowthYoY: -6.4, netIncomeGrowthYoY: -11.5, epsGrowth: -11.2 },
    dividend: { dividendYield: 14.2, dividendPayoutRatio: 85.0, dps: 395 },
    peers: ['ADRO', 'ITMG', 'PGAS'],
  }),
  makeStock('ITMG', 'PT Indo Tambangraya Megah Tbk', 'Energi', 'energy', 'Batu Bara (Banpu Group)', 26150, {
    peers: ['ADRO', 'PTBA', 'HRUM'],
    description: 'Produsen batu bara premium (high-CV) untuk ekspor dan domestik, anak usaha Banpu Thailand.',
  }),
  makeStock('HRUM', 'PT Harum Energy Tbk', 'Energi', 'energy', 'Batu Bara & Nikel', 900, { peers: ['ADRO', 'ITMG', 'PTBA'] }),
  makeStock('BYAN', 'PT Bayan Resources Tbk', 'Energi', 'energy', 'Batu Bara Kalimantan', 12225, { peers: ['ADRO', 'ITMG'] }),
  makeStock('DSSA', 'PT Dian Swastatika Sentosa Tbk', 'Energi', 'energy', 'Batu Bara & Energi (Sinarmas)', 1085, { peers: ['BYAN'] }),
  makeStock('GEMS', 'PT Golden Energy Mines Tbk', 'Energi', 'energy', 'Batu Bara (Sinarmas)', 7450, { peers: ['BYAN', 'DSSA'] }),
  makeStock('MBAP', 'PT Mitrabara Adiperdana Tbk', 'Energi', 'energy', 'Batu Bara Kalimantan', 5150, { peers: ['HRUM', 'GEMS'] }),
  makeStock('MEDC', 'PT Medco Energi Internasional Tbk', 'Energi', 'energy', 'Minyak, Gas & Geotermal', 1580, {
    peers: ['ELSA', 'AKRA'],
    description: 'Perusahaan energi terintegrasi: eksplorasi migas, geotermal, dan pembangkit listrik.',
  }),
  makeStock('PGAS', 'PT Perusahaan Gas Negara Tbk', 'Energi', 'energy', 'Distribusi Gas Bumi BUMN', 1490, {
    peers: ['MEDC', 'ELSA'],
    description: 'BUMN terbesar di sektor distribusi dan transmisi gas bumi di Indonesia.',
  }),
  makeStock('ELSA', 'PT Elnusa Tbk', 'Energi', 'energy', 'Jasa Migas & Geoscience', 720, { peers: ['MEDC', 'PGAS'] }),
  makeStock('AKRA', 'PT AKR Corporindo Tbk', 'Energi', 'energy', 'Distribusi BBM & Petrokimia', 1490, { peers: ['MEDC', 'PGAS', 'ELSA'] }),
  makeStock('RAJA', 'PT Rukun Raharja Tbk', 'Energi', 'energy', 'Distribusi Gas Industri', 4020, { peers: ['PGAS'] }),
  makeStock('ESSA', 'PT Surya Esa Perkasa Tbk', 'Energi', 'energy', 'LPG & Petrokimia', 640, { peers: ['AKRA'] }),
  makeStock('POWR', 'PT Cikarang Listrindo Tbk', 'Energi', 'energy', 'Pembangkit Listrik Swasta', 870, { peers: ['PGAS'] }),

  // ───────────────────────────────────────
  //  SEKTOR BARANG BAKU (BASIC MATERIALS) — TAMBANG, KIMIA, SEMEN, KERTAS
  // ───────────────────────────────────────
  makeStock('ANTM', 'PT Aneka Tambang Tbk', 'Barang Baku', 'basic_materials', 'Pertambangan Emas & Nikel', 3250, {
    price: 3250, change: 20, changePercent: 0.62, previousClose: 3230, volume: 78500000, marketCap: 78000000000000,
    description: 'BUMN pertambangan nikel, bauksit, dan logam mulia emas terkemuka (holding MIND ID).',
    valuation: { peRatio: 11.5, pbvRatio: 1.45, evEbitda: 7.2, psRatio: 0.85 },
    profitability: { roe: 13.2, roa: 8.4, npm: 7.4, gpm: 15.8, operatingMargin: 9.8 },
    solvency: { der: 0.35, currentRatio: 2.10, quickRatio: 1.42, car: null },
    growth: { revenueGrowthYoY: 16.4, netIncomeGrowthYoY: 22.1, epsGrowth: 21.8 },
    dividend: { dividendYield: 4.80, dividendPayoutRatio: 55.0, dps: 74 },
    peers: ['INCO', 'MDKA', 'TINS', 'BRMS'],
  }),
  makeStock('INCO', 'PT Vale Indonesia Tbk', 'Barang Baku', 'basic_materials', 'Pertambangan Nikel (Vale)', 4640, { peers: ['ANTM', 'MDKA', 'NCKL'] }),
  makeStock('MDKA', 'PT Merdeka Copper Gold Tbk', 'Barang Baku', 'basic_materials', 'Tembaga, Emas & Nikel', 2810, { peers: ['ANTM', 'INCO', 'BRMS'] }),
  makeStock('TINS', 'PT Timah Tbk', 'Barang Baku', 'basic_materials', 'Pertambangan Timah BUMN', 4740, { peers: ['ANTM'] }),
  makeStock('BRMS', 'PT Bumi Resources Minerals Tbk', 'Barang Baku', 'basic_materials', 'Eksplorasi Mineral', 218, { peers: ['MDKA', 'ANTM'] }),
  makeStock('NCKL', 'PT Trimegah Bangun Persada Tbk', 'Barang Baku', 'basic_materials', 'Nikel HPAL (Harita Group)', 820, { peers: ['INCO', 'ANTM', 'MBMA'] }),
  makeStock('MBMA', 'PT Merdeka Battery Materials Tbk', 'Barang Baku', 'basic_materials', 'Baterai & Nikel EV', 570, { peers: ['NCKL', 'MDKA'] }),
  makeStock('PSAB', 'PT J Resources Asia Pasifik Tbk', 'Barang Baku', 'basic_materials', 'Pertambangan Emas', 310, { peers: ['MDKA', 'BRMS'] }),
  makeStock('CPDW', 'PT Indo Komoditi Korpora Tbk', 'Barang Baku', 'basic_materials', 'Perdagangan Komoditas', 141, {}),
  // Semen
  makeStock('SMGR', 'PT Semen Indonesia (Persero) Tbk', 'Barang Baku', 'basic_materials', 'Semen BUMN (SIG)', 1585, {
    peers: ['INTP', 'SMCB'],
    description: 'Produsen semen terbesar di Asia Tenggara melalui SIG (Semen Indonesia Group) dan anak usaha Semen Padang, Semen Tonasa, Semen Gresik.',
  }),
  makeStock('INTP', 'PT Indocement Tunggal Prakarsa Tbk', 'Barang Baku', 'basic_materials', 'Semen (Heidelberg)', 4700, { peers: ['SMGR', 'SMCB'] }),
  makeStock('SMCB', 'PT Solusi Bangun Indonesia Tbk', 'Barang Baku', 'basic_materials', 'Semen (SCG Thailand)', 490, { peers: ['SMGR', 'INTP'] }),
  makeStock('WTON', 'PT Wijaya Karya Beton Tbk', 'Barang Baku', 'basic_materials', 'Beton Precast BUMN', 226, { peers: ['SMGR'] }),
  // Kimia & Petrokimia
  makeStock('TPIA', 'PT Chandra Asri Petrochemical Tbk', 'Barang Baku', 'basic_materials', 'Petrokimia (Barito Pacific)', 1835, { peers: ['BRPT'] }),
  makeStock('BRPT', 'PT Barito Pacific Tbk', 'Barang Baku', 'basic_materials', 'Holding Petrokimia & Energi Hijau', 1620, { peers: ['TPIA'] }),
  makeStock('UNIC', 'PT Unggul Indah Cahaya Tbk', 'Barang Baku', 'basic_materials', 'Surfaktan & Alkylbenzene', 5125, {}),
  // Kertas & Pulp
  makeStock('INKP', 'PT Indah Kiat Pulp & Paper Tbk', 'Barang Baku', 'basic_materials', 'Kertas & Pulp (APP Sinarmas)', 7200, { peers: ['TKIM'] }),
  makeStock('TKIM', 'PT Pabrik Kertas Tjiwi Kimia Tbk', 'Barang Baku', 'basic_materials', 'Kertas & Pulp (APP Sinarmas)', 5700, { peers: ['INKP'] }),
  // Aluminium, Baja
  makeStock('ALMI', 'PT Alumindo Light Metal Industry Tbk', 'Barang Baku', 'basic_materials', 'Aluminium', 330, {}),
  makeStock('ISSP', 'PT Steel Pipe Industry of Indonesia Tbk', 'Barang Baku', 'basic_materials', 'Pipa Baja', 340, { peers: ['KRAS'] }),
  makeStock('KRAS', 'PT Krakatau Steel (Persero) Tbk', 'Barang Baku', 'basic_materials', 'Baja BUMN', 80, { peers: ['ISSP'] }),

  // ───────────────────────────────────────
  //  SEKTOR KONSUMER PRIMER (NON-CYCLICALS) — MAKANAN, MINUMAN, ROKOK, PERAWATAN
  // ───────────────────────────────────────
  makeStock('ICBP', 'PT Indofood CBP Sukses Makmur Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Makanan Olahan (Indomie)', 6850, {
    price: 6850, change: 50, changePercent: 0.74, volume: 12400000, marketCap: 79900000000000,
    description: 'Produsen mi instan Indomie terbesar di dunia dengan pangsa pasar dominan di Indonesia dan ekspor global.',
    valuation: { peRatio: 14.2, pbvRatio: 2.8, evEbitda: 9.4, psRatio: 1.8 },
    profitability: { roe: 20.2, roa: 8.1, npm: 13.8, gpm: 36.4, operatingMargin: 20.5 },
    solvency: { der: 0.88, currentRatio: 1.95, quickRatio: 1.45, car: null },
    growth: { revenueGrowthYoY: 7.8, netIncomeGrowthYoY: 14.5, epsGrowth: 14.2 },
    dividend: { dividendYield: 3.85, dividendPayoutRatio: 52.0, dps: 440 },
    peers: ['INDF', 'MYOR', 'UNVR', 'CMRY'],
  }),
  makeStock('INDF', 'PT Indofood Sukses Makmur Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Holding Makanan & Agri', 5425, { peers: ['ICBP', 'MYOR', 'UNVR'] }),
  makeStock('UNVR', 'PT Unilever Indonesia Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'FMCG & Consumer Goods', 1625, {
    peers: ['ICBP', 'MYOR', 'HMSP'],
    description: 'Raksasa FMCG multinasional di Indonesia (Lifebuoy, Rinso, Pepsodent, Wall\'s, Bango, Sunlight).',
  }),
  makeStock('MYOR', 'PT Mayora Indah Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Makanan & Minuman (Kopiko, Energen)', 1495, { peers: ['ICBP', 'INDF', 'UNVR'] }),
  makeStock('CMRY', 'PT Cisarua Mountain Dairy Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Dairy & Processed Meat (Cimory)', 4440, { peers: ['ICBP', 'INDF'] }),
  makeStock('ULTJ', 'PT Ultra Jaya Milk Industry Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Susu & Minuman UHT', 1800, { peers: ['CMRY', 'INDF'] }),
  makeStock('CPIN', 'PT Charoen Pokphand Indonesia Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Pakan Ternak & Ayam Olahan', 3090, { peers: ['JPFA', 'MAIN'] }),
  makeStock('JPFA', 'PT Japfa Comfeed Indonesia Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Pakan Ternak & Daging Ayam', 2270, { peers: ['CPIN', 'MAIN'] }),
  makeStock('MAIN', 'PT Malindo Feedmill Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Pakan Ternak & Peternakan', 750, { peers: ['CPIN', 'JPFA'] }),
  makeStock('AALI', 'PT Astra Agro Lestari Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit (Astra)', 8500, { peers: ['LSIP', 'SSMS', 'DSNG', 'SIMP'] }),
  makeStock('LSIP', 'PT PP London Sumatra Indonesia Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit & Karet', 930, { peers: ['AALI', 'SSMS'] }),
  makeStock('SSMS', 'PT Sawit Sumbermas Sarana Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit', 1505, { peers: ['AALI', 'LSIP'] }),
  makeStock('DSNG', 'PT Dharma Satya Nusantara Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit', 520, { peers: ['AALI', 'LSIP'] }),
  makeStock('SIMP', 'PT Salim Ivomas Pratama Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Agri, Minyak Goreng (Bimoli)', 398, { peers: ['AALI', 'INDF'] }),
  // Rokok
  makeStock('HMSP', 'PT H.M. Sampoerna Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Rokok (Philip Morris)', 740, {
    peers: ['GGRM', 'WIIM'],
    description: 'Produsen rokok terbesar Indonesia (Sampoerna A, Dji Sam Soe, U Mild), anak usaha Philip Morris International.',
  }),
  makeStock('GGRM', 'PT Gudang Garam Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Rokok Kretek', 17875, { peers: ['HMSP', 'WIIM'] }),
  makeStock('WIIM', 'PT Wismilak Inti Makmur Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Rokok', 515, { peers: ['HMSP', 'GGRM'] }),
  // Perawatan
  makeStock('KINO', 'PT Kino Indonesia Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'FMCG Personal Care (Kino)', 1395, { peers: ['UNVR'] }),
  makeStock('SIDO', 'PT Industri Jamu dan Farmasi Sido Muncul Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Jamu & Herbal', 348, { peers: ['KLBF', 'TSPC'] }),
  makeStock('ADES', 'PT Akasha Wira International Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Minuman & Personal Care', 32000, { peers: ['ULTJ'] }),

  // ───────────────────────────────────────
  //  SEKTOR KONSUMER NON-PRIMER (CYCLICALS) — OTOMOTIF, RITEL, MEDIA, LIFESTYLE
  // ───────────────────────────────────────
  makeStock('ASII', 'PT Astra International Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Otomotif & Konglomerasi', 4890, {
    price: 4890, change: 0, changePercent: 0.00, volume: 38400000, marketCap: 198000000000000,
    description: 'Konglomerat terdiversifikasi terkemuka: otomotif (Toyota, Daihatsu, Honda), jasa keuangan, alat berat, agribisnis.',
    valuation: { peRatio: 6.8, pbvRatio: 0.98, evEbitda: 4.1, psRatio: 0.65 },
    profitability: { roe: 14.8, roa: 7.9, npm: 9.8, gpm: 21.4, operatingMargin: 13.8 },
    solvency: { der: 0.74, currentRatio: 1.34, quickRatio: 1.05, car: null },
    growth: { revenueGrowthYoY: 3.2, netIncomeGrowthYoY: -2.4, epsGrowth: -2.3 },
    dividend: { dividendYield: 9.20, dividendPayoutRatio: 62.0, dps: 450 },
    peers: ['UNTR', 'AUTO', 'ACES'],
  }),
  makeStock('UNTR', 'PT United Tractors Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Alat Berat & Tambang (Komatsu)', 26100, { peers: ['ASII', 'IMAS'] }),
  makeStock('AUTO', 'PT Astra Otoparts Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Komponen Otomotif', 2100, { peers: ['ASII', 'SMSM'] }),
  makeStock('SMSM', 'PT Selamat Sempurna Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Filter & Komponen Otomotif', 1735, { peers: ['AUTO'] }),
  makeStock('IMAS', 'PT Indomobil Sukses Internasional Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Distributor Otomotif', 1775, { peers: ['ASII'] }),
  makeStock('DRMA', 'PT Dharma Polimetal Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Komponen Otomotif EV', 1000, { peers: ['AUTO', 'SMSM'] }),
  // Ritel
  makeStock('ACES', 'PT Aspirasi Hidup Indonesia Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Hardware (Ace/Informa)', 352, { peers: ['LPPF', 'MAPI', 'RALS'] }),
  makeStock('LPPF', 'PT Matahari Department Store Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Fashion (Matahari)', 1320, { peers: ['ACES', 'MAPI', 'RALS'] }),
  makeStock('MAPI', 'PT Mitra Adiperkasa Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Lifestyle (Zara, Starbucks)', 1580, { peers: ['LPPF', 'RALS'] }),
  makeStock('RALS', 'PT Ramayana Lestari Sentosa Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Departemen Store', 600, { peers: ['LPPF', 'MAPI'] }),
  makeStock('AMRT', 'PT Sumber Alfaria Trijaya Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Minimarket (Alfamart)', 1300, {
    peers: ['MIDI'],
    description: 'Operator jaringan minimarket Alfamart terbesar di Indonesia dengan 20.000+ gerai.',
  }),
  makeStock('MIDI', 'PT Midi Utama Indonesia Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Minimarket (Alfamidi)', 490, { peers: ['AMRT'] }),
  makeStock('HERO', 'PT Hero Supermarket Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Supermarket (IKEA)', 1090, { peers: ['AMRT'] }),
  makeStock('RANC', 'PT Supra Boga Lestari Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel Supermarket (Ranch Market)', 396, { peers: ['AMRT'] }),
  // Media & Entertainment
  makeStock('SCMA', 'PT Surya Citra Media Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Media Televisi (SCTV, Indosiar)', 116, { peers: ['MNCN'] }),
  makeStock('MNCN', 'PT MNC Digital Entertainment Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Media (RCTI, GTV, iNews)', 330, { peers: ['SCMA'] }),
  makeStock('EMTK', 'PT Elang Mahkota Teknologi Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Media & Teknologi Holding', 440, { peers: ['SCMA', 'MNCN'] }),
  makeStock('KPIG', 'PT MNC Land Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Theme Park & Hospitality', 80, { peers: ['MNCN'] }),
  // Hotel, Restoran, Pariwisata
  makeStock('PZZA', 'PT Sarimelati Kencana Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Restoran (Pizza Hut Indonesia)', 490, { peers: ['FAST', 'MAPI'] }),
  makeStock('FAST', 'PT Fastfood Indonesia Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Restoran (KFC Indonesia)', 5500, { peers: ['PZZA'] }),
  makeStock('SHID', 'PT Hotel Sahid Jaya International Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Hotel & Hospitality', 398, {}),
  // Tekstil, Garmen
  makeStock('SRIL', 'PT Sri Rejeki Isman Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Tekstil & Garmen Ekspor', 50, {}),

  // ───────────────────────────────────────
  //  SEKTOR KESEHATAN (HEALTHCARE) — FARMASI, RUMAH SAKIT, ALKES
  // ───────────────────────────────────────
  makeStock('KLBF', 'PT Kalbe Farma Tbk', 'Kesehatan', 'healthcare', 'Farmasi & Nutrisi', 770, {
    price: 770, change: 0, changePercent: 0.00, volume: 24800000, marketCap: 36100000000000,
    description: 'Perusahaan farmasi terbesar di Asia Tenggara (Promag, Woods, Morinaga, Diabetasol).',
    valuation: { peRatio: 22.8, pbvRatio: 3.4, evEbitda: 14.8, psRatio: 2.3 },
    profitability: { roe: 15.6, roa: 11.8, npm: 10.5, gpm: 40.2, operatingMargin: 13.9 },
    solvency: { der: 0.22, currentRatio: 3.80, quickRatio: 2.45, car: null },
    growth: { revenueGrowthYoY: 8.5, netIncomeGrowthYoY: 10.2, epsGrowth: 9.8 },
    dividend: { dividendYield: 2.65, dividendPayoutRatio: 58.0, dps: 42 },
    peers: ['MIKA', 'HEAL', 'SIDO', 'TSPC'],
  }),
  makeStock('TSPC', 'PT Tempo Scan Pacific Tbk', 'Kesehatan', 'healthcare', 'Farmasi & Consumer Health', 2750, { peers: ['KLBF', 'PYFA'] }),
  makeStock('PYFA', 'PT Pyridam Farma Tbk', 'Kesehatan', 'healthcare', 'Farmasi & Alkes', 600, { peers: ['KLBF', 'TSPC'] }),
  makeStock('DVLA', 'PT Darya-Varia Laboratoria Tbk', 'Kesehatan', 'healthcare', 'Farmasi (Darya-Varia)', 1590, { peers: ['KLBF', 'TSPC'] }),
  makeStock('INAF', 'PT Indofarma (Persero) Tbk', 'Kesehatan', 'healthcare', 'Farmasi BUMN', 78, { peers: ['KAEF'] }),
  makeStock('KAEF', 'PT Kimia Farma (Persero) Tbk', 'Kesehatan', 'healthcare', 'Farmasi & Apotek BUMN', 630, { peers: ['INAF', 'KLBF'] }),
  // Rumah Sakit
  makeStock('MIKA', 'PT Mitra Keluarga Karyasehat Tbk', 'Kesehatan', 'healthcare', 'Rumah Sakit Premium (Mitra Keluarga)', 2640, { peers: ['HEAL', 'SILO'] }),
  makeStock('HEAL', 'PT Medikaloka Hermina Tbk', 'Kesehatan', 'healthcare', 'Rumah Sakit Hermina', 1350, { peers: ['MIKA', 'SILO'] }),
  makeStock('SILO', 'PT Siloam International Hospitals Tbk', 'Kesehatan', 'healthcare', 'Rumah Sakit Siloam (Lippo)', 2250, { peers: ['MIKA', 'HEAL'] }),
  makeStock('PRDA', 'PT Prodia Widyahusada Tbk', 'Kesehatan', 'healthcare', 'Laboratorium Klinik', 4250, { peers: ['MIKA'] }),

  // ───────────────────────────────────────
  //  SEKTOR TEKNOLOGI (TECHNOLOGY) — DIGITAL, E-COMMERCE, FINTECH, IT SERVICES
  // ───────────────────────────────────────
  makeStock('GOTO', 'PT GoTo Gojek Tokopedia Tbk', 'Teknologi', 'technology', 'Ekosistem Digital & E-Commerce', 50, {
    price: 50, change: 0, changePercent: 0.00, volume: 1240000000, marketCap: 60000000000000,
    description: 'Ekosistem digital terbesar Indonesia: Gojek (on-demand), Tokopedia (e-commerce), GoTo Financial (fintech/GoPay).',
    valuation: { peRatio: -18.2, pbvRatio: 0.88, evEbitda: -12.4, psRatio: 5.6 },
    profitability: { roe: -5.2, roa: -3.8, npm: -18.5, gpm: 58.4, operatingMargin: -12.4 },
    solvency: { der: 0.15, currentRatio: 2.80, quickRatio: 2.70, car: null },
    growth: { revenueGrowthYoY: 28.5, netIncomeGrowthYoY: 42.0, epsGrowth: 41.5 },
    dividend: { dividendYield: 0, dividendPayoutRatio: 0, dps: 0 },
    peers: ['BUKA', 'EMTK', 'WIRG'],
    news: [
      { id: 10, title: 'GoTo Capai Adjusted EBITDA Positif, GoPay & On-Demand Melonjak', source: 'Tech in Asia', time: '1 jam lalu', sentiment: 'bullish', readTime: '3 min' },
      { id: 11, title: 'Volume Saham GOTO Teraktif di BEI Hari Ini', source: 'Kontan', time: '3 jam lalu', sentiment: 'bullish', readTime: '2 min' },
    ]
  }),
  makeStock('BUKA', 'PT Bukalapak.com Tbk', 'Teknologi', 'technology', 'E-Commerce & Mitra Warung', 120, { peers: ['GOTO'] }),
  makeStock('WIRG', 'PT WIRG Tbk', 'Teknologi', 'technology', 'On-Demand & Fintech', 100, { peers: ['GOTO', 'BUKA'] }),
  makeStock('MTDL', 'PT Metrodata Electronics Tbk', 'Teknologi', 'technology', 'Distribusi IT & Solusi Cloud', 530, { peers: ['DCII'] }),
  makeStock('DCII', 'PT DCI Indonesia Tbk', 'Teknologi', 'technology', 'Data Center (DCI)', 201100, {
    peers: ['MTDL'],
    description: 'Operator data center tier-III dan tier-IV terbesar di Indonesia, melayani hyperscaler global.',
  }),
  makeStock('BELI', 'PT Blibli Tbk', 'Teknologi', 'technology', 'E-Commerce (Blibli, Tiket.com)', 350, { peers: ['GOTO', 'BUKA'] }),
  makeStock('EDGE', 'PT Indosat Tbk', 'Teknologi', 'technology', 'Data Center & Cloud', 1480, { peers: ['DCII'] }),
  makeStock('CASH', 'PT Cashlez Worldwide Indonesia Tbk', 'Teknologi', 'technology', 'Fintech Payment Gateway', 272, { peers: ['GOTO'] }),
  makeStock('DMMX', 'PT Digital Mediatama Maxima Tbk', 'Teknologi', 'technology', 'Distribusi Konten Digital', 240, {}),
  makeStock('LUCK', 'PT Sentral Mitra Informatika Tbk', 'Teknologi', 'technology', 'IT Solutions & Managed Services', 196, {}),

  // ───────────────────────────────────────
  //  SEKTOR INFRASTRUKTUR — TELEKOMUNIKASI, TOWER, JALAN TOL, BANDARA
  // ───────────────────────────────────────
  makeStock('TLKM', 'PT Telkom Indonesia (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Telekomunikasi BUMN', 3730, {
    price: 3730, change: 77, changePercent: 2.10, volume: 72100000, marketCap: 369000000000000,
    description: 'BUMN telekomunikasi terbesar (Telkomsel, IndiHome, NeutraDC data center) dengan pelanggan seluler terbesar.',
    valuation: { peRatio: 12.1, pbvRatio: 2.1, evEbitda: 4.8, psRatio: 1.9 },
    profitability: { roe: 17.5, roa: 8.4, npm: 16.4, gpm: 67.2, operatingMargin: 27.9 },
    solvency: { der: 0.82, currentRatio: 0.95, quickRatio: 0.88, car: null },
    growth: { revenueGrowthYoY: 4.8, netIncomeGrowthYoY: 5.2, epsGrowth: 5.1 },
    dividend: { dividendYield: 6.05, dividendPayoutRatio: 72.0, dps: 180 },
    peers: ['ISAT', 'EXCL', 'TOWR'],
  }),
  makeStock('ISAT', 'PT Indosat Ooredoo Hutchison Tbk', 'Infrastruktur', 'infrastructure', 'Telekomunikasi (Ooredoo)', 2390, { peers: ['TLKM', 'EXCL'] }),
  makeStock('EXCL', 'PT XL Axiata Tbk', 'Infrastruktur', 'infrastructure', 'Telekomunikasi (Axiata)', 2550, { peers: ['TLKM', 'ISAT'] }),
  makeStock('FREN', 'PT Smartfren Telecom Tbk', 'Infrastruktur', 'infrastructure', 'Telekomunikasi (Sinarmas)', 23, { peers: ['TLKM', 'EXCL'] }),
  // Tower & Fiber
  makeStock('TOWR', 'PT Sarana Menara Nusantara Tbk', 'Infrastruktur', 'infrastructure', 'Menara Telekomunikasi', 444, {
    peers: ['TBIG', 'MTEL'],
    description: 'Operator menara telekomunikasi terbesar (Mitratel) dengan 40.000+ menara di seluruh Indonesia.',
  }),
  makeStock('TBIG', 'PT Tower Bersama Infrastructure Tbk', 'Infrastruktur', 'infrastructure', 'Menara Telekomunikasi', 1455, { peers: ['TOWR', 'MTEL'] }),
  makeStock('MTEL', 'PT Dayamitra Telekomunikasi Tbk', 'Infrastruktur', 'infrastructure', 'Menara Telko (Mitratel)', 492, { peers: ['TOWR', 'TBIG'] }),
  makeStock('LINK', 'PT Link Net Tbk', 'Infrastruktur', 'infrastructure', 'Internet Broadband (First Media)', 2300, { peers: ['TLKM'] }),
  // Jalan Tol & Infrastruktur
  makeStock('JSMR', 'PT Jasa Marga (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Jalan Tol BUMN', 2870, {
    peers: ['META', 'CMNP'],
    description: 'Operator jalan tol terbesar di Indonesia (BUMN) mengelola ribuan km jaringan tol di Jawa, Sumatera, dan Bali.',
  }),
  makeStock('META', 'PT Nusantara Infrastructure Tbk', 'Infrastruktur', 'infrastructure', 'Jalan Tol & Air Bersih', 265, { peers: ['JSMR'] }),
  makeStock('CMNP', 'PT Citra Marga Nusaphala Persada Tbk', 'Infrastruktur', 'infrastructure', 'Jalan Tol Jakarta', 1470, { peers: ['JSMR'] }),
  makeStock('WIKA', 'PT Wijaya Karya (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi & EPC BUMN', 204, { peers: ['PTPP', 'ADHI', 'WSKT'] }),
  makeStock('PTPP', 'PT PP (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi BUMN', 422, { peers: ['WIKA', 'ADHI'] }),
  makeStock('ADHI', 'PT Adhi Karya (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi & LRT BUMN', 248, { peers: ['WIKA', 'PTPP'] }),
  makeStock('WSKT', 'PT Waskita Karya (Persero) Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi & Tol BUMN', 168, { peers: ['WIKA', 'PTPP'] }),
  makeStock('NRCA', 'PT Nusa Raya Cipta Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi Swasta', 258, { peers: ['WIKA'] }),
  makeStock('TOTL', 'PT Total Bangun Persada Tbk', 'Infrastruktur', 'infrastructure', 'Konstruksi Gedung', 290, { peers: ['NRCA'] }),

  // ───────────────────────────────────────
  //  SEKTOR PROPERTI & REAL ESTATE
  // ───────────────────────────────────────
  makeStock('BSDE', 'PT Bumi Serpong Damai Tbk', 'Properti', 'properties', 'Township (BSD City, Sinarmas Land)', 565, {
    peers: ['CTRA', 'SMRA', 'PWON'],
    description: 'Developer township terbesar (BSD City, Grand Wisata, Kota Wisata) oleh Sinarmas Land.',
  }),
  makeStock('CTRA', 'PT Ciputra Development Tbk', 'Properti', 'properties', 'Township (CitraRaya, CitraGarden)', 605, { peers: ['BSDE', 'SMRA', 'PWON'] }),
  makeStock('SMRA', 'PT Summarecon Agung Tbk', 'Properti', 'properties', 'Township (Summarecon Serpong, Bekasi)', 296, { peers: ['BSDE', 'CTRA'] }),
  makeStock('PWON', 'PT Pakuwon Jati Tbk', 'Properti', 'properties', 'Mixed-Use & Mall (Pakuwon Mall)', 272, { peers: ['BSDE', 'CTRA'] }),
  makeStock('LPKR', 'PT Lippo Karawaci Tbk', 'Properti', 'properties', 'Township (Lippo Village)', 95, { peers: ['BSDE', 'CTRA'] }),
  makeStock('DILD', 'PT Intiland Development Tbk', 'Properti', 'properties', 'Mixed-Use & Apartemen', 148, { peers: ['BSDE'] }),
  makeStock('APLN', 'PT Agung Podomoro Land Tbk', 'Properti', 'properties', 'Apartemen & Mall (Podomoro City)', 118, { peers: ['CTRA', 'BSDE'] }),
  makeStock('PPRO', 'PT PP Properti Tbk', 'Properti', 'properties', 'Properti BUMN (Apartemen)', 51, { peers: ['APLN'] }),
  makeStock('MKPI', 'PT Metropolitan Kentjana Tbk', 'Properti', 'properties', 'Mall (Pondok Indah Mall)', 14000, { peers: ['PWON'] }),
  makeStock('PLIN', 'PT Plaza Indonesia Realty Tbk', 'Properti', 'properties', 'Mall & Hotel (Plaza Indonesia)', 2680, { peers: ['MKPI'] }),
  makeStock('SSIA', 'PT Surya Semesta Internusa Tbk', 'Properti', 'properties', 'Industrial Estate (Subang)', 780, { peers: ['KIJA'] }),
  makeStock('KIJA', 'PT Kawasan Industri Jababeka Tbk', 'Properti', 'properties', 'Kawasan Industri (Cikarang)', 118, { peers: ['SSIA'] }),
  makeStock('DMAS', 'PT Puradelta Lestari Tbk', 'Properti', 'properties', 'Industrial Estate (Deltamas)', 144, { peers: ['SSIA', 'KIJA'] }),
  makeStock('BEST', 'PT Bekasi Fajar Industrial Estate Tbk', 'Properti', 'properties', 'Kawasan Industri Bekasi', 138, { peers: ['KIJA', 'DMAS'] }),

  // ───────────────────────────────────────
  //  SEKTOR PERINDUSTRIAN (INDUSTRIALS) — MANUFAKTUR, KIMIA, ELEKTRONIK
  // ───────────────────────────────────────
  makeStock('ASII', 'PT Astra International Tbk', 'Perindustrian', 'industrials', 'Konglomerasi Industri', 4890, {}).ticker === 'skip' ? null :
  makeStock('IMPC', 'PT Impack Pratama Industri Tbk', 'Perindustrian', 'industrials', 'Plastik & Building Materials', 695, {}),
  makeStock('IPOL', 'PT Indopoly Swakarsa Industry Tbk', 'Perindustrian', 'industrials', 'Film Plastik & Packaging', 99, {}),
  makeStock('IGAR', 'PT Champion Pacific Indonesia Tbk', 'Perindustrian', 'industrials', 'Kemasan Plastik Fleksibel', 362, {}),
  makeStock('ARNA', 'PT Arwana Citramulia Tbk', 'Perindustrian', 'industrials', 'Keramik & Tile', 580, { peers: ['MLIA', 'TOTO'] }),
  makeStock('TOTO', 'PT Surya Toto Indonesia Tbk', 'Perindustrian', 'industrials', 'Sanitaryware & Fitting', 290, { peers: ['ARNA'] }),
  makeStock('MARK', 'PT Mark Dynamics Indonesia Tbk', 'Perindustrian', 'industrials', 'Cetakan Sarung Tangan (Glove)', 700, {}),
  makeStock('MLIA', 'PT Mulia Industrindo Tbk', 'Perindustrian', 'industrials', 'Kaca & Kontainer', 390, {}),
  makeStock('ADMG', 'PT Polychem Indonesia Tbk', 'Perindustrian', 'industrials', 'Polyester & Kimia', 118, {}),
  makeStock('DPNS', 'PT Duta Pertiwi Nusantara Tbk', 'Perindustrian', 'industrials', 'Adhesive & Kimia Industri', 400, {}),
  makeStock('SMBR', 'PT Semen Baturaja (Persero) Tbk', 'Perindustrian', 'industrials', 'Semen BUMN Regional', 188, { peers: ['SMGR'] }),
  makeStock('LION', 'PT Lion Metal Works Tbk', 'Perindustrian', 'industrials', 'Metal Works & Peralatan Kantor', 780, {}),
  makeStock('SCCO', 'PT Supreme Cable Manufacturing Tbk', 'Perindustrian', 'industrials', 'Kabel & Kawat Listrik', 3430, { peers: ['KBLI', 'JECC'] }),
  makeStock('KBLI', 'PT KMI Wire and Cable Tbk', 'Perindustrian', 'industrials', 'Kabel Listrik & Fiber Optik', 315, { peers: ['SCCO'] }),
  makeStock('JECC', 'PT Jembo Cable Company Tbk', 'Perindustrian', 'industrials', 'Kabel Listrik', 5000, { peers: ['SCCO', 'KBLI'] }),
  makeStock('PBRX', 'PT Pan Brothers Tbk', 'Perindustrian', 'industrials', 'Garmen Ekspor', 36, {}),

  // ───────────────────────────────────────
  //  SEKTOR TRANSPORTASI & LOGISTIK
  // ───────────────────────────────────────
  makeStock('GIAA', 'PT Garuda Indonesia (Persero) Tbk', 'Transportasi', 'transportation', 'Maskapai Penerbangan BUMN', 68, {
    peers: ['CMPP'],
    description: 'Maskapai penerbangan nasional full-service (flag carrier) Indonesia.',
  }),
  makeStock('CMPP', 'PT AirAsia Indonesia Tbk', 'Transportasi', 'transportation', 'Maskapai Low Cost Carrier', 66, { peers: ['GIAA'] }),
  makeStock('BIRD', 'PT Blue Bird Tbk', 'Transportasi', 'transportation', 'Taksi & Transportasi Darat', 1345, {
    description: 'Operator taksi dan transportasi darat premium terbesar di Indonesia (Blue Bird, Silver Bird).',
  }),
  makeStock('ASSA', 'PT Adi Sarana Armada Tbk', 'Transportasi', 'transportation', 'Logistik & Rental Kendaraan', 760, { peers: ['BIRD'] }),
  makeStock('TMAS', 'PT Pelayaran Tempuran Emas Tbk', 'Transportasi', 'transportation', 'Pelayaran Kontainer', 192, { peers: ['SMDR', 'HAIS'] }),
  makeStock('SMDR', 'PT Samudera Indonesia Tbk', 'Transportasi', 'transportation', 'Pelayaran & Logistik', 220, { peers: ['TMAS'] }),
  makeStock('HAIS', 'PT Haloni Jane Tbk', 'Transportasi', 'transportation', 'Pelayaran', 131, { peers: ['TMAS'] }),
  makeStock('JSMR', 'PT Jasa Marga (Persero) Tbk', 'Transportasi', 'transportation', 'Jalan Tol BUMN', 2870, {}).ticker === 'skip' ? null :
  makeStock('BPTR', 'PT Batavia Prosperindo Trans Tbk', 'Transportasi', 'transportation', 'Sewa Alat Berat & Logistik', 980, {}),
  makeStock('SAPX', 'PT Satria Antaran Prima Tbk', 'Transportasi', 'transportation', 'Kurir Ekspres (SAP Express)', 85, {}),
  makeStock('WEHA', 'PT WEHA Transportasi Indonesia Tbk', 'Transportasi', 'transportation', 'Bus Pariwisata & Airport Transfer', 200, {}),

  // ───────────────────────────────────────
  //  TAMBAHAN: EMITEN POPULER & SAHAM SPESIAL LAINNYA
  // ───────────────────────────────────────
  // Multi-sektor populer
  makeStock('BUMI', 'PT Bumi Resources Tbk', 'Energi', 'energy', 'Batu Bara & Sumber Daya Alam', 96, {}),
  makeStock('ENRG', 'PT Energi Mega Persada Tbk', 'Energi', 'energy', 'Minyak & Gas', 158, {}),
  makeStock('DOID', 'PT Delta Dunia Makmur Tbk', 'Energi', 'energy', 'Kontraktor Tambang (BUMA)', 346, { peers: ['UNTR'] }),
  makeStock('MYOH', 'PT Samindo Resources Tbk', 'Energi', 'energy', 'Kontraktor Tambang', 930, { peers: ['DOID'] }),
  makeStock('MDKA', 'PT Merdeka Copper Gold Tbk', 'Barang Baku', 'basic_materials', 'Tembaga & Emas', 2450, {}).ticker === 'skip' ? null :
  makeStock('PGEO', 'PT Pertamina Geothermal Energy Tbk', 'Energi', 'energy', 'Geotermal (Pertamina)', 1025, {}),
  makeStock('AMMN', 'PT Amman Mineral Internasional Tbk', 'Barang Baku', 'basic_materials', 'Tembaga & Emas Batu Hijau NTB', 5050, {
    description: 'Produsen tembaga dan emas skala besar dari tambang Batu Hijau, Nusa Tenggara Barat.',
    peers: ['MDKA', 'ANTM'],
  }),
  makeStock('CUAN', 'PT Petrindo Jaya Kreasi Tbk', 'Energi', 'energy', 'Batu Bara (Prajogo Pangestu)', 920, {}),
  // Utilitas & Listrik
  makeStock('PJAA', 'PT Pembangunan Jaya Ancol Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Theme Park (Ancol)', 390, {}),
  makeStock('BMTR', 'PT Global Mediacom Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Media Holding (MNC Group)', 202, { peers: ['MNCN'] }),
  makeStock('ERAA', 'PT Erajaya Swasembada Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Distributor HP & Gadget', 310, {}),
  makeStock('MLPL', 'PT Multipolar Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Ritel & IT (Matahari, Hypermart)', 203, {}),
  makeStock('GJTL', 'PT Gajah Tunggal Tbk', 'Perindustrian', 'industrials', 'Ban (GT Radial)', 1340, {}),
  makeStock('ASRI', 'PT Alam Sutera Realty Tbk', 'Properti', 'properties', 'Township Alam Sutera', 170, { peers: ['BSDE', 'CTRA'] }),
  makeStock('TAPG', 'PT Triputra Agro Persada Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit (Triputra)', 770, { peers: ['AALI', 'LSIP'] }),
  makeStock('BNLI', 'PT Bank Permata Tbk', 'Keuangan', 'financials', 'Perbankan (Bangkok Bank)', 1295, { peers: ['BNGA', 'NISP'] }),
  makeStock('AGII', 'PT Aneka Gas Industri Tbk', 'Perindustrian', 'industrials', 'Gas Industri', 1045, {}),
  makeStock('BMHS', 'PT Bundamedik Tbk', 'Kesehatan', 'healthcare', 'Rumah Sakit Bunda', 3700, { peers: ['MIKA', 'HEAL'] }),
  makeStock('CLEO', 'PT Sariguna Primatirta Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Air Minum Dalam Kemasan (Cleo)', 840, {}),
  makeStock('ERAL', 'PT Eratel Prima Tbk', 'Infrastruktur', 'infrastructure', 'Infrastruktur Telko & Tower', 396, { peers: ['TOWR'] }),
  makeStock('JARR', 'PT Jaro Interkultur Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'HORECA & Distribusi Makanan', 1200, {}),
  makeStock('JSKY', 'PT Sky Energy Indonesia Tbk', 'Energi', 'energy', 'Gas Alam Cair (LNG)', 1810, {}),
  makeStock('KEEN', 'PT Kencana Energi Lestari Tbk', 'Energi', 'energy', 'PLTU & Energi', 840, {}),
  makeStock('MSIN', 'PT MNC Digital Entertainment Tbk', 'Konsumer Non-Primer', 'consumer_cyclical', 'Digital Content & Streaming', 265, {}),
  makeStock('PAMG', 'PT Bima Palma Nugraha Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Perkebunan Sawit', 770, { peers: ['AALI'] }),
  makeStock('STRK', 'PT Solusi Tunas Pratama Tbk', 'Infrastruktur', 'infrastructure', 'Menara Telekomunikasi Fiber', 1245, { peers: ['TOWR', 'TBIG'] }),
  makeStock('TPIA', 'PT Chandra Asri Pacific Tbk', 'Barang Baku', 'basic_materials', 'Petrokimia', 1835, {}).ticker === 'skip' ? null :
  makeStock('UNIQ', 'PT Ulima Nitra Tbk', 'Konsumer Primer', 'consumer_non_cyclical', 'Pakan Ikan & Akuakultur', 415, {}),
  makeStock('CBDK', 'PT Cahayaputra Asa Keramik Tbk', 'Perindustrian', 'industrials', 'Keramik & Tile', 240, { peers: ['ARNA'] }),
];


// ═══════════════════════════════════════════════════════════════════════════
// GENERATOR DATA CANDLESTICK HISTORIS
// ═══════════════════════════════════════════════════════════════════════════

export function generateCandlestickHistory(basePrice, days = 180, volatility = 0.018) {
  const data = [];
  const now = new Date();

  let currentPrice = basePrice * 0.82;
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  let seed = Math.round(basePrice);
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const changePct = (pseudoRandom() - 0.485) * volatility * 2;
    const open = Math.round(currentPrice);
    const close = Math.round(open * (1 + changePct));
    const highVariation = Math.abs(pseudoRandom() * volatility * 1.2);
    const lowVariation = Math.abs(pseudoRandom() * volatility * 1.2);
    const high = Math.max(open, close, Math.round(Math.max(open, close) * (1 + highVariation)));
    const low = Math.min(open, close, Math.round(Math.min(open, close) * (1 - lowVariation)));

    const baseVol = Math.round(basePrice > 5000 ? 25000000 : 75000000);
    const volume = Math.round(baseVol * (0.6 + pseudoRandom() * 1.2));

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const timeStr = `${yyyy}-${mm}-${dd}`;

    data.push({ time: timeStr, open, high, low, close, volume });

    currentPrice = close;
  }

  if (data.length > 0) {
    const last = data[data.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return data;
}
