import React, { useState } from 'react';
import { simulateScenario } from '../utils/calculator';
import { Sparkles, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';

interface SimulatorCardProps {
  present: number;
  total: number;
  target: number;
  onApplyScenario?: (present: number, total: number) => void;
}

export const SimulatorCard: React.FC<SimulatorCardProps> = ({
  present,
  total,
  target,
  onApplyScenario,
}) => {
  const [attendCount, setAttendCount] = useState<number>(1);
  const [missCount, setMissCount] = useState<number>(1);

  if (total <= 0 || present > total) {
    return null;
  }

  const attendScenario = simulateScenario(present, total, 'attend', attendCount);
  const missScenario = simulateScenario(present, total, 'miss', missCount);

  return (
    <div
      id="attendance-simulator"
      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Interactive &quot;What-If&quot; Simulator
            </h4>
            <p className="text-xs text-slate-500">
              Preview the exact impact of upcoming classes before deciding
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attend Scenario */}
        <div className="rounded-xl p-4 bg-emerald-50/50 border border-emerald-100/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> If you attend next
            </span>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              <button
                type="button"
                id="decrease-attend-sim"
                onClick={() => setAttendCount(Math.max(1, attendCount - 1))}
                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-900 px-1">
                {attendCount} {attendCount === 1 ? 'class' : 'classes'}
              </span>
              <button
                type="button"
                id="increase-attend-sim"
                onClick={() => setAttendCount(attendCount + 1)}
                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-emerald-700">
                {attendScenario.newPercentage}%
              </span>
              <span className="text-xs text-emerald-700 font-semibold ml-1.5">
                (+{attendScenario.difference > 0 ? attendScenario.difference : 0}%)
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {attendScenario.newPresent}/{attendScenario.newTotal} attended
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                attendScenario.newPercentage >= target
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {attendScenario.newPercentage >= target
                ? `✓ Still Safe (≥${target}%)`
                : `✗ Still Short (<${target}%)`}
            </span>
            {onApplyScenario && (
              <button
                type="button"
                id="apply-attend-sim"
                onClick={() => onApplyScenario(attendScenario.newPresent, attendScenario.newTotal)}
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                Apply to inputs →
              </button>
            )}
          </div>
        </div>

        {/* Miss Scenario */}
        <div className="rounded-xl p-4 bg-rose-50/50 border border-rose-100/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" /> If you bunk / miss next
            </span>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-rose-200 shadow-2xs">
              <button
                type="button"
                id="decrease-miss-sim"
                onClick={() => setMissCount(Math.max(1, missCount - 1))}
                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-900 px-1">
                {missCount} {missCount === 1 ? 'class' : 'classes'}
              </span>
              <button
                type="button"
                id="increase-miss-sim"
                onClick={() => setMissCount(missCount + 1)}
                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-rose-700">
                {missScenario.newPercentage}%
              </span>
              <span className="text-xs text-rose-700 font-semibold ml-1.5">
                ({missScenario.difference}%)
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {missScenario.newPresent}/{missScenario.newTotal} attended
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                missScenario.newPercentage >= target
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {missScenario.newPercentage >= target
                ? `✓ Still Safe (≥${target}%)`
                : `⚠️ Drops below ${target}%!`}
            </span>
            {onApplyScenario && (
              <button
                type="button"
                id="apply-miss-sim"
                onClick={() => onApplyScenario(missScenario.newPresent, missScenario.newTotal)}
                className="text-[11px] font-medium text-rose-700 hover:text-rose-900 hover:underline cursor-pointer"
              >
                Apply to inputs →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
