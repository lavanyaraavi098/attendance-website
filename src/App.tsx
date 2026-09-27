/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateAttendance, DEFAULT_SUBJECTS } from './utils/calculator';
import { ResultCard } from './components/ResultCard';
import { SimulatorCard } from './components/SimulatorCard';
import { PythonScriptModal } from './components/PythonScriptModal';
import { SemesterSubjects } from './components/SemesterSubjects';
import {
  Calculator,
  GraduationCap,
  Layers,
  RotateCcw,
  Minus,
  Plus,
  Link as LinkIcon,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [presentInput, setPresentInput] = useState<number | ''>('');
  const [totalInput, setTotalInput] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'single' | 'subjects'>('single');
  const [copiedLink, setCopiedLink] = useState(false);

  const websiteUrl =
    typeof window !== 'undefined' &&
    window.location.href &&
    !window.location.href.startsWith('about:')
      ? window.location.href
      : 'https://attendence-website-xi.vercel.app/';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const present =
    typeof presentInput === 'number' ? presentInput : parseInt(presentInput as string, 10) || 0;
  const total =
    typeof totalInput === 'number' ? totalInput : parseInt(totalInput as string, 10) || 0;

  const calculation = calculateAttendance(present, total, targetPercentage);

  const handlePresentChange = (val: string) => {
    if (val === '') {
      setPresentInput('');
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setPresentInput(Math.max(0, parsed));
    }
  };

  const handleTotalChange = (val: string) => {
    if (val === '') {
      setTotalInput('');
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setTotalInput(Math.max(0, parsed));
    }
  };

  const handleIncrementPresent = (step: number = 1) => {
    const nextPresent = Math.max(0, present + step);
    setPresentInput(nextPresent);
    if (nextPresent > total) {
      setTotalInput(nextPresent);
    }
  };

  const handleDecrementPresent = (step: number = 1) => {
    setPresentInput(Math.max(0, present - step));
  };

  const handleIncrementTotal = (step: number = 1) => {
    setTotalInput(Math.max(present, total + step));
  };

  const handleDecrementTotal = (step: number = 1) => {
    const nextTotal = Math.max(1, total - step);
    setTotalInput(nextTotal);
    if (present > nextTotal) {
      setPresentInput(nextTotal);
    }
  };

  const handleApplyScenario = (p: number, t: number) => {
    setPresentInput(p);
    setTotalInput(t);
  };

  const handleResetInputs = () => {
    setPresentInput('');
    setTotalInput('');
    setSelectedSubject('');
    setTargetPercentage(75);
    setCustomTarget('');
  };

  const handleSelectSubject = (name: string) => {
    setSelectedSubject(name);
    try {
      const stored = localStorage.getItem('student_attendance_curriculum_v4');
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find((item: { name: string; total: number; present: number }) => item.name === name);
        if (found && typeof found.total === 'number' && found.total > 0) {
          setPresentInput(found.present);
          setTotalInput(found.total);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setPresentInput('');
    setTotalInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Attendance Calculator
                <span className="hidden sm:inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
                  75% Rule Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Bunk planner & attendance recovery simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                id="tab-single-calculator"
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Calculator</span>
              </button>

              <button
                type="button"
                id="tab-subjects-tracker"
                onClick={() => setActiveTab('subjects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'subjects'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Semester Subjects</span>
              </button>
            </div>

            {/* Header Share Button */}
            <button
              type="button"
              id="copy-website-link-header-btn"
              onClick={handleCopyLink}
              title="Copy website link"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/70 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Share Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'single' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form */}
              <div
                id="attendance-input-form"
                className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base leading-tight">
                        Enter Class Figures
                      </h2>
                      {selectedSubject && (
                        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                          Subject: {selectedSubject}
                          <button
                            type="button"
                            onClick={() => setSelectedSubject('')}
                            className="text-slate-400 hover:text-slate-600 text-[11px] underline cursor-pointer ml-1"
                          >
                            (clear)
                          </button>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    id="reset-inputs-btn"
                    onClick={handleResetInputs}
                    title="Reset to default values"
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>

                {/* 1. Total Classes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="total-classes-input"
                      className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black inline-flex items-center justify-center">
                        1
                      </span>
                      Total Classes (Conducted)
                    </label>
                    <span className="text-xs font-semibold text-blue-600">
                      {totalInput !== '' ? `total = ${total}` : 'Enter total first'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="decrement-total-btn"
                      onClick={() => handleDecrementTotal(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="total-classes-input"
                      type="number"
                      min="1"
                      value={totalInput}
                      onFocus={() => setTotalInput('')}
                      onClick={(e) => e.currentTarget.select()}
                      onChange={(e) => handleTotalChange(e.target.value)}
                      placeholder="Click to enter total classes (e.g. 30)"
                      className="w-full text-center text-xl font-extrabold bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs"
                    />
                    <button
                      type="button"
                      id="increment-total-btn"
                      onClick={() => handleIncrementTotal(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Present Classes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="present-classes-input"
                      className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black inline-flex items-center justify-center">
                        2
                      </span>
                      Present Classes (Attended)
                    </label>
                    <span className="text-xs font-semibold text-emerald-600">
                      {presentInput !== '' ? `present = ${present}` : 'Enter attended'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="decrement-present-btn"
                      onClick={() => handleDecrementPresent(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="present-classes-input"
                      type="number"
                      min="0"
                      max={total || 9999}
                      value={presentInput}
                      onFocus={() => setPresentInput('')}
                      onClick={(e) => e.currentTarget.select()}
                      onChange={(e) => handlePresentChange(e.target.value)}
                      placeholder="Click to enter present classes (e.g. 24)"
                      className="w-full text-center text-xl font-extrabold bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs"
                    />
                    <button
                      type="button"
                      id="increment-present-btn"
                      onClick={() => handleIncrementPresent(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {total > 0 && present > total && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      ⚠️ Present classes ({present}) cannot be greater than total classes ({total}).
                    </p>
                  )}
                </div>

                {/* Target Requirement */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Required Attendance Target
                    </label>
                    <span className="text-xs font-bold text-indigo-600">
                      {targetPercentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[75, 80, 85].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        id={`target-preset-${preset}`}
                        onClick={() => {
                          setTargetPercentage(preset);
                          setCustomTarget('');
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetPercentage === preset && !customTarget
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="Custom"
                        value={customTarget}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomTarget(val);
                          const parsed = parseInt(val, 10);
                          if (parsed > 0 && parsed <= 100) {
                            setTargetPercentage(parsed);
                          }
                        }}
                        className={`w-full py-1.5 px-2 text-center text-xs font-bold rounded-lg border ${
                          customTarget
                            ? 'border-blue-500 ring-1 ring-blue-500 bg-white'
                            : 'border-slate-200 bg-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Load From Semester Subjects */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Load From Semester Subjects
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('subjects')}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      View All 9 Subjects →
                    </button>
                  </div>
                  <select
                    id="semester-subject-select"
                    value={selectedSubject}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) handleSelectSubject(val);
                    }}
                    className="w-full text-xs font-semibold py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>
                      Choose one of your 9 semester subjects...
                    </option>
                    {DEFAULT_SUBJECTS.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Sample Numbers */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Sample Numbers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyScenario(32, 40)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      32 / 40 (Safe, 80%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyScenario(18, 28)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      18 / 28 (Low, 64%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyScenario(45, 50)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      45 / 50 (High, 90%)
                    </button>
                  </div>
                </div>

                {/* Python Algorithm Disclosure */}
                <div className="pt-2 border-t border-slate-100">
                  <PythonScriptModal />
                </div>
              </div>

              {/* Right Column: Result & Simulator */}
              <div className="lg:col-span-7 space-y-6">
                <ResultCard calculation={calculation} target={targetPercentage} />
                {calculation.isValid && (
                  <SimulatorCard
                    present={present}
                    total={total}
                    target={targetPercentage}
                    onApplyScenario={handleApplyScenario}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SemesterSubjects defaultTarget={targetPercentage} />
          </div>
        )}
      </main>

      {/* Website Link Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" /> Website Link
            </span>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800 break-all select-all font-mono">
                {websiteUrl}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Bookmark or share this link to access your attendance calculator anytime on mobile or
              desktop.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="copy-website-link-card-btn"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              id="open-website-link-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-center text-xs text-slate-400">
        <p>Built for university &amp; college students calculating the mandatory 75% attendance threshold.</p>
      </footer>
    </div>
  );
}
