export interface ResultInput {
  creditHours: number;
  gradePoint: number;
  qualityPoints: number;
}

/**
 * Calculates GPA for a given set of results.
 */
export function calculateGPA(results: ResultInput[]) {
  let totalQualityPoints = 0;
  let totalCredits = 0;
  for (const r of results) {
    totalQualityPoints += r.qualityPoints;
    totalCredits += r.creditHours;
  }
  if (totalCredits === 0) return { gpa: 0, totalQualityPoints, totalCredits };
  return { gpa: totalQualityPoints / totalCredits, totalQualityPoints, totalCredits };
}

/**
 * Calculates CGPA across all semesters (same logic as GPA, but over all results).
 */
export function calculateCGPA(allResults: ResultInput[]) {
  return calculateGPA(allResults);
}

/**
 * Determines degree classification based on CGPA and classification rules.
 */
export function getDegreeClassification(cgpa: number, classifications: any[]) {
  const sorted = classifications.sort((a, b) => b.minCGPA - a.minCGPA);
  for (const cls of sorted) {
    if (cgpa >= cls.minCGPA && cgpa <= cls.maxCGPA) return cls.name;
  }
  return 'Fail';
}
