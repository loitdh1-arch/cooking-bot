# Design law — buildflow projects

This file is LAW for every UI card in this project — the UI mock card and every
frontend card MUST be built and reviewed against it. If a change conflicts with a rule
here, the rule wins (or the rule is changed deliberately, in this file, with a dated note).

Two layers, treat them differently:
- **Structure is law**: the affordance ladder, object-first pattern, forms rules, and the
  never-do list apply to any product. Don't relitigate these per project.
- **Tokens are taste**: the colors, fonts, and gradients below are one good default.
  A project MAY replace them — deliberately, in this file, all at once, with a dated
  note — never ad-hoc per component.

## North Star

**Simple stupid UI for non-technical users; full power kept available — but never in the way.**

Users think in *their* objects ("my workshop", "my ticket", "my booking") — never in
engine concepts. Engine words (workflow, trigger, action, job, queue, webhook, agent,
prompt…) NEVER appear in user-facing copy. Define this project's vocabulary in the
table below and use it everywhere.

### Project vocabulary (fill per project — strings, never code paths)

| Engine concept | This project's user word |
|---|---|
| gọi AI/API gợi ý | "Gợi ý món ăn" |
| đang xử lý (loading) | "Đang nghĩ món ngon cho bạn…" |
| recipes (kết quả trả về) | "Món nấu được ngay" |
| missing (gia vị chưa kể) | "Bếp cần sẵn: dầu ăn, nước mắm…" |
| bookmark / đã lưu | "Lưu món" / "Món đã lưu" |
| steps (các bước nấu) | "Cách nấu — từng bước một" |
| time_minutes | "Khoảng 15 phút" |
| difficulty | "Dễ / Vừa sức" |
| lỗi API/timeout (502) | "Chậm quá mất rồi — thử lại nhé" |
| vượt giới hạn (429) | "Nhiều người đang nấu quá — chờ vài phút rồi thử lại" |
| không có kết quả (recipes: []) | "Không nghĩ ra món nào với nguyên liệu này — thử thêm vài nguyên liệu nhé" |

## Five rules that override everything

1. **Object-first, not feature-first.** The home page of a thing IS the thing. Tabs are
   lenses on the same object — the user never navigates "out" to reach something related.
2. **WYSIWYG, edited in place.** The daily 80% of edits happen inline on the object's own
   page (see the affordance ladder). A separate Edit page exists only for the structural 20%.
3. **Defaults beat configuration.** Creatable in ≤6 visible fields; everything else behind
   one "More options" disclosure. If a default serves 80%, ship it and demote the toggle.
4. **Plain language beats power syntax.** "4 days after it ends" — never cron. A field-picker
   chip — never `{{ raw.templates }}`. No JSON in any simple surface.
5. **Power behind a door.** If a power surface exists, it's a `Simple | Pro` toggle that
   never loses data, plus a visible "switch to simple" path back. 95% never flip it.

## Edit-affordance ladder (inline ↔ popup is a spectrum, not a switch)

Choose by the field's SEMANTIC SHAPE — always the lightest rung the shape allows.
Decision rule: count the inputs the user must touch to finish the edit.

| Rung | Field shape | Interaction |
|---|---|---|
| 1. Inline text | one free-text value | click → input in place → save on blur/Enter (optimistic) |
| 2. Inline control | one value, known set/format | click → the right native control in place (date picker, stepper, select) |
| 3. Popover composite | ONE displayed line composed of 2–4 sub-choices | click → popover anchored to the field, type-switch + matching input → "Done" writes one line |
| 4. Modal | a multi-field object, or a collection | "+ Add" / "Edit" → centered dialog with all fields |

- Popover edits **one display value**, dims nothing. Modal edits **an object or list**, dims the page.
  Finishing produces one chip → popover. A new row in a list → modal. Never swap them.
- Inline-editable fields: text by default; hover reveals dotted underline + a 12px pencil;
  click becomes the right affordance.
- **Empty state rides the same ladder**: a missing value renders as a dashed `+ Add {label}`
  that opens its own rung. No field is ever a dead-end.

## Object page pattern (the Luma pattern)

Every object-detail page:
- **Pulse strip** — at-a-glance metrics inline (calm, no stat-tile cards, no shadows).
- **Up to 3 hero action cards** — the top things a user does on this object. Big targets,
  gradient-tinted, one click. NOT a kebab menu.
- **Tabs as lenses** — all on the same object. Active tab: 2px bottom border `var(--fg-base)`.
- **Modal-first sub-actions** — small focused modals, one CTA. No multi-screen flows.
- **The overview shows less, not more.** Heavy lifting goes to specialized tabs.

## Warm Kitchen tokens (locked — sửa toàn bộ ngày 2026-11-22)

