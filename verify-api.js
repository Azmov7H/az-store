const BASE_URL = "http://localhost:3000";

async function verify() {
    console.log("🚀 Starting Verification...");

    // 1. Test Login (Get Token)
    console.log("\n1️⃣ Testing Admin Login...");
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "admin", pass: "admin123" }),
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
        console.error("❌ Login Failed:", loginData);
        process.exit(1);
    }
    const token = loginData.token;
    console.log("✅ Login Successful. Token received.");

    // 2. Test Analytics Tracking
    console.log("\n2️⃣ Testing Analytics Event Tracking...");
    const eventRes = await fetch(`${BASE_URL}/api/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId: "test-session-" + Date.now(),
            type: "page_view",
            url: "http://localhost:3000/shop",
            path: "/shop",
            deviceInfo: { userAgent: "TestBot/1.0", device: "desktop" }
        }),
    });

    const eventData = await eventRes.json();
    if (!eventData.success) {
        console.error("❌ Analytics Tracking Failed:", eventData);
        process.exit(1);
    }
    console.log("✅ Analytics Event Tracked.");

    // 3. Test Admin Analytics Overview (Protected)
    console.log("\n3️⃣ Testing Admin Analytics Overview...");
    const overviewRes = await fetch(`${BASE_URL}/api/admin/analytics/overview`, {
        headers: { "Authorization": `Bearer ${token}` },
    });

    const overviewData = await overviewRes.json();
    if (!overviewData.success) {
        console.error("❌ Admin API Failed:", overviewData);
        process.exit(1);
    }

    console.log("✅ Admin API Accessible.");
    console.log("📊 Stats Preview:", overviewData.data);

    console.log("\n🎉 Verification Complete: All systems nominal.");
}

verify().catch(console.error);
