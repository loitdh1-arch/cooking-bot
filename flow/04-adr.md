# Stage 04 — ADR (architecture decisions)

Short. The most valuable section is what you are NOT doing and why.

## Gate — check ALL before `/flow next`
- [x] Each decision has a one-line "why" and a one-line "what I rejected"
- [x] The NOT-doing list is written
- [x] Decisions cover: data storage, auth approach, deploy target
- [x] No FILL placeholders remain in this file

## Decisions

| # | Decision | Why | Rejected alternative |
|---|----------|-----|----------------------|
| 1 | **Data storage**: LocalStorage trên trình duyệt, không database server | v1 chỉ cần lưu bookmark + lịch sử tra cứu trên 1 thiết bị; người dùng không cần đăng nhập nên không có dữ liệu cần sync | Postgres/Firebase + API riêng — thêm chi phí vận hành và surface lỗi cho MVP 20 giờ |
| 2 | **Auth approach**: không có đăng nhập, web công khai ẩn danh | rào cản đăng ký giết tỷ lệ thử nghiệm của 10 người dùng đầu tiên đến từ group Facebook | NextAuth/magic-link — tăng thời gian build ít nhất gấp đôi, không pain nào trong PRD đòi hỏi nó |
| 3 | **Deploy target**: Cloudflare Workers free tier (OpenNext preset), domain `*.workers.dev` — **sửa từ Vercel ngày 2026-11-22 (C-005):** operator yêu cầu chuyển vì CF có PoP tại VN (Hà Nội/HCM) nhanh hơn cho người dùng Việt; Vercel giữ fallback tới khi CF xanh | Vercel free — đã dùng cho C-001→C-004, deploy 1 git push | VPS tự quản — tốn công set up CI/CD và SSL cho một MVP |
| 4 | **AI integration**: gọi Gemini API (`gemini-3.6-flash`) từ Next.js API route server-side, API key trong biến môi trường | test thật 2026-11-22: 3.6-flash trả 200 trong ~1.8s với structured JSON + tiếng Việt có dấu, đủ dư cho 150 lượt/2 tuần; gọi server-side giấu API key khỏi client | Gọi API trực tiếp từ client — lộ API key trong bundle; hoặc dùng OpenAI — tính phí theo token; họ flash-lite rẻ hơn nhưng làm mất dấu tiếng Việt |
| 5 | **Kiến trúc**: Next.js 16 fullstack (App Router, frontend + API routes trong 1 repo) | 1 codebase duy nhất, deploy 1 lần, không cần backend riêng | Tách frontend/backend 2 repo (VD Next.js + FastAPI) — gấp đôi khối lượng vận hành cho MVP |
| 6 | **Nội dung AI**: prompt cấu trúc hóa JSON, giới hạn 100% món ăn gia đình Việt Nam phổ thông | pain P3 (nguyên liệu lạ kiểu Tây) là điều người dùng phàn nàn trực tiếp về SuperCook | Để AI tự do gợi ý mọi ẩm thực — gợi ý lệch khỏi khẩu vị mục tiêu VN |

> **Sửa đổi ngày 2026-11-22 (card C-001):** Quyết định 5 ghi ban đầu "Next.js 15";
> `create-next-app@latest` tại thời điểm scaffold cài **Next.js 16.4.6 + React 19.3.0**.
> Chấp nhận nâng version cùng hướng với quyết định gốc (App Router fullstack 1 repo,
> Vercel) — không đổi bản chất kiến trúc, chỉ nâng minor platform theo phương tiện cài
> chính thức. Người vận hành được thông báo trong phiên build C-001.

> **Sửa đổi ngày 2026-11-22 (chuẩn bị C-002), hoàn tất sau test thật:** Quyết định 4 ghi ban
> đầu model `gemini-2.0-flash` với "15 req/phút". Kiểm tra bằng API key thật (2026-11-22):
> gọi generateContent trên 2.5-flash bị Google **chặn cho người dùng mới** (404 "no longer
> available to new users", chỉ dẫn sang 3.8-flash); 3.8-flash + alias flash-latest +
> 3.7-flash **quá tải 503/hang** lúc test. Test lần lượt các model khả dụng với đúng
> structured-output schema: **`gemini-3.6-flash` trả 200 trong ~1.8s, tiếng Việt có dấu,
> structured JSON chuẩn**; họ flash-lite trả 200 nhưng làm mất dấu tiếng Việt trong tên
> món → loại. Chốt `gemini-3.6-flash`, `thinkingConfig.thinkingLevel: "low"`. Volume mục
> tiêu 150 lượt/2 tuần vẫn dưới mọi ngưỡng free tier đã ghi nhận. Hình dạng lỗi 429 trong
> contract giữ nguyên, bỏ số ngưỡng cứng.

## NOT doing in v1 (and why it's safe to skip)

- **Không làm server database / tài khoản đồng bộ** — an toàn bỏ qua vì bookmark LocalStorage đã diệt pain P6; sync đa thiết bị không pain nào trong PRD đòi hỏi.
- **Không làm chatbot multi-turn** — an toàn bỏ qua vì pain P1–P2 diệt bằng 1 lần nhấn gợi ý; hội thoại 2 chiều nằm ở cut list v2, tránh chi phí token và phức tạp UI.
- **Không làm nhập nguyên liệu bằng ảnh (vision)** — an toàn bỏ qua vì nhập chips (FR2) đã đạt mục tiêu < 10 giây; multimodal tăng độ phức tạp và giảm độ tin cậy.
- **Không làm đa ngôn ngữ** — an toàn bỏ qua vì thị trường mục tiêu 100% là người Việt (stage 02 scope); i18n chỉ là công việc dịch sau này.
- **Không làm hiển thị hình ảnh món do AI vẽ** — an toàn bỏ qua vì pain nào cũng không nhắc đến; tăng thời gian phản hồi và chi phí API.

