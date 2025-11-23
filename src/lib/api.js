// lib/api.js

// ================== SHOE ==================
const BASE_SHOE = `${process.env.NEXT_PUBLIC_API_URL}/api/shoe`

export async function getShoes() {
  const res = await fetch(BASE_SHOE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch shoes");
  return res.json();
}

export async function getShoeById(id) {
  const res = await fetch(`${BASE_SHOE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch shoe");
  return res.json();
}

export async function createShoe(data) {
  const res = await fetch(BASE_SHOE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create shoe");
  return res.json();
}

export async function updateShoe(id, data) {
  const res = await fetch(`${BASE_SHOE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update shoe");
  return res.json();
}

export async function deleteShoe(id) {
  const res = await fetch(`${BASE_SHOE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete shoe");
  return res.json();
}

// ================== ORDER ==================
const BASE_ORDER =  `${process.env.NEXT_PUBLIC_API_URL}/api/order`;

export async function getOrders() {
  const res = await fetch(BASE_ORDER, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrderById(id) {
  const res = await fetch(`${BASE_ORDER}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(BASE_ORDER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`${BASE_ORDER}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${BASE_ORDER}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
}

// ================== COMMIT ==================
const BASE_COMMIT = `${process.env.NEXT_PUBLIC_API_UR}/api/commit`;

export async function getCommits() {
  const res = await fetch(BASE_COMMIT, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch commits");
  return res.json();
}

export async function getCommitById(id) {
  const res = await fetch(`${BASE_COMMIT}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch commit");
  return res.json();
}

export async function createCommit(data) {
  const res = await fetch(BASE_COMMIT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create commit");
  return res.json();
}

export async function updateCommit(id, data) {
  const res = await fetch(`${BASE_COMMIT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update commit");
  return res.json();
}

export async function deleteCommit(id) {
  const res = await fetch(`${BASE_COMMIT}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete commit");
  return res.json();
}
