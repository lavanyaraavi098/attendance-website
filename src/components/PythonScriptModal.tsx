import React, { useState } from 'react';
import { Code, Copy, Check, Terminal } from 'lucide-react';

const PYTHON_CODE = `present = int(input("Enter the present class"))
total = int(input("Enter the total classes"))
attendence = int((present / total) * 100)
print("current attendence", attendence, "%")

if attendence >= 75:
    print("maintain the 75 attendence continue")
    can_miss = 0
    while (present / (total + can_miss + 1)) * 100 >= 75:
        can_miss += 1
    print("You can bunk", can_miss, "classes and still maintain 75% attendance")
else:
    needed = 0
    while (present + needed) / (total + needed) * 100 < 75:
        needed += 1
    print("You need to attend", needed, "more classes to reach 75%")`;

export const PythonScriptModal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="toggle-python-code-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Code className="w-3.5 h-3.5 text-blue-600" />
          {isOpen ? 'Hide Python Algorithm' : 'View Original Python Script'}
        </button>

        {isOpen && (
          <button
            type="button"
            id="copy-python-code-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 text-xs shadow-md">
          <div className="bg-slate-900 px-3.5 py-2 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>attendance_calc.py</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Python 3.x</span>
          </div>
          <div className="p-4 overflow-x-auto font-mono leading-relaxed text-slate-300">
            <pre>
              <code>{PYTHON_CODE}</code>
            </pre>
          </div>
          <div className="bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
            <span>Powered by the same mathematical logic in real-time</span>
          </div>
        </div>
      )}
    </div>
  );
};
