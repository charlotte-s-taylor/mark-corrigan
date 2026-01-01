import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [experiments, setExperiments] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/experiments`);
      const data = await response.json();
      setExperiments(data);
      
      // Select first experiment by default
      const firstKey = Object.keys(data)[0];
      setSelectedExperiment(firstKey);
    } catch (error) {
      console.error('Error fetching experiments:', error);
    }
  };

  const analyzeExperiment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_id: selectedExperiment })
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing experiment:', error);
    }
    setLoading(false);
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_id: selectedExperiment })
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    setLoading(false);
  };

  const prepareChartData = () => {
    if (!experiments || !selectedExperiment) return [];
    
    const exp = experiments[selectedExperiment];
    const metrics = exp.metrics;
    
    return metrics.map(metric => ({
      metric: formatMetricName(metric),
      Experiment: exp.experiment_group[metric],
      Control: exp.control_group[metric]
    }));
  };

  const formatMetricName = (metric) => {
    return metric
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const calculateImprovement = (expValue, controlValue, metricName) => {
    // For metrics where lower is better
    const lowerIsBetter = ['resolution_time', 'cost_per_interaction', 'escalation_rate', 
                           'false_positive_rate', 'processing_time', 'manual_review_needed'];
    
    const improvement = ((expValue - controlValue) / controlValue) * 100;
    const isLower = lowerIsBetter.includes(metricName);
    
    if (isLower) {
      return -improvement; // Flip the sign for "lower is better" metrics
    }
    return improvement;
  };

  if (!experiments) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const currentExp = experiments[selectedExperiment];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mark Corrigan</h1>
          <p className="text-slate-400">AI Experimentation & Monitoring Dashboard</p>
        </div>

        {/* Experiment Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Experiment</label>
          <select
            value={selectedExperiment}
            onChange={(e) => {
              setSelectedExperiment(e.target.value);
              setAnalysis(null);
              setRecommendations(null);
            }}
            className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(experiments).map(([key, exp]) => (
              <option key={key} value={key}>{exp.name}</option>
            ))}
          </select>
        </div>

        {/* Experiment Overview */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2">{currentExp.name}</h2>
          <p className="text-slate-300 mb-4">{currentExp.description}</p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-400">Start Date:</span>
              <span className="ml-2 font-medium">{currentExp.start_date}</span>
            </div>
            <div>
              <span className="text-slate-400">Sample Size:</span>
              <span className="ml-2 font-medium">
                {currentExp.experiment_group.size.toLocaleString()} per cohort
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Bar dataKey="Experiment" fill="#3b82f6" />
              <Bar dataKey="Control" fill="#64748b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Table */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Detailed Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-right py-3 px-4">Experiment</th>
                  <th className="text-right py-3 px-4">Control</th>
                  <th className="text-right py-3 px-4">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {currentExp.metrics.map((metric) => {
                  const expValue = currentExp.experiment_group[metric];
                  const controlValue = currentExp.control_group[metric];
                  const improvement = calculateImprovement(expValue, controlValue, metric);
                  
                  return (
                    <tr key={metric} className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">{formatMetricName(metric)}</td>
                      <td className="py-3 px-4 text-right font-medium">{expValue}</td>
                      <td className="py-3 px-4 text-right">{controlValue}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${
                        improvement > 0 ? 'text-green-400' : improvement < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={analyzeExperiment}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </button>
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </div>

        {/* AI Analysis */}
        {analysis && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🤖</span> AI Analysis
            </h3>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-slate-200 font-sans">{analysis}</pre>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">💡</span> Next Experiment Recommendations
            </h3>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-slate-200 font-sans">{recommendations}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
