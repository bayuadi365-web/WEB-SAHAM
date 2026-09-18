// Kalkulator Indikator Teknikal Kuantitatif Saham
// Menghitung SMA, EMA, MACD, RSI, Bollinger Bands, Stochastic, ATR, OBV, VWAP, Fibonacci, dan Sinyal Otomatis

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data, period = 20) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push({ time: data[i].time, value: NaN });
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({ time: data[i].time, value: +(sum / period).toFixed(2) });
  }
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data, period = 9) {
  const result = [];
  const k = 2 / (period + 1);
  let prevEma = null;

  for (let i = 0; i < data.length; i++) {
    const close = data[i].close;
    if (i < period - 1) {
      result.push({ time: data[i].time, value: NaN });
      continue;
    }
    if (prevEma === null) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      prevEma = sum / period;
    } else {
      prevEma = close * k + prevEma * (1 - k);
    }
    result.push({ time: data[i].time, value: +prevEma.toFixed(2) });
  }
  return result;
}

/**
 * Bollinger Bands (Upper, Middle SMA, Lower)
 */
export function calculateBollingerBands(data, period = 20, multiplier = 2) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push({ time: data[i].time, value: NaN });
      middle.push({ time: data[i].time, value: NaN });
      lower.push({ time: data[i].time, value: NaN });
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const mean = sum / period;

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(data[i - j].close - mean, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    upper.push({ time: data[i].time, value: +(mean + multiplier * stdDev).toFixed(2) });
    middle.push({ time: data[i].time, value: +mean.toFixed(2) });
    lower.push({ time: data[i].time, value: +(mean - multiplier * stdDev).toFixed(2) });
  }

  return { upper, middle, lower };
}

/**
 * Relative Strength Index (RSI) - Wilder's Smoothing
 */
export function calculateRSI(data, period = 14) {
  const result = [];
  if (data.length < period + 1) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push({ time: data[i].time, value: NaN });
      continue;
    }
    if (i > period) {
      const diff = data[i].close - data[i - 1].close;
      const currentGain = diff > 0 ? diff : 0;
      const currentLoss = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    }

    if (avgLoss === 0) {
      result.push({ time: data[i].time, value: 100 });
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push({ time: data[i].time, value: +rsi.toFixed(2) });
    }
  }

  return result;
}

/**
 * MACD (Moving Average Convergence Divergence)
 * Returns { macdLine, signalLine, histogram }
 */
