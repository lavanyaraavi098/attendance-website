import React from 'react';
import { CalculationResult } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface ResultCardProps {
  calculation: CalculationResult;
  target: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ calculation, target }) => {
  const {
    present,
    total,
    currentPercentage,
    isValid,
    errorMessage,
    isSafe,
    canMiss,
    needed,
    projectedPercentageAfterBunk,
    projectedPercentageAfterNeeded,
  } = calculation;

  if (!isValid) {
    if (total === 0 && (errorMessage?.includes('greater than 0') || !errorMessage)) {
      return (
        <div
          id="result-initial-state"
          className="p-8 rounded-2xl bg-white border border-slate-200 text-center shadow-xs space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Enter Your Attendance</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Input your attended classes and total classes conducted on the left to see your current
            percentage and bunk allowance.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs text-slate-400 font-medium">
            <span>• Instant 75% rule calculation</span>
            <span>• Safe bunk count</span>
            <span>• What-If simulator</span>
          </div>
        </div>
      );
    }

    return (
      <div
        id="result-error-state"
        className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-center"
      >
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h3 className="font-bold text-lg text-amber-950">Check Your Inputs</h3>
        <p className="text-sm text-amber-800 mt-1">
          {errorMessage || 'Please enter valid attendance figures.'}
        </p>
      </div>
    );
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(currentPercentage, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  const variance = (currentPercentage - target).toFixed(1);

  return (
    <div id="attendance-result-card" className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
          isSafe
            ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-50/40 to-teal-50/20 border-emerald-200/80 shadow-sm'
            : 'bg-gradient-to-br from-rose-500/10 via-rose-50/40 to-amber-50/20 border-rose-200/80 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Circular Progress Meter */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className={isSafe ? 'stroke-emerald-600' : 'stroke-rose-500'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Attendance
              </span>
            </div>
          </div>

          {/* Status info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs">
              {isSafe ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Target Met (≥ {target}%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5" /> Below Target (&lt; {target}%)
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {isSafe ? 'Maintain the 75% attendance continue' : 'Attendance Shortage Warning'}
            </h3>
            <p className="text-sm text-slate-600">
              You have attended <strong className="text-slate-900 font-semibold">{present}</strong>{' '}
              out of <strong className="text-slate-900 font-semibold">{total}</strong> total classes
              conducted.
            </p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="mt-6 pt-5 border-t border-slate-200/60">
          {isSafe ? (
            <div className="bg-emerald-600 text-white rounded-xl p-4 shadow-md flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-emerald-500/80 shrink-0 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-emerald-100 text-xs tracking-wider uppercase">
                  Safety Margin
                </div>
                <div className="text-base sm:text-lg font-bold">
                  {canMiss > 0 ? (
                    <>
                      You can bunk{' '}
                      <span className="underline decoration-2 underline-offset-4 decoration-emerald-200 text-yellow-200 font-black text-xl">
                        {canMiss}
                      </span>{' '}
                      {canMiss === 1 ? 'class' : 'classes'} and still maintain {target}% attendance
                    </>
                  ) : (
                    <>
                      You are right at the border! You cannot bunk any classes without dropping
                      below {target}%.
                    </>
                  )}
                </div>
                {canMiss > 0 && (
                  <p className="text-xs text-emerald-100">
                    If you miss {canMiss} next {canMiss === 1 ? 'class' : 'classes'}, your
                    attendance will be {projectedPercentageAfterBunk}%.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-rose-600 text-white rounded-xl p-4 shadow-md flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-rose-500/80 shrink-0 text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-rose-100 text-xs tracking-wider uppercase">
                  Recovery Requirement
                </div>
                <div className="text-base sm:text-lg font-bold">
                  You need to attend{' '}
                  <span className="underline decoration-2 underline-offset-4 decoration-rose-200 text-yellow-200 font-black text-xl">
                    {needed}
                  </span>{' '}
                  more {needed === 1 ? 'class' : 'classes'} to reach {target}%
                </div>
                <p className="text-xs text-rose-100">
                  Attending {needed} consecutive classes brings your record to {present + needed}/
                  {total + needed} ({projectedPercentageAfterNeeded}%).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Classes Present</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">{present}</span>
          <span className="text-[11px] text-emerald-600 font-medium">Attended</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Classes Absent</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">
            {Math.max(0, total - present)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Missed so far</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Target Threshold</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">{target}%</span>
          <span className="text-[11px] text-blue-600 font-medium">College Rule</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Status</span>
          <span
            className={`text-base font-bold mt-0.5 block ${
              isSafe ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isSafe ? `+${variance}% safe` : `${variance}% deficit`}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Variance</span>
        </div>
      </div>
    </div>
  );
};
