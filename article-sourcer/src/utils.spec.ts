import { extractDate } from "./utils";

describe("extractDate", () => {
  test("Basic iltalehti date parsing works", () => {
    const str = "10.3. 19:55";
    const date = extractDate(str);

    console.log(new Date(0).toString());
    console.log(date);

    expect(date.getFullYear()).toBe(2019);
    expect(date.getDate()).toBe(10);
    expect(date.getMonth()).toBe(2);
    // Todo: mock date timezone with jest
    //    expect(date.getHours()).toBe(19);
    //    expect(date.getMinutes()).toBe(55);
  });
});
