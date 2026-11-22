# Stage 03 — PRD

1-2 pages max. Test: could a stranger build v1 from this without asking you anything?

## Gate — check ALL before `/flow next`
- [x] Every section below is filled from MY scope decision (stage 02), not re-expanded
- [x] Success metric is a NUMBER, not vibes ("save time" fails; "first response < 2h" passes)
- [x] Each feature names the user action and the observable result, tagged with a stable `FRn:` id
- [x] Pain & gain is a MAPPING TABLE: every pain cites evidence (a stage-01 quote or a named observation), and names the v1 feature that kills it; every v1 feature kills at least one pain
- [x] A stranger could build v1 from this without asking me anything
- [x] No FILL placeholders remain in this file
- [x] No unresolved open decisions (resolve via /flow clarify, or assume/cut)
- [x] No unquantified adjectives (fast / secure / intuitive / robust / prominent) in Features or NFRs — a number, a named constraint, or cut the word
- [x] Every `FRn` names the failure or empty case (what the user sees when it fails or there is nothing), or an explicit `none`

## Context

Người mới tập nấu tại Việt Nam thường có sẵn 2–5 nguyên liệu trong tủ lạnh nhưng không biết nấu món gì với chúng. Giải pháp phổ biến hiện nay là lướt YouTube/TikTok nấu ăn — video dài 10–15 phút, nguyên liệu trong video thường không khớp với những gì họ có. Các công cụ tra cứu theo nguyên liệu quốc tế (SuperCook) hướng pantry Tây Âu, thiếu món gia đình Việt và yêu cầu tick danh sách nguyên liệu dài gây rối. Sản phẩm này là web app: nhập nguyên liệu đang có → nhận 2–3 công thức món Việt nấu được ngay, hiển thị trong vòng một lần nhấn nút.

## Target users

- **Sinh viên ở trọ (18–24)**: bếp hạn chế (1 cái nồi, 1 cái chảo), mua nguyên liệu lẻ theo bữa, ngân sách 30–50k/bữa.
- **Người đi làm mới tự nấu (24–35)**: tan ca muộn, muốn nấu bữa tối trong 20–30 phút, hay quên công thức đã xem.
- Hành vi chung: dùng điện thoại làm chủ đạo, lướt Facebook group nấu ăn ("Hội Nấu Ăn Không Khó", hội sinh viên KTX), chưa quen thuật ngữ bếp chuyên nghiệp.

## Pain & gain (mapping table — the traceability spine of the PRD)

| # | Persona | Pain (concrete) | Evidence (stage-01 quote/source or named observation) | Today's workaround | V1 feature that kills it | Observable gain |
|---|---------|-----------------|--------------------------------------------------------|--------------------|--------------------------|-----------------|
| P1 | Người mới tập nấu | Mỗi tối đứng trước tủ lạnh không biết nấu gì, mệt mỏi vì phải quyết định | stage-01: "I'm so tired of having to figure out what to cook for dinner every night... I stare at the fridge and feel completely lost." — r/Cooking (reddit.com/r/Cooking/comments/qgd34n) | Lướt YouTube/TikTok 15–30 phút rồi vẫn đặt đồ ăn ngoài | Gợi ý công thức theo nguyên liệu (FR1) + Nhập nguyên liệu dạng chips (FR2) | Từ danh sách nguyên liệu đến 2–3 món gợi ý trong 1 lần nhấn nút, dưới 10 giây |
| P2 | Người mới tập nấu | Choáng ngợp trước quá nhiều công thức, không tìm được món khớp nguyên liệu sẵn có | stage-01: "The more I look at them the less I want to cook any of them. It's like I can't find a single recipe I want to make with what I already have." — r/Cooking (reddit.com/r/Cooking/comments/p2347p) | Đọc dàn trải nhiều blog rồi tự chắp nối | Gợi ý công thức theo nguyên liệu (FR1) | Nhận đúng 2–3 lựa chọn khớp nguyên liệu đã nhập thay vì hàng trăm kết quả |
| P3 | Người mới tập nấu | Công cụ quốc tế (SuperCook) gợi món cần nguyên liệu lạ không có ở bếp VN | stage-01: "Most of the recipes I pull up on Supercook always seem really unappealing or require 5 other weird ingredients I don't own" — r/cookingforbeginners (reddit.com/r/cookingforbeginners/comments/l8ru1z) | Thêm dịch sang món Tây dù không quen | Gợi ý công thức theo nguyên liệu (FR1) — 100% món gia đình Việt | Mỗi gợi ý chỉ dùng nguyên liệu phổ thông ở bếp VN, không đòi mua thêm đồ lạ |
| P4 | Người mới tập nấu | Công thức có sẵn nhưng lúc nấu vẫn rối, hay quên bước, không biết còn bao lâu | Nhận định từ cộng đồng group FB nấu ăn cho người mới: câu hỏi lặp lại "nấu tới bước nào rồi?" khi làm theo video | Xem lại video từ đầu giữa lúc đang nấu | Hướng dẫn từng bước + checklist (FR3) | Mỗi bước có checkbox đánh dấu + thời gian còn lại, xem lại được bằng 1 lần nhìn |
| P5 | Người dùng muốn chia sẻ | Tìm được món hay nhưng không gửi được cho người khác dạng văn bản dễ đọc | Kênh tiếp cận 10 người dùng đầu là group Facebook — chia sẻ là điều kiện lan tỏa | Chụp màn hình thủ công | Sao chép/chia sẻ công thức (FR4) | Dán 1 cú click công thức đầy đủ dạng văn bản vào chat Facebook/Zalo |
| P6 | Người mới tập nấu | Nấu xong một món ổn, lần sau muốn nấu lại thì không nhớ công thức, phải tìm lại từ đầu | stage-01: "Then I stick the list on the fridge so I can see the meals for the..." — r/Cooking (reddit.com/r/Cooking/comments/qgd34n) | Dán giấy nhớ lên tủ lạnh / lướt lại lịch sử Facebook tìm bài cũ | Lưu công thức yêu thích (FR5) | Công thức đã lưu hiện trong mục "Đã lưu" đầu trang, mở lại bằng 1 lần bấm |

