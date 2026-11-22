// C-002 / flow/05-contract.md — POST /api/suggest
//   200 {recipes: Recipe[]} (0-3) · empty: {recipes: []} → UI "Không tìm được món phù hợp"
//   fail: 400 {error} (thiếu/sai ingredients) · 429 {error} (vượt rate limit Gemini) · 502 {error} (Gemini lỗi/quá 10s/schema sai/thiếu key)
// ADR 4: gọi server-side để giấu API key; ADR 6: prompt giới hạn 100% món gia đình Việt Nam.

const GEMINI_MODEL = "gemini-3.6-flash"; // ADR sửa đổi 2026-11-22: 2.0 retired, 2.5 chặn người dùng mới, 3.8/3.7 quá tải — 3.6-flash test 200/~1.8s, tiếng Việt có dấu
const GEMINI_TIMEOUT_MS = 10_000; // khớp contract 502 + NFR p95 ≤ 10s
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_RECIPES = 3; // contract: recipes 0-3 phần tử

// ---------- Shared shape flow/05-contract.md ----------
type GeminiContent = { content?: { parts?: Array<{ text?: string }> } };

type Step = { order: number; text: string; minutes: number };
type Recipe = {
  id: string;
  name: string;
  time_minutes: number;
  difficulty: "dễ" | "trung bình";
  ingredients: string[];
  missing: string[];
  steps: Step[];
};

// ---------- Response helpers ----------
function fail(status: number, error: string) {
  return Response.json({ error }, { status });
}

// ---------- Input resolve (law/CODING.md #1: named resolve BEFORE handler) ----------
type Resolved<T> = { ok: true; value: T } | { ok: false; error: string };

function resolveSuggestSpec(body: unknown): Resolved<string[]> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Body phải là JSON object chứa mảng ingredients." };
  }
  const raw = (body as Record<string, unknown>).ingredients;
  if (!Array.isArray(raw)) {
    return { ok: false, error: "ingredients phải là mảng chuỗi, ví dụ [\"trứng\", \"cà chua\"]." };
  }
  const items = raw.map((v) => (typeof v === "string" ? v.trim() : ""));
  // C-003 fix (bug suite phát hiện): contract "mỗi phần tử 1-40 ký tự sau trim" là TỪ CHỐI,
  // không phải cắt ngắn lặng lẽ như bản C-002 từng làm bằng slice(0, 40).
  if (items.some((s) => s.length === 0 || s.length > 40)) {
    return { ok: false, error: "Mỗi nguyên liệu phải là chuỗi 1-40 ký tự (sau khi bỏ khoảng trắng)." };
  }
  if (items.length < 2 || items.length > 8) {
    return { ok: false, error: "Cần từ 2 đến 8 nguyên liệu." };
  }
  const deduped = [...new Set(items.map((s) => s.toLowerCase()))];
  if (deduped.length !== items.length) {
    return { ok: false, error: "Nguyên liệu bị trùng lặp — mỗi nguyên liệu chỉ liệt kê một lần." };
  }
  return { ok: true, value: items };
}

// ---------- Output validate (contract: validate từng trường, sai kiểu coi như 502) ----------
function isNonemptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validateRecipes(value: unknown): Resolved<Recipe[]> {
  if (!Array.isArray(value) || value.length > MAX_RECIPES) {
    return { ok: false, error: "Gemini trả danh sách món sai định dạng (không phải mảng 0-3 phần tử)." };
  }
  const recipes: Recipe[] = [];
  for (const r of value) {
    if (typeof r !== "object" || r === null) return { ok: false, error: "Một phần tử recipe không phải object." };
    const o = r as Record<string, unknown>;
    if (!isNonemptyString(o.id) || !/^[a-z0-9-]+$/.test(o.id)) {
      return { ok: false, error: `Recipe id "${String(o.id)}" không phải slug ASCII hợp lệ.` };
    }
    if (!isNonemptyString(o.name)) return { ok: false, error: "Recipe thiếu name." };
    if (!Number.isInteger(o.time_minutes) || (o.time_minutes as number) < 10 || (o.time_minutes as number) > 45) {
      return { ok: false, error: `Recipe "${String(o.name)}" có time_minutes ngoài khoảng 10-45.` };
    }
    if (o.difficulty !== "dễ" && o.difficulty !== "trung bình") {
      return { ok: false, error: `Recipe "${String(o.name)}" có difficulty ngoài enum dễ|trung bình.` };
    }
    if (!Array.isArray(o.ingredients) || o.ingredients.length < 2 || o.ingredients.length > 12 || !o.ingredients.every(isNonemptyString)) {
      return { ok: false, error: `Recipe "${String(o.name)}" có ingredients sai định dạng (2-12 chuỗi).` };
    }
    if (!Array.isArray(o.missing) || !o.missing.every((m) => typeof m === "string")) {
      return { ok: false, error: `Recipe "${String(o.name)}" có missing sai định dạng (mảng chuỗi).` };
    }
    if (!Array.isArray(o.steps) || o.steps.length < 4 || o.steps.length > 10) {
      return { ok: false, error: `Recipe "${String(o.name)}" có số bước ngoài khoảng 4-10.` };
    }
    const steps: Step[] = [];
    for (const s of o.steps) {
      if (typeof s !== "object" || s === null) return { ok: false, error: `Recipe "${String(o.name)}" có step không phải object.` };
      const so = s as Record<string, unknown>;
      if (!Number.isInteger(so.order) || !isNonemptyString(so.text) || !Number.isFinite(so.minutes) || (so.minutes as number) < 0) {
        return { ok: false, error: `Recipe "${String(o.name)}" có step sai trường order/text/minutes.` };
      }
      steps.push({ order: so.order as number, text: so.text, minutes: so.minutes as number });
    }
    recipes.push({
      id: o.id,
      name: o.name,
      time_minutes: o.time_minutes as number,
      difficulty: o.difficulty as Recipe["difficulty"],
      ingredients: o.ingredients as string[],
      missing: o.missing as string[],
      steps,
    });
  }
  return { ok: true, value: recipes };
}

