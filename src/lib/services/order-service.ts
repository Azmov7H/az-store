// Server-side order service — direct Mongoose access (no self-HTTP round trips).
import { connectDB } from "@/lib/db/connection";
import { Order as OrderModel } from "@/lib/db/schemas";
import type { IOrder, IOrderProduct } from "@/lib/db/schemas";
import type { CreateOrderData, Order } from "@/types/order";
import { generateOrderId } from "@/lib/helpers";

type OrderDoc = IOrder & { _id: unknown };

export function toOrderDTO(doc: OrderDoc): Order {
    return {
        _id: String(doc._id),
        orderId: doc.orderId,
        customerName: doc.customerName,
        customerEmail: doc.customerEmail,
        customerPhone: doc.customerPhone ?? "",
        customerCity: doc.customerCity ?? "",
        customerDistrict: doc.customerDistrict ?? "",
        customerStreet: doc.customerStreet ?? "",
        products: (doc.products || []).map(
            (p: IOrderProduct): Order["products"][number] => ({
                shoeId: p.shoeId ?? "",
                title: p.title ?? "",
                price: p.price ?? 0,
                quantity: p.quantity ?? 1,
                selectedColor: p.selectedColor || "N/A",
                selectedSize: p.selectedSize || "N/A",
            })
        ),
        subtotal: doc.subtotal,
        discount: doc.discount ?? 0,
        shipping: doc.shipping ?? 0,
        total: doc.total,
        status: doc.status,
        notes: doc.notes,
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    };
}

/**
 * Fetch all orders (server/admin context — dashboard pages)
 */
export async function getOrders(): Promise<Order[]> {
    await connectDB();
    const docs = (await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .lean()) as unknown as OrderDoc[];
    return docs.map(toOrderDTO);
}

/**
 * Fetch a single order by its public orderId
 */
export async function getOrderById(id: string): Promise<Order | null> {
    await connectDB();
    const doc = (await OrderModel.findOne({ orderId: id }).lean()) as unknown as OrderDoc | null;
    return doc ? toOrderDTO(doc) : null;
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
    id: string,
    status: Order["status"]
): Promise<Order | null> {
    return updateOrder(id, { status });
}

/**
 * Update whitelisted order fields. Orders are financial records:
 * arbitrary client fields must never reach the DB (mass-assignment protection).
 */
export async function updateOrder(
    id: string,
    patch: Partial<
        Pick<
            IOrder,
            | "status"
            | "notes"
            | "customerName"
            | "customerEmail"
            | "customerPhone"
            | "customerCity"
            | "customerDistrict"
            | "customerStreet"
            | "products"
            | "discount"
        >
    >
): Promise<Order | null> {
    const allowed: Record<string, true> = {
        status: true,
        notes: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        customerCity: true,
        customerDistrict: true,
        customerStreet: true,
        products: true,
        discount: true,
    };

    const update: Record<string, unknown> = {};
    for (const key of Object.keys(patch)) {
        if (allowed[key] && (patch as Record<string, unknown>)[key] !== undefined) {
            update[key] = (patch as Record<string, unknown>)[key];
        }
    }
    if (Object.keys(update).length === 0) return getOrderById(id);

    await connectDB();
    const doc = (await OrderModel.findOneAndUpdate(
        { orderId: id },
        update,
        { new: true }
    ).lean()) as unknown as OrderDoc | null;
    return doc ? toOrderDTO(doc) : null;
}

/**
 * Create a new order (server-side pricing; same rules as POST /api/orders).
 * Route handlers pass validated input (Zod) — subtotal/shipping/total are
 * computed here, never trusted from the client.
 */
export async function createOrder(
    orderData: Omit<CreateOrderData, "subtotal" | "shipping" | "total">
): Promise<Order> {
    if (!orderData.customerName) throw new Error("Customer name is required.");
    if (!orderData.customerEmail) throw new Error("Customer email is required.");
    if (!orderData.products?.length) throw new Error("At least one product is required.");

    const products = orderData.products.map((item) => ({
        shoeId: item.shoeId || "",
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor || "N/A",
        selectedSize: item.selectedSize || "N/A",
    }));

    const shipping = products.length >= 3 ? 0 : 40;
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shipping - (orderData.discount || 0);

    await connectDB();
    const doc = await new OrderModel({
        orderId: generateOrderId(),
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        customerCity: orderData.customerCity,
        customerDistrict: orderData.customerDistrict,
        customerStreet: orderData.customerStreet,
        products,
        subtotal,
        discount: orderData.discount || 0,
        shipping,
        total,
        status: "pending",
        notes: orderData.notes,
    }).save();

    return toOrderDTO(doc.toJSON() as OrderDoc);
}
