import { vParser } from "../src/vicon_parser";
import { expect, it, describe } from "vitest";

describe("#CSV parser", async () => {
  it("should return a string with hello", async function () {
    const res = await vParser("../data/test.csv")
      .then((r) => r)
      .catch((e) => console.log(e.message));
    expect(res).toBeTypeOf("object");
  });
});