export function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEma = calculateEMA(data, fastPeriod);
  const slowEma = calculateEMA(data, slowPeriod);

  const macdLine = [];
  for (let i = 0; i < data.length; i++) {
    const fVal = fastEma[i]?.value;
    const sVal = slowEma[i]?.value;
    if (isNaN(fVal) || isNaN(sVal)) {
      macdLine.push({ time: data[i].time, value: NaN });
    } else {
      macdLine.push({ time: data[i].time, value: +(fVal - sVal).toFixed(2) });
    }
  }

  // Signal line is EMA of MACD line
  const signalLine = [];
  const k = 2 / (signalPeriod + 1);
  let prevSignal = null;
  let validMacdCount = 0;

  for (let i = 0; i < macdLine.length; i++) {
    const val = macdLine[i].value;
    if (isNaN(val)) {
      signalLine.push({ time: macdLine[i].time, value: NaN });
      continue;
    }
    validMacdCount++;
    if (validMacdCount < signalPeriod) {
      signalLine.push({ time: macdLine[i].time, value: NaN });
      continue;
    }
    if (prevSignal === null) {
      let sum = 0;
      for (let j = 0; j < signalPeriod; j++) {
        sum += macdLine[i - j].value;
      }
      prevSignal = sum / signalPeriod;
    } else {
      prevSignal = val * k + prevSignal * (1 - k);
    }
    signalLine.push({ time: macdLine[i].time, value: +prevSignal.toFixed(2) });
  }

  const histogram = [];
  for (let i = 0; i < data.length; i++) {
    const m = macdLine[i]?.value;
    const s = signalLine[i]?.value;
    if (isNaN(m) || isNaN(s)) {
      histogram.push({ time: data[i].time, value: NaN, color: '#64748b' });
    } else {
      const histVal = +(m - s).toFixed(2);
      histogram.push({
        time: data[i].time,
        value: histVal,
        color: histVal >= 0 ? '#10b981' : '#f43f5e',
      });
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Stochastic Oscillator (%K, %D)
 */
export function calculateStochastic(data, periodK = 14, smoothK = 3, periodD = 3) {
  const rawK = [];
  for (let i = 0; i < data.length; i++) {
    if (i < periodK - 1) {
      rawK.push({ time: data[i].time, value: NaN });
      continue;
    }
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    for (let j = 0; j < periodK; j++) {
      highestHigh = Math.max(highestHigh, data[i - j].high);
      lowestLow = Math.min(lowestLow, data[i - j].low);
    }
    const currentClose = data[i].close;
    const k = highestHigh === lowestLow ? 50 : ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    rawK.push({ time: data[i].time, value: k });
  }

  // Smooth %K
  const smoothedK = [];
  for (let i = 0; i < rawK.length; i++) {
    if (i < periodK + smoothK - 2) {
      smoothedK.push({ time: rawK[i].time, value: NaN });
      continue;
    }
    let sum = 0;
    for (let j = 0; j < smoothK; j++) {
      sum += rawK[i - j].value;
    }
    smoothedK.push({ time: rawK[i].time, value: +(sum / smoothK).toFixed(2) });
  }

  // %D is SMA of smoothed %K
  const lineD = [];
  for (let i = 0; i < smoothedK.length; i++) {
    if (isNaN(smoothedK[i].value) || i < periodK + smoothK + periodD - 3) {
      lineD.push({ time: smoothedK[i].time, value: NaN });
      continue;
    }
    let sum = 0;
    for (let j = 0; j < periodD; j++) {
      sum += smoothedK[i - j].value;
    }
    lineD.push({ time: smoothedK[i].time, value: +(sum / periodD).toFixed(2) });
  }

  return { lineK: smoothedK, lineD };
}

/**
 * VWAP (Volume Weighted Average Price)
 */
export function calculateVWAP(data) {
  let cumulativeTypicalVolume = 0;
  let cumulativeVolume = 0;
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const typicalPrice = (item.high + item.low + item.close) / 3;
    const vol = item.volume || 1;
    cumulativeTypicalVolume += typicalPrice * vol;
    cumulativeVolume += vol;

    const vwap = cumulativeTypicalVolume / cumulativeVolume;
    result.push({ time: item.time, value: +vwap.toFixed(2) });
  }
  return result;
}

/**
 * On-Balance Volume (OBV)
 */
export function calculateOBV(data) {
  const result = [];
  let currentOBV = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      currentOBV = data[i].volume || 0;
    } else {
      if (data[i].close > data[i - 1].close) {
        currentOBV += data[i].volume || 0;
      } else if (data[i].close < data[i - 1].close) {
        currentOBV -= data[i].volume || 0;
      }
    }
    result.push({ time: data[i].time, value: currentOBV });
  }
  return result;
}

/**
 * Fibonacci Retracement Levels
 */
