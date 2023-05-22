import { monthLength } from 'our-dates';

export default function defineDateFilter(fromDate?: string, toDate?: string) {
  //Returns gteDate and lteDate
  //If not passed fromDate and toDate, returns values refers to actual month
  if (fromDate && toDate) return [new Date(fromDate), new Date(toDate)];

  const date = new Date();
  return [
    new Date(date.getFullYear(), date.getMonth(), 1),
    new Date(
      date.getFullYear(),
      date.getMonth(),
      monthLength(date.getMonth(), date.getFullYear()),
    ),
  ];
}
