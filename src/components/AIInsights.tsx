import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIInsight } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface AIInsightsProps {
  insights: AIInsight[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-5 h-5" />;
      case 'buy': return <TrendingUp className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'buy': return 'bg-green-50 border-green-200 text-green-700';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'sell': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-electric-500" />
        <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl p-4 border-2 ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getInsightIcon(insight.type)}
                <span className="font-semibold text-sm">{insight.asset}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}%
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(insight.timestamp, { addSuffix: true, locale: id })}
                </div>
              </div>
            </div>
            
            <h4 className="font-semibold mb-1">{insight.title}</h4>
            <p className="text-sm opacity-80">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
