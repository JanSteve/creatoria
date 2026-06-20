import React from 'react';

export default function StatsCard({ title, value, icon: Icon, description, trend }) {
  return (
    <div className="relative bg-darkSurface border border-slate-800 p-6 rounded-2xl overflow-hidden shadow-lg flex items-center justify-between">
      {/* Light gradient highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        {description && (
          <p className="text-xs text-slate-400">
            {trend && <span className="text-emerald-400 font-semibold">{trend} </span>}
            {description}
          </p>
        )}
      </div>

      {Icon && (
        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
