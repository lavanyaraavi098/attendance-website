import { CalculationResult, SimulationResult, Subject } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Discrete Mathematics & Graph Theory', present: '', total: '' },
  { id: 'sub-2', name: 'Universal Human Values 2 - Understanding The Harmony', present: '', total: '' },
  { id: 'sub-3', name: 'Artificial Intelligence', present: '', total: '' },
  { id: 'sub-4', name: 'Database Management Systems', present: '', total: '' },
  { id: 'sub-5', name: 'Object Oriented Programming Through Java', present: '', total: '' },
  { id: 'sub-6', name: 'Database Management Systems LAB', present: '', total: '' },
  { id: 'sub-7', name: 'Object Oriented Programming Through Java Lab', present: '', total: '' },
  { id: 'sub-8', name: 'Python Programming', present: '', total: '' },
  { id: 'sub-9', name: 'Environmental Science', present: '', total: '' },
];

export function calculateAttendance(
  present: number,
  total: number,
  target: number = 75
): CalculationResult {
  if (total <= 0) {
    return {
      present,
      total,
      targetPercentage: target,
      currentPercentage: 0,
      isValid: false,
      errorMessage: 'Total classes must be greater than 0',
      isSafe: false,
      canMiss: 0,
      needed: 0,
      projectedPercentageAfterBunk: 0,
      projectedPercentageAfterNeeded: 0,
    };
  }

  if (present < 0 || total < 0) {
    return {
      present,
      total,
      targetPercentage: target,
      currentPercentage: 0,
      isValid: false,
      errorMessage: 'Values cannot be negative',
      isSafe: false,
      canMiss: 0,
      needed: 0,
      projectedPercentageAfterBunk: 0,
      projectedPercentageAfterNeeded: 0,
    };
  }

  if (present > total) {
    return {
      present,
      total,
      targetPercentage: target,
      currentPercentage: Math.round((present / total) * 100 * 10) / 10,
      isValid: false,
      errorMessage: 'Classes attended cannot exceed total classes conducted',
      isSafe: true,
      canMiss: 0,
      needed: 0,
      projectedPercentageAfterBunk: 0,
      projectedPercentageAfterNeeded: 0,
    };
  }

  const rawPercent = (present / total) * 100;
  const currentPercentage = Math.round(rawPercent * 100) / 100;
  const isSafe = rawPercent >= target;

  let canMiss = 0;
  let needed = 0;

  if (isSafe) {
    while ((present / (total + canMiss + 1)) * 100 >= target) {
      canMiss += 1;
      if (canMiss > 5000) break;
    }
  } else {
    if (target >= 100) {
      needed = Infinity;
    } else {
      while (((present + needed) / (total + needed)) * 100 < target) {
        needed += 1;
        if (needed > 5000) break;
      }
    }
  }

  const projectedPercentageAfterBunk =
    canMiss > 0 ? Math.round((present / (total + canMiss)) * 100 * 10) / 10 : currentPercentage;

  const projectedPercentageAfterNeeded =
    needed > 0 && needed !== Infinity
      ? Math.round(((present + needed) / (total + needed)) * 100 * 10) / 10
      : currentPercentage;

  return {
    present,
    total,
    targetPercentage: target,
    currentPercentage,
    isValid: true,
    isSafe,
    canMiss,
    needed,
    projectedPercentageAfterBunk,
    projectedPercentageAfterNeeded,
  };
}

export function simulateScenario(
  present: number,
  total: number,
  action: 'attend' | 'miss',
  count: number
): SimulationResult {
  const newPresent = action === 'attend' ? present + count : present;
  const newTotal = total + count;
  const newPercentage = newTotal > 0 ? Math.round((newPresent / newTotal) * 100 * 10) / 10 : 0;
  const curPercentage = total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0;
  const difference = Math.round((newPercentage - curPercentage) * 10) / 10;

  return {
    label:
      action === 'attend'
        ? `Attend next ${count} ${count === 1 ? 'class' : 'classes'}`
        : `Miss next ${count} ${count === 1 ? 'class' : 'classes'}`,
    action,
    count,
    newPresent,
    newTotal,
    newPercentage,
    difference,
  };
}
