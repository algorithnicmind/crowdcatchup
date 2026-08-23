'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/stores/map-store';
import { MagicCard } from '@/components/ui/magic-card';
import { Navigation, CheckCircle2, ShieldAlert, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function TaskCard() {
  const activeTasks = useMapStore((state) => state.activeTasks);
  const removeTask = useMapStore((state) => state.removeTask);

  const handleNavigate = async (taskId: string) => {
    try {
      await apiClient(`police/tasks/${taskId}/accept`, { method: 'POST' });
      toast.success('Task Accepted', { description: 'Navigation route plotted.' });
    } catch (e) {
      toast.error('Failed to accept task');
    }
  };

  const handleArrived = async (taskId: string) => {
    try {
      await apiClient(`police/tasks/${taskId}/resolve`, { method: 'POST' });
      removeTask(taskId);
      toast.success('Task Resolved', { description: 'Situation reported as handled.' });
    } catch (e) {
      toast.error('Failed to resolve task');
      // Fallback local remove
      removeTask(taskId);
    }
  };

  if (activeTasks.length === 0) {
    return null;
  }

  // Mobile apps usually show one priority task at a time
  const currentTask = activeTasks[0];

  return (
    <div className="absolute top-20 right-4 w-96 max-w-[calc(100vw-2rem)] z-[1000] pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={currentTask.task_id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="pointer-events-auto"
        >
          <MagicCard 
            className="bg-black/90 backdrop-blur-xl border border-orange-500/40 shadow-2xl overflow-hidden"
            gradientColor="rgba(249, 115, 22, 0.15)"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-amber-500 animate-pulse" />
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-orange-500 animate-pulse" />
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-wide">PRIORITY ALERT</h2>
                    <p className="text-orange-400 text-xs font-semibold">Zone: {currentTask.zone_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-orange-500/20 px-2 py-1 rounded text-orange-300 text-xs font-bold border border-orange-500/30">
                    {currentTask.distance}m AWAY
                  </div>
                  <button 
                    onClick={() => removeTask(currentTask.task_id)}
                    className="text-gray-400 hover:text-white transition-colors ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-4">
                <p className="text-gray-300 text-sm font-medium leading-relaxed">
                  {currentTask.instructions}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 font-semibold bg-black/50 p-2 rounded border border-white/5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Required: {currentTask.required_officers} officers
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold h-12"
                  onClick={() => handleNavigate(currentTask.task_id)}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  NAVIGATE TO ZONE
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-semibold h-12"
                  onClick={() => handleArrived(currentTask.task_id)}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  MARK ARRIVED
                </Button>
              </div>
            </div>
          </MagicCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
