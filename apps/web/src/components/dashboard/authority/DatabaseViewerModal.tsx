'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Table as TableIcon, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

interface DatabaseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DatabaseViewerModal({ isOpen, onClose }: DatabaseViewerModalProps) {
  const { token } = useAuthStore();
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tables when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchTables();
    }
  }, [isOpen, token]);

  // Fetch data when a table is selected
  useEffect(() => {
    if (selectedTable && token) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable, token]);

  const fetchTables = async () => {
    setLoadingTables(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/database/tables`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch tables');
      const data = await res.json();
      setTables(data);
      if (data.length > 0) {
        setSelectedTable(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching tables');
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setLoadingData(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/database/tables/${tableName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch data for ${tableName}`);
      const data = await res.json();
      setTableData(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching table data');
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full h-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Database Viewer</h2>
                <p className="text-xs text-zinc-400">Live PostgreSQL Database (Neon DB)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (Tables List) */}
            <div className="w-64 border-r border-zinc-800 bg-zinc-900/30 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="p-4 border-b border-zinc-800/50">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tables</h3>
              </div>
              
              <div className="p-2 flex-1">
                {loadingTables ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {tables.map(table => (
                      <button
                        key={table}
                        onClick={() => setSelectedTable(table)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedTable === table
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
                        }`}
                      >
                        <TableIcon className="w-4 h-4" />
                        <span className="truncate">{table}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content (Table Data) */}
            <div className="flex-1 bg-black overflow-hidden flex flex-col relative">
              {error && (
                <div className="absolute inset-x-0 top-0 p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {loadingData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                  <p>Loading table data...</p>
                </div>
              ) : !selectedTable ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                  Select a table to view its data
                </div>
              ) : (
                <div className="flex-1 overflow-auto custom-scrollbar p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-mono text-zinc-200">
                      SELECT * FROM <span className="text-emerald-400">{selectedTable}</span> LIMIT 100
                    </h3>
                  </div>

                  {tableData.length === 0 ? (
                    <div className="text-zinc-500 text-sm border border-zinc-800 rounded-lg p-8 text-center bg-zinc-900/20">
                      This table is empty.
                    </div>
                  ) : (
                    <div className="border border-zinc-800 rounded-lg overflow-x-auto bg-zinc-900/30">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
                          <tr>
                            {Object.keys(tableData[0]).map(key => (
                              <th key={key} className="px-4 py-3 font-medium truncate max-w-[200px]">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {tableData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                              {Object.values(row).map((val: any, colIdx) => (
                                <td key={colIdx} className="px-4 py-3 font-mono text-zinc-300 truncate max-w-[300px]">
                                  {val === null ? <span className="text-zinc-600 italic">null</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
