// Replacing moment.js

export default (dob, units, dom, integer = true, correctDays = 0) => {
  const untilObject = dom;
  let fromObject;
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  if (correctDays) {
    fromObject = addDays(dob, correctDays);
  } else {
    fromObject = dob;
  }
  const millisecondDifference = untilObject.getTime() - fromObject.getTime();
  const milliseconds = 1000;
  const seconds = 60;
  const minutes = 60;
  const hours = 24;
  const days = 7;
  const months = 365 / 12;
  const exactYears = 365.25;
  const rawMinutes = millisecondDifference / (milliseconds * seconds);
  const rawHours = millisecondDifference / (milliseconds * seconds * minutes);
  const rawDays =
    millisecondDifference / (milliseconds * seconds * minutes * hours);
  const rawWeeks =
    millisecondDifference / (milliseconds * seconds * minutes * hours * days);
  const rawMonths =
    millisecondDifference / (milliseconds * seconds * minutes * hours * months);
  let rawYears;
  let tempRawYears =
    millisecondDifference /
    (milliseconds * seconds * minutes * hours * exactYears);
  if (
    [untilObject.getMonth(), untilObject.getDate()] ===
    [fromObject.getMonth(), fromObject.getDate()]
  ) {
    rawYears = Math.round(tempRawYears);
  } else {
    rawYears = tempRawYears;
  }
  let rawAnswer;
  switch (true) {
    case units === "minutes":
      rawAnswer = rawMinutes;
      break;
    case units === "hours":
      rawAnswer = rawHours;
      break;
    case units === "days":
      rawAnswer = rawDays;
      break;
    case units === "weeks":
      rawAnswer = rawWeeks;
      break;
    case units === "months":
      rawAnswer = rawMonths;
      break;
    case units === "years":
      rawAnswer = rawYears;
      break;
    case units === "stringAge":
      const yearBitLeft = rawYears - Math.floor(rawYears);
      const remainderMonths = Math.floor(yearBitLeft * 12);
      const intAges = {
        hours: Math.floor(rawHours),
        remainderHours: Math.floor(rawHours) % 24,
        days: Math.floor(rawDays),
        remainderDays: Math.floor(rawDays) % 7,
        weeks: Math.floor(rawWeeks),
        remainderWeeks: Math.floor(rawWeeks) % 4,
        months: Math.floor(rawMonths),
        remainderMonths: remainderMonths,
        years: Math.floor(rawYears),
      };
      const plurals = {
        hours: "",
        remainderHours: "",
        days: "",
        remainderDays: "",
        weeks: "",
        remainderWeeks: "",
        months: "",
        remainderMonths: "",
        years: "",
      };
      for (const [key, value] of Object.entries(intAges)) {
        if (value === 1) {
          plurals[key] = "";
        } else {
          plurals[key] = "s";
        }
      }
      const wholeWeeks = Math.floor(rawWeeks);
      switch (true) {
        case wholeWeeks <= 2:
          return `${intAges.days} day${plurals.days} and ${intAges.remainderHours} hour${plurals.remainderHours}`;
        case wholeWeeks > 2 && wholeWeeks <= 8:
          return `${intAges.weeks} week${plurals.weeks} and ${intAges.remainderDays} day${plurals.remainderDays}`;
        case wholeWeeks > 8 && wholeWeeks <= 52:
          return `${intAges.months} month${plurals.months} and ${intAges.remainderWeeks} week${plurals.remainderWeeks}`;
        default:
          return `${intAges.years} year${plurals.years} and ${intAges.remainderMonths} month${plurals.remainderMonths}`;
      }
    case units === undefined:
      return "Error: please specify units for output";
    default:
      return "Error: invalid parameter for units";
  }
  if (integer === true && units !== "stringAge") {
    return Math.floor(rawAnswer);
  } else {
    return rawAnswer;
  }
};