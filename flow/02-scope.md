# Stage 02 — Scope (go/no-go)

Scope = features chosen by IMPACT × COST, inside your time budget.
KILL here is cheap and smart. Killing a weak idea at this gate is a SUCCESS outcome.

## Impact rubric (business value — score BEFORE looking at cost)

| Impact | Meaning |
|---|---|
| H | moves money or the core promise: gets users in (acquisition), gets them paying (revenue), or delivers the one job they came for |
| M | keeps users / saves real time weekly (retention, operations) |
| L | nice-to-have; nobody would pay for or switch over it |

Decision matrix: **H-impact features justify B/C cost** (via the C-paths below).
**L-impact features must be grade A or they're cut** — and even grade-A L-features are
cut when the budget is tight. The classic failure is a v1 full of A-grade L-impact
features: cheap to build, worthless to sell.

## AI coding grade rubric

| Grade | Meaning | Examples |
|---|---|---|
| A | cheap for AI | CRUD, forms, dashboards, content sites, API wrappers |
| B | moderate | file processing, 3rd-party integrations, auth via library, single LLM call, HITL AI drafts |
| C | expensive | realtime, payments from scratch, custom auth, autonomous agentic AI pipelines, heavy concurrency |

**Grade is a COST estimate, not a permission.** The gate is fit(grades, budget), not "no C allowed."
When a C feature is the real need, three honest paths:
1. **The C feature IS the product** → invert the cut: C goes FIRST (riskiest assumption first),
   everything else is minimized to serve it, and the budget is renegotiated against reality.
   But: one C proves the value prop — its siblings are v2 cards, not v1 scope.
2. **Re-architect C down to B** (highest-leverage move): multi-step agent → single LLM call;
   auto-send → human-approves-draft; custom pipeline → managed service / library.
   Same user value, one grade cheaper.
3. **Irreducible C that doesn't fit the budget** → KILL or re-budget. Both are honest.

## Gate — check ALL before `/flow next`
- [x] Every feature below has an IMPACT (H/M/L with the business reason) AND a grade (A/B/C)
- [x] No L-impact feature above grade A survives in v1
- [x] The suggested-features section was actually considered (each suggestion has an in/out decision)
- [x] fit(grades, budget) holds — every C in scope is justified as path 1, 2, or 3 above (written next to the feature)
- [x] If the product IS a C feature: it is FIRST in build order, and its sibling C features are on the cut list
- [x] The cut list is written (what I am NOT building in v1)
- [x] GO / KILL decision is written below
- [x] No FILL placeholders remain in this file
- [x] No unresolved open decisions (resolve via /flow clarify, or assume/cut)

## Time budget

10-14 ngày (khoảng 20 giờ làm việc)

## Features in v1 (each with impact AND grade)

- Gợi ý công thức món ăn theo nguyên liệu có sẵn — impact H (cung cấp giá trị cốt lõi giải quyết tình trạng không biết nấu gì từ đồ tủ lạnh) — grade B (tích hợp single LLM call qua API với prompt cấu trúc hóa JSON) — path 2: Re-architect từ hệ thống agent hội thoại phức tạp (grade C) xuống 1 API call duy nhất trả về danh sách công thức chuẩn cấu trúc, giúp tiết kiệm chi phí và tăng tốc độ phản hồi.
- Nhập nguyên liệu dạng tags/chips thông minh (gõ + chọn nhanh các nguyên liệu phổ biến như trứng, thịt heo, cà chua) — impact H (giúp người dùng nhập liệu trong dưới 10 giây, tối đa hóa tỷ lệ thử nghiệm) — grade A (React state + input form thông thường).
- Hiển thị công thức từng bước kèm danh sách kiểm tra (Step-by-step checklist) và thời gian thực hiện — impact M (tăng tỷ lệ giữ chân người dùng vì giúp người mới không bị rối khi thực hành) — grade A (UI card component + local checkbox state).
- Nút chia sẻ kết quả và sao chép công thức — impact M (hỗ trợ lan tỏa vào kênh phân phối ban đầu là các hội nhóm Facebook) — grade A (Web Share API / Clipboard API).
- Lưu công thức yêu thích vào thiết bị (Bookmark) — impact L (tiện ích xem lại món đã nấu) — grade A (lưu trữ Client LocalStorage đơn giản, không cần server).

## Suggested features (impact-first — proposed, not decided)

- Nút sao chép nguyên liệu / chia sẻ công thức: impact M (tạo viral loop trong các group nấu ăn) — grade A — IN: Cần thiết để 10 người dùng đầu tiên chia sẻ công thức vào group Facebook nhận feedback.
- Chatbot hội thoại nhiều lượt trò chuyện liên tục: impact M (hỏi đáp chuyên sâu hơn) — grade C — OUT: Tốn chi phí token, phức tạp hóa giao diện cho v1; thay bằng form nhập nguyên liệu và gợi ý công thức một chạm.
- Tính toán lượng Calo và phân tích dinh dưỡng chi tiết: impact L (hữu ích cho người ăn kiêng) — grade B — OUT: Người mới tập nấu chỉ cần nấu được món ăn cơ bản; tính năng này làm loãng trọng tâm MVP.

## Cut list (NOT in v1 — deferred, not deleted)

- Đăng nhập, quản lý tài khoản người dùng và đồng bộ đám mây (hoãn: v1 dùng LocalStorage).
- Nhận diện nguyên liệu qua hình ảnh chụp tủ lạnh (hoãn: tốn chi phí multimodal vision và độ chính xác chưa cao).
- Hỗ trợ đa ngôn ngữ Tiếng Anh / Tiếng Hàn (hoãn: v1 tập trung 100% món ăn gia đình Việt Nam).
- Chatbot đối thoại hai chiều liên tục dạng ChatGPT (hoãn: thay bằng form gợi ý cấu trúc hóa).

## Decision

GO — Ý tưởng rõ ràng, tập trung vào tính năng cốt lõi duy nhất (nhập nguyên liệu -> ra công thức món Việt), toàn bộ tính năng ở mức Grade A và Grade B (không có Grade C phức tạp), hoàn toàn phù hợp với ngân sách 20 giờ.

## Open decisions

Không có quyết định mở nào còn tồn đọng. Toàn bộ thiết kế dùng client-side LocalStorage và Next.js API Routes không yêu cầu database phức tạp.

## Assumptions

- Người dùng truy cập bằng điện thoại hoặc máy tính cá nhân qua trình duyệt web chuẩn.
- API AI (Gemini hoặc OpenAI) sẵn sàng cung cấp phản hồi trong dưới 5 giây với định dạng JSON chuẩn.
- Người dùng chỉ cần gợi ý các món ăn phổ thông trong ẩm thực Việt Nam.
