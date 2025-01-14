import { smallNumberHandler } from "./numberPrecision";
import { IndexCalculatorOutput, KPIs } from "../types/indexCalculator";

const FILTERED: Array<keyof KPIs> = [
  'STDEV',
  'VARIANCE',
  'totalContribution',
  'marginalContribution',
  'originalRATIO',
  'relativeToLeftoverRATIO',
  'adjustedRATIO',
  'CAPPED',
  'ADJUSTED',
  'adjustedMarketCAP',
  'addedRatio'
];

const formatter =  new Intl.NumberFormat(
  'en-us', {
    style: 'currency',
    currency: 'USD'
  }
);


export const getKpis = (data: IndexCalculatorOutput[]): KPIs[] => data.map(item => {
  /**
   * Removes the nested objects from the data set and returns only the KPIs
   * after adjusting the precision as needed.
   */
  let kpis = {} as KPIs;
  const row: KPIs = {
    name: item.name,
    coingeckoId: item.coingeckoId,
    MIN_MCAP: item.MIN_MCAP,
    MAX_MCAP: item.MAX_MCAP,
    AVG_MCAP: item.AVG_MCAP,
    initialAmounts: item.initialAmounts,
    tokenBalance: item.tokenBalance,
    lastPrice: item.lastPrice,
    RATIO: item.RATIO,
    leftover: item.leftover ?? 0,
    MCTR: item.MCTR
  }

  if (item.sentimentScore) {
    kpis = {
      ...row,
      sentimentRATIO: item.sentimentRATIO ?? 0,
      sentimentScore: item.sentimentScore ?? 0,
    }
  } else {
    kpis = row;
  }
  return adjustKPIPrecision(kpis)
});

// Human readable adjustment for large and small numbers
export const adjustKPIPrecision = (kpis: KPIs): KPIs => Object
  .entries(kpis)
  .filter(([key, _]) => !FILTERED.includes(key as keyof KPIs))
  .reduce((prev, [key, value]) => {
    let newValue = value;
    if (key === 'lastPrice') {
      newValue = formatter.format(value);
    } else if (typeof value === 'number') {
      newValue = smallNumberHandler(value);
    } else if (Number(value)) {
      newValue = smallNumberHandler(Number(value))
    }
    return { ...prev, [key]: newValue }
  }, {} as KPIs
);
