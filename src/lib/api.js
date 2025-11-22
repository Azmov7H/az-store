// lib/api.js
export async function fetchOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { next: { revalidate: 10 } });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shoes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function updateOrder(orderId, payload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");
  return data;
}

export async function deleteOrder(orderId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete order");
  return data;
}
const BASE_URL = "http://localhost:5000/api/shoes"; // عدل URL حسب الباك

export async function getShoes() {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  return res.json();
}

export async function getShoeById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
}

export async function createShoe(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateShoe(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteShoe(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });
  return res.json();
}
