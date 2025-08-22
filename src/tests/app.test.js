import request from "supertest";
import app from "../app.js";

describe("App routes", () => {
  it("GET / returns greeting", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Hello from CI\/CD pipeline/);
  });

  it("GET /healthz returns ok", async () => {
    const res = await request(app).get("/healthz");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
