'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function PoliceTasksPage() {
  const dummyTasks = [
    {
      id: 'TSK-001',
      title: 'Control crowd near Gate 3',
      location: 'Sector 7G',
      status: 'In Progress',
      priority: 'HIGH',
      time: '14 mins ago'
    },
    {
      id: 'TSK-002',
      title: 'Investigate reported anomaly',
      location: 'North Concourse',
      status: 'Pending',
      priority: 'MEDIUM',
      time: '32 mins ago'
    },
    {
      id: 'TSK-003',
      title: 'Routine patrol completed',
      location: 'East Wing',
      status: 'Completed',
      priority: 'LOW',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#09090b] min-h-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Active Tasks</h1>
        <p className="text-zinc-400 mb-8">Manage your assigned objectives and patrol routes.</p>

        <div className="flex flex-col gap-4">
          {dummyTasks.map((task, idx) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#121827] border border-[#1a253a] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : task.priority === 'HIGH' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold">{task.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-zinc-400 font-medium">{task.id}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-blue-400 font-medium">{task.location}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">{task.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                  task.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                  'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {task.priority}
                </div>
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                  task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 
                  'bg-zinc-800 text-zinc-300'
                }`}>
                  {task.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
