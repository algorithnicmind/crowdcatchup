'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useMapStore } from '@/stores/map-store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PoliceTasksPage() {
  const activeTasks = useMapStore((state) => state.activeTasks);
  const removeTask = useMapStore((state) => state.removeTask);

  const handleAcknowledge = (taskId: string) => {
    toast.success(`Task ${taskId} acknowledged.`);
    // In a real system, we'd emit an API call here.
  };

  const handleResolve = (taskId: string) => {
    toast.success(`Task ${taskId} resolved and closed.`);
    removeTask(taskId);
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#09090b] min-h-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Active Tasks</h1>
        <p className="text-zinc-400 mb-8">Manage your assigned objectives and patrol routes.</p>

        {activeTasks.length === 0 ? (
          <div className="bg-[#121827]/50 border border-[#1a253a] rounded-xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-4" />
            <h3 className="text-zinc-300 font-bold mb-1 uppercase tracking-widest">No Active Tasks</h3>
            <p className="text-zinc-500 text-sm">You are currently unassigned. Continue normal patrol.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeTasks.map((task, idx) => (
              <motion.div 
                key={task.task_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#121827] border border-[#1a253a] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {task.risk_level === 'CRITICAL' ? (
                      <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                    ) : task.risk_level === 'HIGH' ? (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{task.instructions}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-zinc-400 font-medium">{task.task_id}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-blue-400 font-medium">{task.zone_id}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">{task.distance}m away</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    task.risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                    task.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {task.risk_level} PRIORITY
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAcknowledge(task.task_id)} className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-xs h-7">
                      Ack
                    </Button>
                    <Button size="sm" onClick={() => handleResolve(task.task_id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7">
                      Resolve
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