### Pains NOT addressed in v1 (deliberate — tie to the scope cut list)

- Không biết bữa này bao nhiêu calo → hoãn; nằm ở cut list "Tính calo/dinh dưỡng", phủ ở v2.
- Muốn hỏi đáp hội thoại nhiều lượt ("thay thịt bò bằng gì?") → hoãn; cut list "Chatbot multi-turn", v1 chỉ gợi ý 1 chiều theo form.
- Muốn lưu công thức xem lại trên nhiều thiết bị → hoãn; v1 chỉ LocalStorage trên 1 thiết bị (cut list "Đăng nhập/đồng bộ đám mây").
- Muốn chụp ảnh tủ lạnh để tự nhận nguyên liệu → hoãn; cut list "Vision nhập liệu".

## Problem statement

Người mới tập nấu tại Việt Nam có nguyên liệu trong tủ lạnh nhưng tốn 15–30 phút lướt video/blog mà vẫn không ra món phù hợp; sản phẩm biến danh sách nguyên liệu đó thành 2–3 công thức món Việt nấu được ngay, trong một lần nhấn nút.

## Features (user-centric — action → observable result)

- FR1: As a người mới tập nấu, I nhập 2–5 nguyên liệu đang có và nhấn nút "Gợi ý món ăn", and I see danh sách 2–3 công thức món Việt gồm tên món, thời gian nấu, độ khó, và nguyên liệu còn thiếu (nếu có); empty: khi chưa nhập đủ 2 nguyên liệu, nút "Gợi ý món ăn" hiển thị disabled kèm chú thích "Thêm ít nhất 2 nguyên liệu"; fail: khi API lỗi hoặc quá 10 giây không phản hồi, tôi thấy thông báo "Không lấy được gợi ý, vui lòng thử lại" kèm nút thử lại.
- FR2: As a người mới tập nấu, I gõ tên nguyên liệu vào ô nhập và chọn từ danh sách gợi ý nhanh (trứng, thịt heo, cà chua, hành tây…), and I see nguyên liệu xuất hiện thành chips có thể bấm xóa, và đếm số nguyên liệu hiện tại; empty: khi chưa có nguyên liệu nào, ô nhập hiển thị gợi ý 8 nguyên liệu phổ biến nhất để bấm chọn nhanh; fail: none (thuần client-side, không có đường lỗi).
- FR3: As a người mới tập nấu, I bấm vào một công thức trong danh sách gợi ý, and I see trang chi tiết với các bước nấu đánh số, checkbox đánh dấu từng bước, và tổng thời gian nấu; empty: none (dữ liệu đến từ FR1, luôn có bước khi có công thức); fail: none (render client-side từ dữ liệu đã nhận).
- FR4: As a người dùng, I bấm nút "Sao chép công thức", and I see toàn bộ công thức (tên, nguyên liệu, các bước) nằm trong clipboard dưới dạng văn bản có cấu trúc để dán vào Zalo/Facebook; empty: none; fail: khi Clipboard API không khả dụng, tôi thấy thông báo "Trình duyệt không hỗ trợ sao chép tự động — hãy chọn thủ công".
- FR5: As a người dùng, I bấm biểu tượng bookmark trên một công thức, and I see bookmark đổi trạng thái và công thức xuất hiện trong mục "Đã lưu" ở đầu trang; empty: khi chưa lưu công thức nào, mục "Đã lưu" hiển thị dòng "Chưa có công thức nào được lưu"; fail: none (LocalStorage luôn khả dụng trên trình duyệt mục tiêu).