export function calculateFibonacciRetracement(data, lookback = 90) {
  if (!data || data.length === 0) return null;
  const slice = data.slice(-lookback);
  let maxHigh = -Infinity;
  let minLow = Infinity;

  slice.forEach(d => {
    if (d.high > maxHigh) maxHigh = d.high;
    if (d.low < minLow) minLow = d.low;
  });

  const diff = maxHigh - minLow;

  return {
    high: maxHigh,
    low: minLow,
    levels: [
      { label: '0.0% (Peak)', level: 0.0, price: Math.round(maxHigh), color: '#ef4444' },
      { label: '23.6%', level: 0.236, price: Math.round(maxHigh - diff * 0.236), color: '#f97316' },
      { label: '38.2%', level: 0.382, price: Math.round(maxHigh - diff * 0.382), color: '#eab308' },
      { label: '50.0% (Mid)', level: 0.50, price: Math.round(maxHigh - diff * 0.50), color: '#3b82f6' },
      { label: '61.8% (Golden)', level: 0.618, price: Math.round(maxHigh - diff * 0.618), color: '#10b981' },
      { label: '78.6%', level: 0.786, price: Math.round(maxHigh - diff * 0.786), color: '#8b5cf6' },
      { label: '100.0% (Base)', level: 1.0, price: Math.round(minLow), color: '#06b6d4' },
    ]
  };
}

/**
 * Pivot Points (Classic, Camarilla, Woodie)
 */
export function calculatePivotPoints(lastCandle) {
  if (!lastCandle) return null;
  const { high: H, low: L, close: C } = lastCandle;

  // Classic Standard Pivot Point
  const P = (H + L + C) / 3;
  const R1 = 2 * P - L;
  const S1 = 2 * P - H;
  const R2 = P + (H - L);
  const S2 = P - (H - L);
  const R3 = H + 2 * (P - L);
  const S3 = L - 2 * (H - P);

  // Camarilla Pivot
  const camRange = H - L;
  const camR4 = C + camRange * 1.1 / 2;
  const camR3 = C + camRange * 1.1 / 4;
  const camS3 = C - camRange * 1.1 / 4;
  const camS4 = C - camRange * 1.1 / 2;

  return {
    classic: {
      P: Math.round(P),
      R1: Math.round(R1),
      S1: Math.round(S1),
      R2: Math.round(R2),
      S2: Math.round(S2),
      R3: Math.round(R3),
      S3: Math.round(S3),
    },
    camarilla: {
      R4: Math.round(camR4),
      R3: Math.round(camR3),
      S3: Math.round(camS3),
      S4: Math.round(camS4),
    }
  };
}

/**
 * Automated Trading Signal Detector
 */
