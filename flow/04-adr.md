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
| 3 | **Deploy target**: Vercel free tier, domain `*.vercel.app` | build Next.js native, deploy bằng 1 git push, 0đ chi phí hosting, đủ cho 50 người dùng | VPS tự quản — tốn công set up CI/CD và SSL cho một MVP |
| 4 | **AI integration**: gọi Gemini API (`gemini-2.0-flash`) từ Next.js API route server-side, API key trong biến môi trường | free tier 15 req/phút đủ 150 lượt/2 tuần; gọi server-side giấu API key khỏi client | Gọi API trực tiếp từ client — lộ API key trong bundle; hoặc dùng OpenAI — tính phí theo token |
| 5 | **Kiến trúc**: Next.js 16 fullstack (App Router, frontend + API routes trong 1 repo) | 1 codebase duy nhất, deploy 1 lần, không cần backend riêng | Tách frontend/backend 2 repo (VD Next.js + FastAPI) — gấp đôi khối lượng vận hành cho MVP |
| 6 | **Nội dung AI**: prompt cấu trúc hóa JSON, giới hạn 100% món ăn gia đình Việt Nam phổ thông | pain P3 (nguyên liệu lạ kiểu Tây) là điều người dùng phàn nàn trực tiếp về SuperCook | Để AI tự do gợi ý mọi ẩm thực — gợi ý lệch khỏi khẩu vị mục tiêu VN |

> **Sửa đổi ngày 2026-11-22 (card C-001):** Quyết định 5 ghi ban đầu "Next.js 15";
> `create-next-app@latest` tại thời điểm scaffold cài **Next.js 16.4.6 + React 19.3.0**.
> Chấp nhận nâng version cùng hướng với quyết định gốc (App Router fullstack 1 repo,
> Vercel) — không đổi bản chất kiến trúc, chỉ nâng minor platform theo phương tiện cài
> chính thức. Người vận hành được thông báo trong phiên build C-001.

## NOT doing in v1 (and why it's safe to skip)

- **Không làm server database / tài khoản đồng bộ** — an toàn bỏ qua vì bookmark LocalStorage đã diệt pain P6; sync đa thiết bị không pain nào trong PRD đòi hỏi.
- **Không làm chatbot multi-turn** — an toàn bỏ qua vì pain P1–P2 diệt bằng 1 lần nhấn gợi ý; hội thoại 2 chiều nằm ở cut list v2, tránh chi phí token và phức tạp UI.
- **Không làm nhập nguyên liệu bằng ảnh (vision)** — an toàn bỏ qua vì nhập chips (FR2) đã đạt mục tiêu < 10 giây; multimodal tăng độ phức tạp và giảm độ tin cậy.
- **Không làm đa ngôn ngữ** — an toàn bỏ qua vì thị trường mục tiêu 100% là người Việt (stage 02 scope); i18n chỉ là công việc dịch sau này.
- **Không làm hiển thị hình ảnh món do AI vẽ** — an toàn bỏ qua vì pain nào cũng không nhắc đến; tăng thời gian phản hồi và chi phí API.

