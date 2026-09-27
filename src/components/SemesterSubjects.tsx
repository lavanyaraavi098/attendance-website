import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { calculateAttendance, DEFAULT_SUBJECTS } from '../utils/calculator';
import {
  GraduationCap,
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface SemesterSubjectsProps {
  defaultTarget: number;
}

const STORAGE_KEY = 'student_attendance_curriculum_v4';

export const SemesterSubjects: React.FC<SemesterSubjectsProps> = ({ defaultTarget }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SUBJECTS;
    } catch (e) {
      console.error(e);
      return DEFAULT_SUBJECTS;
    }
  });

  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch (e) {
      console.error(e);
    }
  }, [subjects]);

  const handleResetAll = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  const handleFieldChange = (id: string, field: 'present' | 'total', value: string) => {
    if (value === '') {
      setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: '' } : s)));
      return;
    }
    const num = Math.max(0, parseInt(value, 10) || 0);
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: num } : s)));
  };

  const handleFocusClear = (id: string, field: 'present' | 'total') => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: '' } : s)));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      present: '',
      total: '',
    };
    setSubjects([...subjects, newSub]);
    setNewSubjectName('');
    setIsAddingSubject(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleLogToday = (id: string, type: 'attend' | 'miss') => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const p = typeof s.present === 'number' ? s.present : 0;
        const t = typeof s.total === 'number' ? s.total : 0;
        return type === 'attend'
          ? { ...s, present: p + 1, total: t + 1 }
          : { ...s, total: t + 1 };
      })
    );
  };

  const validSubjects = subjects.filter((s) => typeof s.total === 'number' && s.total > 0);
  const totalPresent = validSubjects.reduce(
    (acc, s) => acc + (typeof s.present === 'number' ? s.present : 0),
    0
  );
  const totalConducted = validSubjects.reduce(
    (acc, s) => acc + (typeof s.total === 'number' ? s.total : 0),
    0
  );
  const hasConducted = totalConducted > 0;
  const aggregateCalc = calculateAttendance(totalPresent, totalConducted, defaultTarget);

  return (
    <div id="subject-manager-section" className="space-y-6">
      {/* Aggregate Overview Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Semester Aggregate Status
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Overall Semester Attendance</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasConducted
                ? `Calculated across ${validSubjects.length} of ${subjects.length} subjects (${totalPresent}/${totalConducted} classes)`
                : 'Enter Total Classes first, then Present Classes for each subject below.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {hasConducted ? (
              <div className="text-right">
                <div className="text-3xl font-black tracking-tight text-white">
                  {aggregateCalc.currentPercentage}%
                </div>
                <div className="text-xs font-semibold">
                  {aggregateCalc.isSafe ? (
                    <span className="text-emerald-400 font-medium">Safe (≥{defaultTarget}%)</span>
                  ) : (
                    <span className="text-rose-400 font-medium">
                      Shortage (&lt;{defaultTarget}%)
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Enter classes below</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {hasConducted ? (
            aggregateCalc.isSafe ? (
              <div className="text-emerald-300 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Aggregate Safe! You can bunk {aggregateCalc.canMiss} total classes across
                  subjects and maintain ≥{defaultTarget}%.
                </span>
              </div>
            ) : (
              <div className="text-rose-300 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Aggregate Shortage: Need to attend {aggregateCalc.needed} more consecutive classes
                  to bring semester total to {defaultTarget}%.
                </span>
              </div>
            )
          ) : (
            <div className="text-slate-400 flex items-center gap-1.5">
              <span>
                Click on any input to enter values. The existing digits will automatically clear
                when clicked.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="reset-semester-subjects-btn"
              onClick={handleResetAll}
              title="Reset all subject values to blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium cursor-pointer transition-colors text-xs border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
            <button
              type="button"
              id="add-subject-modal-btn"
              onClick={() => setIsAddingSubject(!isAddingSubject)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium cursor-pointer transition-colors text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Add Subject Inline Form */}
      {isAddingSubject && (
        <form
          onSubmit={handleAddSubject}
          className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm space-y-3"
        >
          <h4 className="text-sm font-bold text-slate-800">Add Another Subject</h4>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Subject Name (e.g., Computer Organization)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setIsAddingSubject(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub, idx) => {
          const isLab = sub.name.toLowerCase().includes('lab');
          const p = typeof sub.present === 'number' ? sub.present : 0;
          const t = typeof sub.total === 'number' ? sub.total : 0;
          const hasInput = typeof sub.total === 'number' && sub.total > 0;
          const calc = hasInput ? calculateAttendance(p, t, defaultTarget) : null;
          const isOverflow = hasInput && p > t;

          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isLab
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isLab ? (
                          <FlaskConical className="w-3 h-3" />
                        ) : (
                          <BookOpen className="w-3 h-3" />
                        )}
                        {isLab ? 'Lab' : 'Theory'}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {sub.name}
                    </h5>
                  </div>

                  <div className="text-right shrink-0">
                    {hasInput && calc?.isValid ? (
                      <>
                        <span
                          className={`text-xl font-black ${
                            calc.isSafe ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {calc.currentPercentage}%
                        </span>
                        <span
                          className={`block text-[10px] uppercase font-bold ${
                            calc.isSafe ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {calc.isSafe ? 'Eligible' : 'Shortage'}
                        </span>
                      </>
                    ) : (
                      <span className="inline-block text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60">
                        Awaiting Input
                      </span>
                    )}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="mt-4 p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Enter Attendance
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      Click to enter (auto-clears)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        1. Total Classes
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 30"
                        value={sub.total}
                        onFocus={() => handleFocusClear(sub.id, 'total')}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={(e) => handleFieldChange(sub.id, 'total', e.target.value)}
                        className="w-full px-2.5 py-2 text-center font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs"
                      />
                      <span className="text-[10px] text-slate-400 block text-center mt-1">
                        Conducted
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        2. Present Classes
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 24"
                        value={sub.present}
                        onFocus={() => handleFocusClear(sub.id, 'present')}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={(e) => handleFieldChange(sub.id, 'present', e.target.value)}
                        className="w-full px-2.5 py-2 text-center font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:text-xs"
                      />
                      <span className="text-[10px] text-slate-400 block text-center mt-1">
                        Attended
                      </span>
                    </div>
                  </div>

                  {isOverflow && (
                    <p className="text-[11px] text-rose-600 font-semibold pt-1">
                      ⚠️ Present classes ({p}) cannot exceed total classes ({t}).
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                {hasInput && calc?.isValid && (
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        calc.isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, calc.currentPercentage)}%` }}
                    />
                  </div>
                )}

                {/* Status Message */}
                {hasInput && calc?.isValid ? (
                  <div
                    className={`mt-3 p-2.5 rounded-xl border text-xs ${
                      calc.isSafe
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                        : 'bg-rose-50/60 border-rose-200/80 text-rose-900'
                    }`}
                  >
                    {calc.isSafe ? (
                      <p className="font-medium">
                        ✓ Can bunk{' '}
                        <strong className="font-bold text-emerald-950 text-sm">
                          {calc.canMiss}
                        </strong>{' '}
                        {calc.canMiss === 1 ? 'class' : 'classes'} and maintain {defaultTarget}%
                      </p>
                    ) : (
                      <p className="font-medium">
                        ⚠️ Need to attend{' '}
                        <strong className="font-bold text-rose-950 text-sm">{calc.needed}</strong>{' '}
                        more {calc.needed === 1 ? 'class' : 'classes'} to reach {defaultTarget}%
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200/40 text-[11px] text-slate-500 text-center">
                    Enter Total Classes first, then Present Classes to see your bunk allowance
                  </div>
                )}
              </div>

              {/* Log Today Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">Log Today:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Attended today (+1 present, +1 total)"
                    onClick={() => handleLogToday(sub.id, 'attend')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer text-[11px] font-semibold transition-colors"
                  >
                    + Present
                  </button>
                  <button
                    type="button"
                    title="Missed today (+0 present, +1 total)"
                    onClick={() => handleLogToday(sub.id, 'miss')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer text-[11px] font-semibold transition-colors"
                  >
                    + Missed
                  </button>
                  <button
                    type="button"
                    title="Remove subject"
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
