// Server-side contact (lead message) service — direct Mongoose access.
import { connectDB } from "@/lib/db/connection";
import { Contact } from "@/lib/db/schemas";
import type { IContact } from "@/lib/db/schemas";

type ContactDoc = IContact & { _id: unknown };

export interface ContactDTO {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    message: string;
    status: IContact["status"];
    createdAt: string;
}

export function toContactDTO(doc: ContactDoc): ContactDTO {
    return {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone ?? null,
        message: doc.message,
        status: doc.status ?? "new",
        createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    };
}

/**
 * All contact messages (admin dashboard). Supports optional status filter + pagination.
 */
export async function getContacts(
    options: { page?: number; limit?: number; status?: IContact["status"] } = {}
) {
    await connectDB();

    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit ?? 10;
    const query: { status?: IContact["status"] } = options.status
        ? { status: options.status }
        : {};

    const [docs, total] = await Promise.all([
        Contact.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .lean() as unknown as ContactDoc[],
        Contact.countDocuments(query),
    ]);

    return {
        contacts: docs.map(toContactDTO),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
}

/**
 * Save a new contact message from the public form. Caller is responsible for validation.
 */
export async function createContact(
    data: { name: string; email: string; phone?: string; message: string }
): Promise<ContactDTO> {
    await connectDB();
    const doc = await new Contact({
        id: `contact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        status: "new",
    }).save();

    return toContactDTO(doc.toJSON() as ContactDoc);
}
