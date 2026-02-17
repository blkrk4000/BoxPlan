// Get ISO Week and Year
export function getISOWeekAndYear(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// Get Date object from ISO Week and Year
export function getDateFromISOWeek(week: number, year: number): Date {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay();
  const ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getUTCDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getUTCDay());
  return ISOweekStart;
}