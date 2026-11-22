// C-001 / flow/05-contract.md — GET /healthz
//   200 {ok:true} · empty: none · fail 500 {ok:false,error:string}
// Health check: chỉ chứng minh process sống; không đọc DB/env gì cả.
export async function GET() {
  try {
    return Response.json({ ok: true })
  } catch (e) {
    // swallow: lỗi serialize bất thường của Response.json — không có nguồn lỗi nào khác
    // trong thân hàm này; trả đúng fail shape của contract thay vì trang 500 HTML.
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    )
  }
}
