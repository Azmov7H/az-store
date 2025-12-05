// POST /api/login
export async function POST(req) {
  const body = await req.json();
  const { user, pass } = body;

  if (
    user === process.env.DASHBOARD_USER &&
    pass === process.env.DASHBOARD_PASS
  ) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `dashboard-auth=${process.env.DASHBOARD_SECRET}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