// ---------- Gemini prompt (ADR 6: 100% món gia đình Việt Nam) ----------
const SYSTEM_PROMPT = `Bạn là trợ lý nấu ăn cho người mới tập nấu ăn tại Việt Nam. Người dùng cho biết các nguyên liệu đang có trong tủ lạnh; bạn trả về 2-3 món ăn gia đình Việt Nam phổ thông nấu được từ chúng.

Quy tắc bắt buộc:
- Chỉ món ăn gia đình Việt Nam quen thuộc; không gợi ý món Tây hay món cần nguyên liệu lạ khó mua.
- Ưu tiên món nấu nhanh, đơn giản (difficulty "dễ" khi có thể).
- id: slug ASCII chữ thường, từ khóa nối bằng gạch nối (bỏ dấu tiếng Việt), ví dụ "Trứng chiên cà chua" -> "trung-chien-ca-chua".
- time_minutes: tổng thời gian nấu, chỉ trong khoảng 10-45 phút.
- difficulty: chỉ nhận giá trị "dễ" hoặc "trung bình".
- ingredients: mảng nguyên liệu kèm định lượng, ví dụ "2 quả trứng", "300g thịt heo".
- missing: gia vị/gia vị thông thường món cần mà người dùng chưa kể tên (nước mắm, muối, dầu ăn, tỏi, hành, đường...) — nếu không thiếu gì thì trả mảng rỗng.
- steps: 4-10 bước, mỗi bước text tiếng Việt ngắn gọn, order đánh số tăng dần từ 1, minutes là ước lượng số phút (>= 0).
- Nếu tổ hợp nguyên liệu không thể nấu món Việt hợp lý nào, trả về mảng rỗng (0 món).
- Chỉ trả về JSON đúng schema; không thêm văn bản giải thích.`;

// Gemini structured-output schema (OpenAPI subset) — khớp Shared shapes của contract.
const RECIPE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      id: { type: "STRING" },
      name: { type: "STRING" },
      time_minutes: { type: "INTEGER" },
      difficulty: { type: "STRING", enum: ["dễ", "trung bình"] },
      ingredients: { type: "ARRAY", items: { type: "STRING" } },
      missing: { type: "ARRAY", items: { type: "STRING" } },
      steps: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { order: { type: "INTEGER" }, text: { type: "STRING" }, minutes: { type: "INTEGER" } },
          required: ["order", "text", "minutes"],
        },
      },
    },
    required: ["id", "name", "time_minutes", "difficulty", "ingredients", "missing", "steps"],
  },
} as const;

export async function POST(request: Request) {
  // 1. Parse JSON body — swallow duy nhất lỗi parse JSON (law/CODING.md #4)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Body không phải JSON hợp lệ.");
  }

  // 2. Resolve spec trước khi vào handler chính (law/CODING.md #1)
  const spec = resolveSuggestSpec(body);
  if (!spec.ok) return fail(400, spec.error);

  // 3. Env fail-loud (law/CODING.md #2) — không default âm thầm
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fail(502, "Server chưa cấu hình biến môi trường GEMINI_API_KEY.");
  }

  // 4. Gọi Gemini với timeout 10s (contract 502 + NFR p95 ≤ 10s)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `Nguyên liệu tôi đang có: ${spec.value.join(", ")}.` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RECIPE_SCHEMA,
          maxOutputTokens: 4096,
          temperature: 0.4,
          thinkingConfig: { thinkingLevel: "low" }, // 3.x dùng thinkingLevel (đã verify field), giữ p95 ≤ 10s cho việc gợi ý
        },
      }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      return fail(429, "Vượt giới hạn request của Gemini free tier — vui lòng thử lại sau ít phút.");
    }
    if (!res.ok) {
      return fail(502, `Gemini trả lỗi HTTP ${res.status}.`);
    }

    const data: unknown = await res.json();
    const gen = (data as { candidates?: GeminiContent[] } | null)?.candidates?.[0];
    const text = gen?.content?.parts?.[0]?.text;
    if (!text) {
      return fail(502, "Gemini không trả nội dung (có thể bị chặn hoặc empty candidate).");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return fail(502, "Gemini trả JSON không parse được.");
    }

    const recipes = validateRecipes(parsed);
    if (!recipes.ok) return fail(502, recipes.error);

    // 200 — bao gồm cả empty shape {recipes: []} của contract
    return Response.json({ recipes: recipes.value });
  } catch (e) {
    // swallow 2 nguồn có tên (law/CODING.md #4): timeout abort và lỗi mạng HTTP tới Gemini —
    // cả hai đều map về fail shape 502 của contract.
    if (e instanceof Error && e.name === "AbortError") {
      return fail(502, "Gemini quá 10 giây không phản hồi (timeout server-side).");
    }
    return fail(502, `Lỗi khi gọi Gemini: ${e instanceof Error ? e.message : "unknown"}`);
  } finally {
    clearTimeout(timer);
  }
}