export function detectTechnicalSignals(data) {
  if (!data || data.length < 50) return [];

  const signals = [];
  const lastIndex = data.length - 1;
  const currentPrice = data[lastIndex].close;

  // 1. Moving Average Crosses (SMA 50 vs SMA 200 or SMA 20 vs SMA 50)
  const sma20 = calculateSMA(data, 20);
  const sma50 = calculateSMA(data, 50);
  const sma200 = calculateSMA(data, 200);

  const currSma20 = sma20[lastIndex]?.value;
  const prevSma20 = sma20[lastIndex - 1]?.value;
  const currSma50 = sma50[lastIndex]?.value;
  const prevSma50 = sma50[lastIndex - 1]?.value;
  const currSma200 = sma200[lastIndex]?.value;

  if (currSma50 && currSma200) {
    if (currSma50 > currSma200 && prevSma50 <= currSma200) {
      signals.push({
        type: 'bullish',
        name: 'Golden Cross (MA50/200)',
        message: 'MA 50 menembus ke atas MA 200 — konfirmasi tren penguatan jangka panjang (Super Bullish).',
        level: 'Kuat',
      });
    } else if (currSma50 < currSma200 && prevSma50 >= currSma200) {
      signals.push({
        type: 'bearish',
        name: 'Death Cross (MA50/200)',
        message: 'MA 50 menembus ke bawah MA 200 — sinyal pelemahan tren jangka panjang.',
        level: 'Kuat',
      });
    }
  }

  if (currSma20 && currSma50) {
    if (currSma20 > currSma50 && prevSma20 <= currSma50) {
      signals.push({
        type: 'bullish',
        name: 'MA Bullish Crossover (20/50)',
        message: 'MA 20 menembus ke atas MA 50 — momentum tren jangka pendek menguat.',
        level: 'Sedang',
      });
    }
  }

  // 2. RSI Signals
  const rsiData = calculateRSI(data, 14);
  const currentRSI = rsiData[lastIndex]?.value;

  if (!isNaN(currentRSI)) {
    if (currentRSI <= 30) {
      signals.push({
        type: 'bullish',
        name: `RSI Oversold (${currentRSI})`,
        message: 'RSI di bawah level 30 menandakan tekanan jual jenuh — potensi teknikal rebound tinggi.',
        level: 'Tinggi',
      });
    } else if (currentRSI >= 70) {
      signals.push({
        type: 'bearish',
        name: `RSI Overbought (${currentRSI})`,
        message: 'RSI di atas level 70 menandakan kondisi jenuh beli — waspadai aksi profit taking.',
        level: 'Tinggi',
      });
    } else if (currentRSI >= 50 && rsiData[lastIndex - 1]?.value < 50) {
      signals.push({
        type: 'bullish',
        name: 'RSI Bullish Shift (Cross 50)',
        message: 'RSI menembus ke atas batas netral 50 — penguatan momentum buyer.',
        level: 'Moderat',
      });
    }
  }

  // 3. MACD Signals
  const macd = calculateMACD(data);
  const currHist = macd.histogram[lastIndex]?.value;
  const prevHist = macd.histogram[lastIndex - 1]?.value;
  const currMacd = macd.macdLine[lastIndex]?.value;
  const currSignal = macd.signalLine[lastIndex]?.value;

  if (!isNaN(currHist) && !isNaN(prevHist)) {
    if (currHist > 0 && prevHist <= 0) {
      signals.push({
        type: 'bullish',
        name: 'MACD Bullish Crossover',
        message: 'Garis MACD memotong ke atas Signal Line — sinyal akumulasi beli aktif.',
        level: 'Tinggi',
      });
    } else if (currHist < 0 && prevHist >= 0) {
      signals.push({
        type: 'bearish',
        name: 'MACD Bearish Crossover',
        message: 'Garis MACD memotong ke bawah Signal Line — momentum distribusi seller.',
        level: 'Tinggi',
      });
    }
  }

  // 4. Bollinger Bands Squeeze & Breakout
  const bb = calculateBollingerBands(data, 20, 2);
  const currUpper = bb.upper[lastIndex]?.value;
  const currLower = bb.lower[lastIndex]?.value;
  const currMiddle = bb.middle[lastIndex]?.value;

  if (currUpper && currLower) {
    if (currentPrice > currUpper) {
      signals.push({
        type: 'bullish',
        name: 'Bollinger Band Upper Breakout',
        message: 'Harga berhasil menembus Upper Band dengan volatilitas tinggi.',
        level: 'Moderat',
      });
    } else if (currentPrice < currLower) {
      signals.push({
        type: 'bearish',
        name: 'Bollinger Band Lower Breakout',
        message: 'Harga menembus Lower Band — potensi diskon harga tajam.',
        level: 'Moderat',
      });
    }
  }

  // 5. Volume Spike Detection
  let sumVol = 0;
  const volPeriod = 20;
  for (let i = 1; i <= volPeriod; i++) {
    sumVol += data[lastIndex - i]?.volume || 0;
  }
  const avgVol = sumVol / volPeriod;
  const currentVol = data[lastIndex]?.volume || 0;

  if (currentVol > avgVol * 1.8 && avgVol > 0) {
    signals.push({
      type: currentPrice >= data[lastIndex].open ? 'bullish' : 'bearish',
      name: 'Volume Spike (>1.8x Avg)',
      message: `Lonjakan volume signifikan ${(currentVol / avgVol).toFixed(1)}x dari rata-rata 20 hari terakhir.`,
      level: 'Tinggi',
    });
  }

  return signals;
}