> **Sửa đổi ngày 2026-11-22 (C-004, operator directive):** Bộ token "Editorial Minimal" ban đầu
> bị operator từ chối khi duyệt mock v1; yêu cầu mới: giao diện kiểu Cookpad, đồ họa web đẩy
> mức tối đa. Đổi token MỘT lần duy nhất tại đây theo đúng luật "tokens are taste".
> Luật cấu trúc (object-first, affordance ladder, never-do) KHÔNG đổi.

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#FFFDFA` | page bg (trắng ấm) |
| `--bg-subtle` | `#FFF7ED` | dải hero, nền phụ |
| `--bg-muted` | `#FDF0E0` | hover, muted chips |
| `--fg-base` | `#2D1B0E` | primary text (nâu đậm ấm) |
| `--fg-muted` | `#6B5544` | body, descriptions |
| `--fg-subtle` | `#96826F` | helper text |
| `--border` | `#F3E3CF` | 1px borders (kem) |
| `--brand` | `#F97316` | brand orange — CTA, link, active |
| `--brand-deep` | `#EA580C` | hover CTA, badge nền cam |
| `--accent` | `#F97316` | focus rings, validate-ok (đồng bộ brand) |

**Typography**: giữ nguyên — `Fraunces` h1/card titles ONLY · `Inter` body ·
`JetBrains Mono` con số/thời gian ONLY.

**Borders & shadows**: 1px `var(--border)` cho input/divider; card 16–24px radius kèm
**layered soft shadow** (2 lớp, tông cam mờ: `0 2px 8px rgba(249,115,22,.08)` +
`0 12px 32px rgba(45,27,14,.10)`) — đặc trưng Cookpad-style "thẻ nổi ấm". Shadow chỉ trên
card/badge — không stack quá 2 lớp.

**Màu nguyên liệu (color-coding chips)**: trứng `#FCD34D` · cà chua `#F87171` ·
hành tây `#C4B5FD` · thịt heo `#F9A8D4` · rau `#86EFAC` · tỏi `#D6D3D1` — nền nhạt của
mỗi màu, chữ `--fg-base`.

## Soft gradients (highlight, not decorate — giữ luật phạm vi)

Hero surfaces + card cover ONLY; không bao giờ trên input, nền trang, row:

```css
--grad-sunrise:  linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 55%, #FED7AA 100%);  /* hero đầu trang / cover món chính */
--grad-ember:    linear-gradient(135deg, #FDBA74 0%, #F97316 100%);              /* CTA chính, badge nổi bật */
--grad-mint:     linear-gradient(135deg, #ECFDF3 0%, #D1F4DD 100%);              /* lưu món / success */
--grad-rose:     linear-gradient(135deg, #FFF1F4 0%, #FDDDE3 100%);              /* chia sẻ / social */
--grad-pulse:    linear-gradient(90deg, #FFFDFA 0%, #FFF1E4 50%, #FFFDFA 100%);  /* strip metric */
```

Hover gradient card: lift `translateY(-1px)` + shadow đậm hơn một nấc; không viền accent cứng.

## Food art (thay ảnh stock trong v1)

Card cover dùng **SVG vẽ tay món ăn** (trứng chiên, cà chua, hành tây…) đặt trên nền
gradient `--grad-sunrise` — controlled, tự nhiên, không cần ảnh ngoài. Khi có ảnh thật
ở v2, SVG thay bằng `<img>` cùng khung.

**Step art (thêm 2026-11-22 theo operator review v2):** mỗi bước nấu có thumbnail SVG
56px kèm cảnh riêng (thớt sơ chế, chảo phi hành tây, chảo xào cà chua, tráng trứng) —
bước nào nhìn là biết phải làm gì, không cần đọc hết câu chữ.

**Premium rule (operator review v3 — 2026-11-22):** flat vector đơn tầng bị chê "kiểu
bao bì mì tôm". Mọi art phải layered: radial-gradient nhiều stop cho vật thể, bokeh
nền, specular highlight, ground shadow mềm — chiều sâu trước, chi tiết sau.

**Bottom tab bar (operator yêu cầu 2026-11-22):** thanh tab cuối màn hình, 2 tab đúng
scope v1 — "Gợi ý món" (active) · "Món đã lưu". KHÔNG phát minh tab ngoài scope
(khám phá/hồ sơ) — đó là scope creep trong thiết kế.

## Forms

- Max 6 visible fields on any create/edit page; more → disclosure.
- One column, max-width 640px for focused forms. No multi-step wizards for editing.
- Sticky savebar: white, 1px top border, optional 4px gradient accent strip.
- Labels 12px / 500 / `var(--fg-muted)`. Inputs 38px tall, 1px border, accent focus ring.

## Iconography

Stroke line icons (Heroicons/Lucide style), stroke-width 1.6–2, no fill.
**No emojis. Anywhere. Ever.** Use SVGs.

## VN conventions (when the project is Vietnamese-facing)

- Vietnamese copy throughout the user surface — written natively, not translated.
- Prices: `₫750,000` — symbol leading, comma groups. Never "VND 750000.00".
- VietQR scan-to-pay as the default payment presentation; cards demoted to "Thẻ quốc tế".
- Zalo as a first-class support-channel option, not only email.

## What to never do

- Never leak engine words into user-facing copy (see vocabulary table).
- Never show raw `{{ }}` templates or JSON outside a power-user surface.
- Never use multi-step wizards for editing.
- Never gradient form inputs, body backgrounds, or table rows.
- Never stack shadows. Never add emojis. Never write design comments in HTML.

## How this binds the cards

- The **UI mock card** renders these tokens/patterns in static HTML — the mock IS the
  design review; the operator approves against this file.
- Every **frontend card**'s review checks the diff against this file the same way it
  checks shapes against `flow/05-contract.md`. DESIGN.md is to pixels what the contract
  is to shapes.
