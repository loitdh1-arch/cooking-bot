"use client";

// C-002 vertical slice — trang gọi thử MỘT trang, CHỦ ĐÍCH xấu (per cards/C-002.md).
// Sẽ bị THAY THẾ bởi UI mock card theo law/CLAUDE.md standard sequence mục 5-6
// (luật cấm frontend thật trước khi mock được duyệt) — không làm design ở đây.

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [pending, setPending] = useState(false);

  async function suggest() {
    // Placeholder UX: phân tách bằng dấu phẩy. Chips UI thật thuộc card frontend FR2.
    const ingredients = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setResult("");
    if (ingredients.length < 2) {
      setResult("Thêm ít nhất 2 nguyên liệu, phân tách bằng dấu phẩy.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setResult(`HTTP ${res.status}\n${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      // swallow: lỗi mạng client-side (mất kết nối giữa chừng) — hiển thị thay vì để trang chết.
      setResult(`Lỗi kết nối: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-xl font-bold">Web Chat Bot hỗ trợ nấu ăn — C-002 vertical slice</h1>
      <p className="text-sm text-gray-600">
        Trang tạm để chứng minh seam chạy end-to-end. UI thật sẽ thay trong card UI-mock.
      </p>
      <input
        className="w-full rounded border p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="trứng, cà chua, hành tây"
      />
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={suggest}
        disabled={pending}
      >
        {pending ? "Đang gợi ý..." : "Gợi ý món ăn"}
      </button>
      <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs whitespace-pre-wrap">{result}</pre>
    </main>
  );
}
