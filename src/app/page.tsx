"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Lightbulb,
  Info,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import {
  kpiData,
  lineData,
  materialOEEData,
  opportunitiesData,
  halResponses,
} from "@/lib/sample-data";

type TabType = "dashboard" | "opportunities" | "ask-hal";

// HAL 9000 Eye Component
function HALEye({ size = 40 }: { size?: number }) {
  return (
    <div className="relative hal-eye-glow rounded-full" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)",
          border: "2px solid #333",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "10%",
          left: "10%",
          right: "10%",
          bottom: "10%",
          background: "linear-gradient(145deg, #330000 0%, #1a0000 100%)",
          border: "1px solid #660000",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "20%",
          left: "20%",
          right: "20%",
          bottom: "20%",
          background:
            "radial-gradient(circle at 30% 30%, #FF6666 0%, #FF0000 30%, #990000 70%, #330000 100%)",
        }}
      />
      <div
        className="absolute rounded-full bg-white/30"
        style={{
          top: "25%",
          left: "25%",
          width: "20%",
          height: "20%",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

// KPI Card Component
function KPICard({
  label,
  value,
  unit,
  target,
  change,
  description,
  index,
}: {
  label: string;
  value: number;
  unit: string;
  target: number;
  change: number;
  description: string;
  index: number;
}) {
  const progress = Math.min((value / target) * 100, 100);
  const isPositive = label === "Scrap" || label === "Downtime" ? change < 0 : change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="kpi-card rounded-xl p-5"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-white">{label}</h3>
          <p className="text-xs text-[#666]">{description}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isPositive ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
          }`}
        >
          {change > 0 ? "+" : ""}
          {change}
        </span>
      </div>
      <div className="mb-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-[#666] ml-1">{unit}</span>
        <span className="text-[#666] text-sm ml-2">
          / {target}
          {unit} target
        </span>
      </div>
      <div className="h-2 bg-[#111] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
          className="h-full rounded-full bg-red-600"
        />
      </div>
    </motion.div>
  );
}

// Technical Insights Modal
function InsightsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="kpi-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white">Technical Insights</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4 text-sm text-[#666]">
            <div className="p-4 bg-[#111] rounded-lg border border-[#333]">
              <h3 className="text-white font-medium mb-2">OEE Calculation Method</h3>
              <p>
                OEE = Availability × Performance × Quality. Uses strict calculate_strict_oee()
                function with outlier filtering, resource exclusions, 5% floor, and 100% cap.
              </p>
            </div>
            <div className="p-4 bg-[#111] rounded-lg border border-[#333]">
              <h3 className="text-white font-medium mb-2">Data Sources</h3>
              <p>
                Real-time data from SAP ME, Wonderware Historian, and MES systems. Aggregated at
                15-minute intervals with 24-hour rolling analysis.
              </p>
            </div>
            <div className="p-4 bg-[#111] rounded-lg border border-[#333]">
              <h3 className="text-white font-medium mb-2">AI Model</h3>
              <p>
                HAL 9000 analysis powered by ensemble ML models trained on 3 years of historical
                production data. Pattern recognition for anomaly detection and root cause analysis.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PlantPerfectPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showInsights, setShowInsights] = useState(false);
  const [halQuery, setHalQuery] = useState("");
  const [halResponse, setHalResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleAskHAL = () => {
    if (!halQuery.trim()) return;
    setIsThinking(true);
    setHalResponse("");

    // Simulate HAL thinking
    setTimeout(() => {
      const randomResponse = halResponses[Math.floor(Math.random() * halResponses.length)];
      setHalResponse(randomResponse);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Scanlines overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-30" />

      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 text-[#666] hover:text-white bg-[#1a1a1a]/50 hover:bg-[#1a1a1a] border border-gray-700 rounded-lg transition-all group text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <HALEye size={40} />
              <div>
                <h1 className="text-xl font-bold text-white tracking-wider">CC Plant Perfect</h1>
                <p className="text-xs text-[#666]">
                  HAL 9000 | Manufacturing Intelligence | Plant 1090
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="text-[#666]">Status</p>
                <p className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Fully Operational
                </p>
              </div>
              <button
                onClick={() => setShowInsights(true)}
                className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm hover:border-red-600 hover:text-red-500 transition-all"
              >
                Technical Insights
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800 bg-[#111]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "KPI Dashboard" },
              { id: "opportunities", label: "Biggest Opportunities" },
              { id: "ask-hal", label: "Ask HAL" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 sm:px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-red-600 text-white bg-[#1a1a1a]/30"
                    : "border-transparent text-[#666] hover:text-white hover:bg-[#1a1a1a]/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, index) => (
                  <KPICard
                    key={kpi.name}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    target={kpi.target}
                    change={kpi.change}
                    description={
                      kpi.name === "oee"
                        ? "Overall Equipment Effectiveness"
                        : kpi.name === "dle"
                        ? "Direct Labor Efficiency"
                        : kpi.name === "scrap"
                        ? "Material Usage Variance"
                        : "Unplanned Downtime"
                    }
                    index={index}
                  />
                ))}
              </div>

              {/* Line Performance Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="kpi-card rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Line Performance Overview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-[#666] text-sm font-medium">
                          Resource
                        </th>
                        <th className="text-left py-3 px-4 text-[#666] text-sm font-medium">OEE</th>
                        <th className="text-left py-3 px-4 text-[#666] text-sm font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-[#666] text-sm font-medium">
                          Gap to Target
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineData.map((line, index) => (
                        <motion.tr
                          key={line.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="border-b border-gray-800/50 hover:bg-[#1a1a1a]/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-white font-medium">{line.name}</td>
                          <td className="py-3 px-4">
                            <span className="text-white">{line.oee}%</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                                line.status === "on-track"
                                  ? "bg-green-900/30 text-green-400"
                                  : line.status === "monitor"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  line.status === "on-track"
                                    ? "bg-green-400"
                                    : line.status === "monitor"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                              />
                              {line.status === "on-track"
                                ? "On Track"
                                : line.status === "monitor"
                                ? "Monitor"
                                : "Action Needed"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#666]">{line.gapToTarget} pts</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* OEE Pareto Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="kpi-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Top 10 OEE by Material</h3>
                    <p className="text-sm text-[#666]">
                      Pareto analysis showing highest performing materials
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded" />
                      <span className="text-[#666]">OEE %</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-green-400" />
                      <span className="text-[#666]">Cumulative</span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={materialOEEData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="material"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#333" }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#333" }}
                        domain={[0, 100]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#333" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar yAxisId="left" dataKey="oee" fill="#dc2626" radius={[4, 4, 0, 0]} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={{ fill: "#4ade80", r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-[#111]/50 rounded-lg border border-gray-800">
                  <p className="text-sm text-[#666] flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    <span>
                      This OEE calculation followed all GPT-defined logic and exclusions (strict
                      calculate_strict_oee() function, outlier &amp; resource filters, 5% floor, 100%
                      cap).
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "opportunities" && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white mb-6">Biggest Opportunities</h2>
              {opportunitiesData.map((opp, index) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="kpi-card rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {opp.priority === "high" ? (
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{opp.issue}</h3>
                        <p className="text-sm text-[#666]">{opp.line}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        opp.priority === "high"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {opp.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-[#111] rounded-lg">
                      <p className="text-xs text-[#666] mb-1">Financial Impact</p>
                      <p className="text-lg font-bold text-white">{opp.impact}</p>
                    </div>
                    <div className="p-3 bg-[#111] rounded-lg">
                      <p className="text-xs text-[#666] mb-1">Potential OEE Gain</p>
                      <p className="text-lg font-bold text-green-400">+{opp.potentialOEEGain}%</p>
                    </div>
                    <div className="p-3 bg-[#111] rounded-lg">
                      <p className="text-xs text-[#666] mb-1">HAL Confidence</p>
                      <p className="text-lg font-bold text-white">
                        {(85 + Math.random() * 10).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#111]/50 rounded-lg border border-gray-800">
                    <p className="text-xs text-[#666] mb-1">HAL Recommendation</p>
                    <p className="text-sm text-white">{opp.recommendation}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "ask-hal" && (
            <motion.div
              key="ask-hal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <HALEye size={80} />
                <h2 className="text-2xl font-bold text-white mt-4">Ask HAL 9000</h2>
                <p className="text-[#666] mt-2">
                  Query the manufacturing intelligence system
                </p>
              </div>

              <div className="kpi-card rounded-xl p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={halQuery}
                    onChange={(e) => setHalQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskHAL()}
                    placeholder="Ask about OEE, line performance, or optimization opportunities..."
                    className="flex-1 bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-red-600 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleAskHAL}
                    disabled={isThinking}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Ask
                  </button>
                </div>

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-[#111] rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                      <p className="text-[#666]">HAL is analyzing your query...</p>
                    </div>
                  </motion.div>
                )}

                {halResponse && !isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-[#111] rounded-lg border border-red-900/50"
                  >
                    <div className="flex items-start gap-3">
                      <HALEye size={24} />
                      <p className="text-white italic">&quot;{halResponse}&quot;</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-xs text-[#666] mb-3">Suggested queries:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Why is Line 32 underperforming?",
                      "What's driving scrap rate?",
                      "How can we improve OEE?",
                      "Top 3 improvement priorities",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setHalQuery(suggestion)}
                        className="px-3 py-1.5 text-xs text-[#666] hover:text-white bg-[#1a1a1a] hover:bg-[#222] border border-gray-700 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6 text-center text-[#666] text-sm">
        <p>&quot;I am fully operational, Dave, and these numbers are too.&quot;</p>
        <p className="mt-2 text-xs">Chris Cosmetics | Plant Perfect Demo | Not for production use</p>
      </footer>

      {/* Insights Modal */}
      <InsightsModal isOpen={showInsights} onClose={() => setShowInsights(false)} />
    </main>
  );
}
