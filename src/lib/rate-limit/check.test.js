import { describe, it, expect } from "vitest";
import { getClientIp } from "./check";

const makeRequest = (headers) => ({
  headers: {
    get: (name) => headers[name.toLowerCase()] ?? null,
  },
});

describe("getClientIp", () => {
  it("retorna o primeiro IP de x-forwarded-for", () => {
    const req = makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("trima whitespace", () => {
    const req = makeRequest({ "x-forwarded-for": "  1.2.3.4  ,5.6.7.8" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("usa x-real-ip se não tiver x-forwarded-for", () => {
    const req = makeRequest({ "x-real-ip": "99.88.77.66" });
    expect(getClientIp(req)).toBe("99.88.77.66");
  });

  it("prefere x-forwarded-for sobre x-real-ip quando ambos presentes", () => {
    const req = makeRequest({
      "x-forwarded-for": "1.1.1.1",
      "x-real-ip": "2.2.2.2",
    });
    expect(getClientIp(req)).toBe("1.1.1.1");
  });

  it("retorna 'unknown' sem nenhum header", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBe("unknown");
  });
});
