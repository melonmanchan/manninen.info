import { extractDate } from "./utils";

import { Settings } from "luxon";

Settings.defaultZoneName = "Europe/Helsinki";

describe("extractDate", () => {
  test("Basic iltalehti date parsing works", () => {
    const str = "10.3. 19:55";

    const maybeDate = extractDate(str);

    if (maybeDate.isNone()) {
      throw new Error("Invalid date");
    }

    maybeDate.map(date => {
      expect(date.getFullYear()).toBe(2019);
      expect(date.getDate()).toBe(10);
      expect(date.getMonth()).toBe(2);

      expect(date.getHours()).toBe(19);
      expect(date.getMinutes()).toBe(55);
    });
  });

  test("Parses leading hour correctly", () => {
    const str = "31.3. 8:56";

    const maybeDate = extractDate(str);

    if (maybeDate.isNone()) {
      throw new Error("Invalid date");
    }

    maybeDate.map(date => {
      expect(date.getFullYear()).toBe(2019);
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(2);

      expect(date.getHours()).toBe(8);
      expect(date.getMinutes()).toBe(56);
    });
  });

  test("Handles invalid date", () => {
    const str = "31.14. 8:56";

    const maybeDate = extractDate(str);

    if (!maybeDate.isNone()) {
      throw new Error("Invalid date");
    }
  });
});
