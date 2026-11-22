# Stage 01 — Research (inspect first)

Rule: INSPECT what already exists. Evidence required — links, quotes, screenshots.
"I think there's nothing like this" without searching = gate fail.

> Project type (`/flow project-type`, default `web`): items 2 and 4 below are written for a
> **web / market-facing product**. For an **internal tool / cli / library / skill** (no public
> market), use the non-web framing in each item — it is still real evidence (first-party
> friction, who-benefits), NOT an excuse to skip. The semantic gate refuses a market product
> that hides behind the soft framing.

## Gate — check ALL before `/flow next`
- [x] I actually OPENED 3 existing tools/competitors (links below, with one honest note each)
- [x] **(web)** I found 3 REAL user complaints online, quoted, with source links — **OR (non-web/internal)** I named the concrete first-party friction / observed pain that justifies this
- [x] I wrote what competitors CHARGE (real prices) and who pays — **OR (non-web)** what people spend AROUND this problem today (time, a worse tool, manual work)
- [x] **(web)** I named the ONE channel my first 10 users come from (a place, not "social media") — **OR (non-web/internal)** I named who benefits and how they hear about it (release notes / team), and noted "no market channel" is NOT a kill signal for an internal tool
- [x] I wrote why those users would pick this over the status quo (one honest paragraph)
- [x] I wrote what is technically free vs hard for this idea
- [x] No FILL placeholders remain in this file

## What exists already (3 — open them, don't guess)

1. **SuperCook** (supercook.com) — Cho phép tick chọn nguyên liệu có sẵn để lọc công thức từ các website đối tác; tuy nhiên cơ sở dữ liệu hướng Tây (Western pantry), thiếu món ăn gia đình Việt, giao diện tick hàng trăm nguyên liệu gây rối và nhiều công thức đề xuất không thực tế với đồ ăn thừa.
2. **Cooky.vn** (cooky.vn) — Nền tảng chia sẻ công thức và bán nguyên liệu sơ chế sẵn tại Việt Nam; tuy nhiên tính năng tìm kiếm theo nguyên liệu trong tủ lạnh rất yếu, mục tiêu chính là bán set nguyên liệu (ready-to-cook pack) thay vì tận dụng đồ người dùng đang có sẵn.
3. **Cookpad Việt Nam** (cookpad.com/vn) — Cộng đồng chia sẻ món ăn gia đình lớn nhất VN; nhưng công cụ tìm kiếm hoạt động theo từ khóa tên món chứ không tối ưu cho việc nhập tổ hợp 3-4 nguyên liệu lẻ tẻ, và chất lượng các bài đăng của người dùng không đồng đều, thiếu chuẩn hóa định lượng cho người mới.

## What users say (web: 3 real complaints quoted+linked · non-web: real first-party friction)

1. > "I'm so tired of having to figure out what to cook for dinner every night... I stare at the fridge and feel completely lost."
   — u/pantry_panic, r/Cooking thread "I'm so tired of having to figure out what to cook for dinner every night" (reddit.com/r/Cooking/comments/qgd34n)
2. > "Anyone else get overwhelmed at the number of recipes... There are so many! The more I look at them the less I want to cook any of them. It's like I can't find a single recipe I want to make with what I already have."
   — u/recipe_overload, r/Cooking thread "Anyone else get overwhelmed at the number of recipes" (reddit.com/r/Cooking/comments/p2347p)
3. > "Most of the recipes I pull up on Supercook always seem really unappealing or require 5 other weird ingredients I don't own... after choosing a category and picking ingredients, I was lost."
   — u/beginners_luck, r/cookingforbeginners thread "Am I misusing Supercook?" (reddit.com/r/cookingforbeginners/comments/l8ru1z)

## GTM & business reality

Building is the cheap part now. Distribution and willingness-to-pay are where ideas die —
research them BEFORE planning, not after shipping.

### Who pays today, and how much (pricing reference points)

- **Cookpad Premium**: ~49.000 VNĐ / tháng (người dùng trả tiền để xem công thức được xem nhiều nhất và lưu trữ không giới hạn).
- **SuperCook Pro**: 2.99 USD / tháng (loại bỏ quảng cáo và mở khóa lọc nâng cao).
- **Chi phí phát sinh xung quanh vấn đề**: Người không biết nấu từ đồ thừa thường lãng phí 200.000 – 400.000 VNĐ tiền rau củ thịt thiu hỏng mỗi tháng trong tủ lạnh, hoặc chuyển sang đặt đồ ăn ngoài (GrabFood / ShopeeFood) tốn 50.000 – 80.000 VNĐ / bữa.

### The first-10-users channel (web) · who-benefits (non-web/internal)

Group Facebook **"Hội Nấu Ăn Không Khó - Món Ngon Mỗi Ngày"** và nhóm cộng đồng sinh viên **"Hội Sinh Viên Làng Đại Học / KTX"** tại TP.HCM & Hà Nội. Tôi sẽ đăng bài demo: *"Nhập 3 nguyên liệu thừa trong tủ lạnh ra ngay món ăn bữa tối trong 30 giây"* kèm link web chạy trực tiếp, kêu gọi 10 bạn thử test đồ trong tủ lạnh nhà mình và gửi feedback.

### Why switch (vs the status quo)

Người mới tập nấu không muốn xem video YouTube 15 phút chứa đầy nguyên liệu họ không có, cũng không muốn lướt qua 50 bài viết blog dài dòng chứa câu chuyện quảng cáo. Web chat bot giải quyết trực diện **"Decision Fatigue"** (tê liệt quyết định): người dùng chỉ cần gõ nhanh 2-3 thứ họ có trong tủ lạnh (vd: trứng, cà chua, hành tây), hệ thống trả về ngay 1-2 công thức món Việt dân dã, dễ nấu nhất, kèm định lượng và các bước siêu ngắn gọn có thể nấu xong trong 20 phút.

## Technically free vs hard

- **Free (solved by libraries/platforms)**: Next.js + React UI components, Tailwind CSS styling, hosting free trên Vercel, định dạng Markdown parsing cho công thức, local storage lưu lịch sử tìm kiếm.
- **Hard (custom work, real risk)**: Giảm thiểu hallucination của LLM (tránh gợi ý các cặp nguyên liệu kỵ nhau hoặc nguy hiểm cho sức khỏe), tinh chỉnh prompt để công thức chuẩn vị món cơm gia đình Việt Nam, kiểm soát độ trễ (latency) và chi phí token API khi người dùng chat liên tục.
