import { DateTime } from "luxon";

import { Option, some, none } from "fp-ts/lib/Option";

export const extractDate = (date: string): Option<Date> => {
  const extracted = DateTime.fromFormat(date, "d.M. h:mm");

  if (!extracted.isValid) {
    return none;
  }

  const extractedDate = extracted.toJSDate();

  extractedDate.setFullYear(2019);

  return some(extractedDate);
};
