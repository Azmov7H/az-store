import type { Metadata } from "next";
import { getContacts } from "@/lib/services/contact-service";
import CustomersGrid from "./customers-grid";

export const metadata: Metadata = {
    title: "Customers | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
    // Server-rendered direct DB read (admin-gated by dashboard layout);
    // no client fetch / loading spinner on an authenticated page.
    const data = await getContacts({ limit: 200 });

    return <CustomersGrid customers={data.contacts} />;
}
