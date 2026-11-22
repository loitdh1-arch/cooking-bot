# Stage 05 — Interface Contract (the seam)

The contract is whatever sits between your core and its consumer. For a web app that's
API endpoints (the table below). For a CLI it's commands + flags + output shapes; for a
plugin it's hooks + filters; for a pipeline it's input/output file schemas. Keep the
table's SPIRIT — every feature maps to an interface, every interface has its shapes
written before code — and adapt the columns to your project's shape.

Written BEFORE any code. Backend cards build TO this table; UI cards consume FROM it.
The #1 AI-build failure is producer/consumer drift — backend ships one shape, UI assumes
another, both look green. This file is the cheap fix.

## Gate — check ALL before `/flow next`
- [x] Every PRD feature maps to at least one INTERFACE below (web: endpoint · cli: command · library: public function · skill: command/file)
- [x] Every interface has its INPUT and OUTPUT shapes written (web: request+response · cli: flags+output/exit code · library: args+return)
- [x] Access/effects column filled for every interface (web: public/token/admin · non-web: writes/side-effects, or "none")
- [x] No FILL placeholders remain in this file
- [x] No unresolved open decisions (resolve via /flow clarify, or assume/cut)
- [x] Every write interface names the failure shape (status or exit + body), not only the happy path
- [x] Every interface that can return empty names the empty shape (empty list / 404 / exit 2), or an explicit `none`
- [x] If this project declares a module/package system, the dependency-seam ledger below covers every cross-module/package reference; each required directed edge has a declared-graph cycle result
- [x] If this project declares no module/package system, the dependency-seam ledger explicitly says `N/A`; do not invent owner facts
- [x] Access/effects is a concrete token (web: public/token/admin · non-web: writes/side-effects or "none") — not a vibe word (secure, authenticated, restricted)

## OpenAPI / Swagger rule  (web only — N/A for cli/library/skill)

Next.js App Router **không tự sinh `/openapi.json`** — bảng Interfaces dưới đây là nguồn
chân lý duy nhất của project này. Thay vì spec served, card contract-test sẽ **curl từng
endpoint theo đúng shapes trong bảng** (method, path, status codes, JSON keys) trên URL
đã deploy — tương đương mức độ kiểm tra "producer/consumer không drift" mà spec served
đảm nhiệm. Mọi thay đổi interface phải sửa file này TRƯỚC, rồi mới sửa code.

## Interfaces  (web: endpoints · cli: commands · library: functions · skill: commands)

| Method/Interface | Path/Name | Access/Effects | Input shape | Output shape |
|---|---|---|---|---|
| GET | `/healthz` | public · effects: none | none (không query, không body) | 200 `{ok:true}` · empty: none · fail 500 `{ok:false, error:string}` |
| POST | `/api/suggest` | public · effects: gọi Gemini API bên ngoài (tốn 1 request quota free tier, KHÔNG ghi gì vào server) | body JSON `{ ingredients: string[] }` — ràng buộc: 2–8 phần tử, mỗi phần tử 1–40 ký tự sau trim, không trùng lặp | 200 `{ recipes: Recipe[] }` (0–3 phần tử) · empty: 200 `{ recipes: [] }` → UI hiển thị "Không tìm được món phù hợp" · fail: 400 `{ error:string }` khi ingredients <2 hoặc >8 hoặc item rỗng/dài; 429 `{ error:string }` khi vượt Gemini 15 req/phút; 502 `{ error:string }` khi Gemini lỗi hoặc quá 10 giây (server-side timeout, khớp NFR p95 ≤ 10s) |
| GET | `/` | public · effects: none | none | 200 HTML trang chủ (form nhập nguyên liệu chips + khu vực kết quả + mục "Đã lưu") · empty: none · fail: none (SSR tĩnh, lỗi build sẽ không deploy được — không có fail runtime) |
| LocalStorage (client-seam) | key `ccb:bookmarks` | none (không network) · effects: ghi dữ liệu vào trình duyệt người dùng | ghi: `Recipe[]` (tối đa 50 mục, FIFO khi vượt) · đọc: không input | đọc: `Recipe[]` (có thể rỗng `[]` → UI hiển thị "Chưa có công thức nào được lưu") · fail: trình duyệt private mode chặn ghi → catch và bỏ qua im lặng, tính năng bookmark tự tắt |
| Clipboard (client-seam) | `navigator.clipboard.writeText` | none · effects: ghi clipboard thiết bị | chuỗi văn bản công thức định dạng từ `Recipe` (client-side) | none (Promise resolve) · empty: none · fail: Promise reject khi API không khả dụng → UI hiển thị "Trình duyệt không hỗ trợ sao chép tự động — hãy chọn thủ công" (khớp fail case FR4) |

## Dependency-seam ledger (module/package systems only)

N/A — no module/package system declared. Project là 1 ứng dụng Next.js đơn package (single
package.json, không monorepo/workspace). Không có cross-module reference nào cần ledger.

- Declared dependency graph: single package — không áp dụng.

## Shared shapes (objects used by multiple interfaces)

```
Recipe {
  id: string                // slug ASCII từ tên món, vd "trung-chien-ca-chua"
  name: string              // tên món tiếng Việt, vd "Trứng chiên cà chua"
  time_minutes: number       // tổng thời gian nấu, 10–45
  difficulty: "dễ" | "trung bình"   // đúng 2 mức — người mới là đối tượng chính
  ingredients: string[]     // nguyên liệu + định lượng, vd "2 quả trứng", 2–12 phần tử
  missing: string[]         // gia vị/popular condiment người dùng chưa nhập mà món cần — được phép rỗng []
  steps: Step[]             // 4–10 bước
}
Step { order: number, text: string, minutes: number }   // minutes ước lượng từng bước, >= 0
```

- `Recipe` được dùng bởi: response `/api/suggest`, LocalStorage `ccb:bookmarks`, Clipboard format, và render chi tiết (FR3).
- API route `/api/suggest` yêu cầu Gemini trả JSON đúng schema này (`responseMimeType: application/json`) và **validate server-side từng trường trước khi trả 200** — field thiếu/sai kiểu → coi như 502 thay vì trả JSON lỗi về client.

## Feature → interface map

Reference each PRD feature by its `FRn` id so the mapping is machine-checkable
(`/flow consistency` flags any `FRn` with no interface here).

- FR1 → `POST /api/suggest` (endpoint sinh gợi ý)
- FR2 → `GET /` (client component form nhập chips — không network, thuộc trang chủ)
- FR3 → `POST /api/suggest` (response `Recipe.steps` là dữ liệu render) + `GET /` (nơi render chi tiết từng bước)
- FR4 → Clipboard client-seam `navigator.clipboard.writeText` (input từ `Recipe`)
- FR5 → LocalStorage client-seam `ccb:bookmarks` (persist `Recipe[]`)

## Open decisions

Không còn quyết định mở — mọi interface ở trên đều public theo ADR (không auth), không
cần chọn thêm gì trước khi build.
