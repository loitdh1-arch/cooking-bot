// C-003 — contract-test suite per flow/05-contract.md (Interfaces + Shared shapes).
// Usage: node test/contract.mjs [base-url]   (default: production URL)
// Suite này bạt API ĐÃ DEPLOY — không phải server local. 10 khẳng định, exit 0 khi tất cả PASS.
// Các case không thể ép từ ngoài (429, 502 thiếu key, recipes rỗng, LocalStorage/Clipboard)
// được ghi rõ trong cards/C-003.md — không giả vờ test.

const BASE = (process.argv[2] ?? "https://cooking-chat-bot.vercel.app").replace(/\/+$/, "");

let failures = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    failures++;
    console.log(`FAIL ${name} — ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function postSuggest(body, opts = {}) {
  const res = await fetch(`${BASE}/api/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    signal: AbortSignal.timeout(opts.timeout ?? 30_000),
    ...(opts.raw ? { body: opts.raw } : { body: JSON.stringify(body) }),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // swallow: response không phải JSON — chính là điều assert sẽ bắt (case 400 text/HTML)
  }
  return { status: res.status, json };
}

function assertErrorShape({ status, json }, expectedStatus) {
  assert(status === expectedStatus, `HTTP ${status} != ${expectedStatus}`);
  assert(json !== null && typeof json === "object", "response body không phải JSON object");
  assert(typeof json.error === "string" && json.error.trim().length > 0, `thiếu field error: ${JSON.stringify(json)}`);
}

function assertValidRecipe(r, idx) {
  assert(typeof r === "object" && r !== null, `recipes[${idx}] không phải object`);
  assert(typeof r.id === "string" && /^[a-z0-9-]+$/.test(r.id), `recipes[${idx}].id không phải slug: ${JSON.stringify(r.id)}`);
  assert(typeof r.name === "string" && r.name.trim().length > 0, `recipes[${idx}].name rỗng`);
  assert(Number.isInteger(r.time_minutes) && r.time_minutes >= 10 && r.time_minutes <= 45, `recipes[${idx}].time_minutes ngoài 10-45: ${JSON.stringify(r.time_minutes)}`);
  assert(r.difficulty === "dễ" || r.difficulty === "trung bình", `recipes[${idx}].difficulty ngoài enum: ${JSON.stringify(r.difficulty)}`);
  assert(Array.isArray(r.ingredients) && r.ingredients.length >= 2 && r.ingredients.length <= 12 && r.ingredients.every((s) => typeof s === "string" && s.trim().length > 0), `recipes[${idx}].ingredients sai định dạng`);
  assert(Array.isArray(r.missing) && r.missing.every((s) => typeof s === "string"), `recipes[${idx}].missing sai định dạng`);
  assert(Array.isArray(r.steps) && r.steps.length >= 4 && r.steps.length <= 10, `recipes[${idx}].steps ngoài 4-10`);
  for (const s of r.steps) {
    assert(Number.isInteger(s.order), `recipes[${idx}] có step.order không phải int`);
    assert(typeof s.text === "string" && s.text.trim().length > 0, `recipes[${idx}] có step.text rỗng`);
    assert(Number.isFinite(s.minutes) && s.minutes >= 0, `recipes[${idx}] có step.minutes âm/không phải số`);
  }
}

async function main() {
  // 1. GET /healthz
  await check("GET /healthz returns 200 {ok:true} when the process is up", async () => {
    const res = await fetch(`${BASE}/healthz`, { signal: AbortSignal.timeout(15_000) });
    assert(res.status === 200, `HTTP ${res.status} != 200`);
    const json = await res.json();
    assert(json.ok === true, `body.ok != true: ${JSON.stringify(json)}`);
  });

  // 2. POST /api/suggest hợp lệ
  await check("POST /api/suggest with 3 valid ingredients returns 200 and 1-3 schema-valid recipes", async () => {
    const { status, json } = await postSuggest({ ingredients: ["trứng", "cà chua", "hành tây"] });
    assert(status === 200, `HTTP ${status} != 200`);
    assert(json !== null && Array.isArray(json.recipes), `body không có mảng recipes: ${JSON.stringify(json)}`);
    assert(json.recipes.length >= 1 && json.recipes.length <= 3, `số món ${json.recipes.length} ngoài 1-3`);
    json.recipes.forEach((r, i) => assertValidRecipe(r, i));
  });

  // 3. 1 nguyên liệu
  await check("POST /api/suggest with 1 ingredient returns 400 {error}", async () => {
    assertErrorShape(await postSuggest({ ingredients: ["trứng"] }), 400);
  });

  // 4. 9 nguyên liệu
  await check("POST /api/suggest with 9 ingredients returns 400 {error}", async () => {
    const nine = Array.from({ length: 9 }, (_, i) => `nguyên liệu số ${i + 1}`);
    assertErrorShape(await postSuggest({ ingredients: nine }), 400);
  });

  // 5. Trùng (khác hoa/thường)
  await check("POST /api/suggest with duplicate ingredients (case-insensitive) returns 400 {error}", async () => {
    assertErrorShape(await postSuggest({ ingredients: ["Trứng", "trứng"] }), 400);
  });

  // 6. 41 ký tự
  await check("POST /api/suggest with a 41-char ingredient returns 400 {error}", async () => {
    assertErrorShape(await postSuggest({ ingredients: ["trứng", "x".repeat(41)] }), 400);
  });

  // 7. ingredients là chuỗi
  await check("POST /api/suggest with ingredients as a string (not array) returns 400 {error}", async () => {
    assertErrorShape(await postSuggest({ ingredients: "trứng, cà chua" }), 400);
  });

  // 8. JSON hỏng
  await check("POST /api/suggest with malformed JSON body returns 400 {error}", async () => {
    assertErrorShape(await postSuggest(null, { raw: "{oops", timeout: 15_000 }), 400);
  });

  // 9. Thiếu field
  await check("POST /api/suggest with missing ingredients field returns 400 {error}", async () => {
    assertErrorShape(await postSuggest({}, { timeout: 15_000 }), 400);
  });

  // 10. Trang chủ có nút gọi thử của C-002
  await check("GET / returns 200 HTML containing the suggest button", async () => {
    const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(15_000) });
    assert(res.status === 200, `HTTP ${res.status} != 200`);
    const html = await res.text();
    assert(html.includes("Gợi ý món ăn"), "HTML không chứa nút 'Gợi ý món ăn'");
  });

  console.log(failures === 0 ? "\ncontract-test: ALL PASS" : `\ncontract-test: ${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(`suite crashed: ${e.message}`);
  process.exit(1);
});
