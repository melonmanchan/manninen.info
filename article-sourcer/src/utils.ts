import { DateTime } from "luxon";

export const extractDate = (date: string): Date => {
  const extracted = DateTime.fromFormat(date, "d.M. mm:ss");

  const extractedDate = extracted.toJSDate();

  extractedDate.setFullYear(2019);

  return extractedDate;
};