## Non-functional requirements

- Mobile-first: layout hiển thị đúng trên màn hình rộng ≥ 320px; thiết kế theo breakdown điểm 375px (iPhone SE) làm chuẩn.
- Thời gian phản hồi gợi ý: p95 ≤ 10 giây từ lúc nhấn "Gợi ý món ăn" đến khi danh sách hiển thị (trên kết nối 4G trung bình).
- Tải trang: LCP ≤ 2.5 giây trên trang chủ (deploy Vercel edge).
- Không cần đăng nhập; không lưu dữ liệu người dùng trên server — mọi dữ liệu người dùng (bookmark, lịch sử) chỉ nằm trong LocalStorage của trình duyệt.
- Chi phí vận hành: 0đ — Vercel free tier + Gemini API free tier (rate limit RPM/RPD do Google điều chỉnh theo đợt — sửa 2026-11-22, trước ghi "15 request/phút"); quá giới hạn hiển thị fail-state của FR1.
- Ngôn ngữ giao diện: tiếng Việt duy nhất trong v1.
- Ngữ cảnh sử dụng: vừa nấu vừa xem — mọi màn hình thao tác được bằng 1 tay trên mobile.

## Tech stack

- **Frontend**: Next.js 16 (App Router) + React 19 (sửa từ "Next.js 15" ngày 2026-11-22 theo ADR decision 5 — create-next-app chính thức cài bản 16.4.6), styling bằng Tailwind CSS v4.
- **Backend**: Next.js API Routes (route handlers) — không có server riêng.
- **AI**: Google Gemini API (model `gemini-2.5-flash` trên free tier — sửa từ `gemini-2.0-flash` ngày 2026-11-22 sau khi list-models bằng key thật cho thấy họ 2.0 đã retired), gọi từ API route server-side, API key nằm trong biến môi trường Vercel.
- **Lưu trữ**: LocalStorage (bookmark, lịch sử tra cứu) — không database trong v1.
- **Deploy**: Vercel (free tier), domain dạng `*.vercel.app`.
- **Ngôn ngữ nội dung**: tiếng Việt; prompt AI được viết để chỉ trả về món ăn gia đình Việt Nam phổ thông.

## Success metric (numbers only)

- 50 người dùng thật (không tính bản thân/đội) sử dụng web trong 2 tuần đầu sau deploy.
- 150 lượt tra cứu nguyên liệu (số lần gọi FR1 thành công) trong cùng kỳ.
- Nguồn người dùng: tối thiểu 2 bài đăng demo trong group Facebook "Hội Nấu Ăn Không Khó" và 1 group sinh viên KTX.

## Open decisions

Không còn quyết định mở nào — AI provider (Gemini), ngôn ngữ (tiếng Việt), metric (50 người dùng/150 lượt), và tech stack đã được người vận hành chốt ở stage 02 và phỏng vấn PRD.

## Assumptions

- Người vận hành tự đăng ký Google AI Studio để lấy Gemini API key và đặt vào biến môi trường `GEMINI_API_KEY` trên Vercel (không tính phí trong free tier).
- Trình duyệt mục tiêu: Chrome/Safari mobile ≥ 2023 (hỗ trợ Clipboard API, Web Share API, LocalStorage).
- Người dùng chấp nhận gợi ý chỉ giới hạn trong ẩm thực gia đình Việt Nam phổ thông (đã chốt ở stage 02 scope).
- Gemini free tier đủ cho volume 150 lượt tra cứu/2 tuần (~11 lượt/ngày) dưới mọi ngưỡng RPD/RPM mà tài liệu Google và bên thứ ba ghi nhận trong 2026 (sửa từ "15 req/phút" ngày 2026-11-22 theo ADR decision 4).
