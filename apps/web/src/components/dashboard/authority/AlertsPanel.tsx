'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/stores/map-store';
import { MagicCard } from '@/components/ui/magic-card';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AlertsPanel() {
  const activeRecommendations = useMapStore((state) => state.activeRecommendations);

  if (activeRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-24 right-4 md:right-6 z-[1000] w-[calc(100vw-32px)] md:w-80 space-y-4 pointer-events-none">
      <AnimatePresence>
        {activeRecommendations.map((rec) => (
          <motion.div
            key={rec.recommendation_id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto"
          >
            <MagicCard 
              className="bg-black/80 backdrop-blur-md border border-red-500/30 overflow-hidden shadow-2xl"
              gradientColor="rgba(239, 68, 68, 0.1)"
            >
              <div className="p-4 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
                
                <div className="flex items-center gap-2 mb-3 mt-1">
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-white font-semibold text-sm tracking-wide uppercase">AI Recommendation</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-red-500/10 rounded-md p-3 border border-red-500/20">
                    <p className="text-white text-sm font-medium">{rec.explanation.primary_reason}</p>
                    <p className="text-red-300 text-xs mt-1">Zone: {rec.zone_id} | Risk: {rec.risk_score}</p>
                    
                    {/* Phase 6.6 Explainability UI Details */}
                    <div className="mt-2 pt-2 border-t border-red-500/20 space-y-1">
                      <p className="text-gray-400 text-[10px] font-semibold uppercase">Supporting Factors</p>
                      <ul className="list-disc pl-4 text-xs text-red-200/80">
                        {rec.explanation.supporting_factors?.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center mt-2 text-[10px] font-semibold text-gray-400">
                        <span>Source Agreement: {(rec.explanation.source_agreement * 100).toFixed(0)}%</span>
                        <span>AI Confidence: {(rec.explanation.prediction_confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Proposed Actions</p>
                    <ul className="space-y-1">
                      {rec.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-200">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full font-semibold shadow-lg shadow-red-500/20"
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:8000/api/v1/interventions/${rec.recommendation_id}/approve`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                          });
                          if (!res.ok) throw new Error('Failed to approve plan');
                          import('sonner').then(({ toast }) => toast.success('Plan Approved: Units Deployed & Interventions Activated'));
                          useMapStore.getState().removeRecommendation(rec.recommendation_id);
                        } catch (err) {
                          import('sonner').then(({ toast }) => toast.error('Error approving plan. Check connection.'));
                        }
                      }}
                    >
                      <ShieldAlert className="w-4 h-4 mr-2" />
                      Approve Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                      onClick={() => useMapStore.getState().removeRecommendation(rec.recommendation_id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </MagicCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
