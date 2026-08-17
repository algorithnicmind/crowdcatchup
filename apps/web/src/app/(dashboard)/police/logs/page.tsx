import React from 'react';
import { History, FileText } from 'lucide-react';

export default function PoliceLogsPage() {
  const dummyLogs = [
    { id: 'LOG-8892', type: 'Crowd Dispersal', time: '10:45 AM', location: 'Gate 3', status: 'Resolved' },
    { id: 'LOG-8891', type: 'Medical Emergency', time: '09:12 AM', location: 'Sector 4', status: 'Transferred' },
    { id: 'LOG-8890', type: 'Suspicious Package', time: '08:30 AM', location: 'North Concourse', status: 'Cleared' },
    { id: 'LOG-8889', type: 'Routine Patrol', time: '07:00 AM', location: 'All Sectors', status: 'Completed' },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#09090b] min-h-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <History className="w-6 h-6 text-[#00E5FF]" />
          Incident Logs
        </h1>
        <p className="text-zinc-400 mb-8">Historical record of all incidents and actions taken during your shift.</p>

        <div className="bg-[#121827] border border-[#1a253a] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A111E] border-b border-[#1a253a]">
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Log ID</th>
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Time</th>
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Incident Type</th>
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</th>
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a253a]">
              {dummyLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-sm text-zinc-300 font-mono">{log.id}</td>
                  <td className="py-4 px-6 text-sm text-zinc-400">{log.time}</td>
                  <td className="py-4 px-6 text-sm font-medium text-white">{log.type}</td>
                  <td className="py-4 px-6 text-sm text-blue-400">{log.location}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.status === 'Resolved' || log.status === 'Completed' || log.status === 'Cleared' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[#00E5FF] hover:text-white p-2 rounded hover:bg-[#00E5FF]/10 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
