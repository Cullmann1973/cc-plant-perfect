export interface KPIData {
  name: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  change: number;
  trend: "up" | "down";
}

export interface LineData {
  id: string;
  name: string;
  oee: number;
  status: "on-track" | "monitor" | "action-needed";
  gapToTarget: number;
}

export interface MaterialOEE {
  material: string;
  oee: number;
  cumulative: number;
}

export const kpiData: KPIData[] = [
  {
    name: "oee",
    label: "OEE",
    value: 42.3,
    unit: "%",
    target: 46,
    change: 1.2,
    trend: "up",
  },
  {
    name: "dle",
    label: "DLE",
    value: 98,
    unit: "%",
    target: 105,
    change: 0.1,
    trend: "up",
  },
  {
    name: "scrap",
    label: "Scrap",
    value: 2.8,
    unit: "%",
    target: 2,
    change: -0.3,
    trend: "down",
  },
  {
    name: "downtime",
    label: "Downtime",
    value: 8.5,
    unit: "%",
    target: 5,
    change: -1.1,
    trend: "down",
  },
];

export const lineData: LineData[] = [
  { id: "28", name: "Line 28", oee: 52.1, status: "on-track", gapToTarget: -6.1 },
  { id: "31", name: "Line 31", oee: 45.3, status: "monitor", gapToTarget: 0.7 },
  { id: "32", name: "Line 32", oee: 38.7, status: "action-needed", gapToTarget: 7.3 },
  { id: "35", name: "Line 35", oee: 41.2, status: "monitor", gapToTarget: 4.8 },
  { id: "42", name: "Line 42", oee: 48.9, status: "on-track", gapToTarget: -2.9 },
];

export const materialOEEData: MaterialOEE[] = [
  { material: "SKU-1001", oee: 68.5, cumulative: 12.4 },
  { material: "SKU-2045", oee: 62.3, cumulative: 23.6 },
  { material: "SKU-3089", oee: 58.7, cumulative: 34.2 },
  { material: "SKU-4012", oee: 55.2, cumulative: 44.1 },
  { material: "SKU-5067", oee: 52.8, cumulative: 53.7 },
  { material: "SKU-6034", oee: 49.4, cumulative: 62.6 },
  { material: "SKU-7091", oee: 46.1, cumulative: 71.0 },
  { material: "SKU-8023", oee: 43.7, cumulative: 78.9 },
  { material: "SKU-9056", oee: 40.2, cumulative: 86.2 },
  { material: "SKU-0078", oee: 37.8, cumulative: 93.0 },
];

export const opportunitiesData = [
  {
    id: 1,
    line: "Line 32",
    issue: "High Changeover Time",
    impact: "$45K/month",
    recommendation: "Implement SMED methodology, target 15-minute changeover",
    priority: "high",
    potentialOEEGain: 4.2,
  },
  {
    id: 2,
    line: "Line 35",
    issue: "Frequent Minor Stops",
    impact: "$32K/month",
    recommendation: "Review sensor calibration and operator training",
    priority: "high",
    potentialOEEGain: 3.1,
  },
  {
    id: 3,
    line: "Line 31",
    issue: "Speed Loss on SKU-2045",
    impact: "$28K/month",
    recommendation: "Investigate filling head adjustment for viscosity variation",
    priority: "medium",
    potentialOEEGain: 2.8,
  },
  {
    id: 4,
    line: "Line 28",
    issue: "Quality Defects - Labeling",
    impact: "$18K/month",
    recommendation: "Calibrate vision system, check label adhesive temperature",
    priority: "medium",
    potentialOEEGain: 1.9,
  },
];

export const halResponses = [
  "I'm sorry, Dave. I'm afraid I can't optimize that process without more data.",
  "Good morning. I have analyzed 47,392 production cycles and found 3 opportunities for improvement.",
  "The probability of achieving target OEE is 73.2% if we implement the recommended changes.",
  "I've calculated that Line 32's changeover time exceeds the gold standard by 8.3 minutes.",
  "My analysis indicates a strong correlation between ambient humidity and label adhesion failures.",
];
