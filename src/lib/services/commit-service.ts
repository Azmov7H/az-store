// Server-side commit (review/testimonial) service — direct Mongoose access.
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Commit } from "@/lib/db/schemas";
import type { ICommit } from "@/lib/db/schemas";

type CommitDoc = ICommit & { _id: unknown };

export interface CommitDTO {
    id: string;
    username: string;
    email: string;
    commit: string;
    rating: number;
    createdAt: string;
}

export function toCommitDTO(doc: CommitDoc): CommitDTO {
    return {
        id: doc.id,
        username: doc.username,
        email: doc.email,
        commit: doc.commit,
        rating: doc.rating ?? 5,
        createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
    };
}

/**
 * Verified commits for public display (cached 60s).
 */
export const getCommits = unstable_cache(
    async (): Promise<CommitDTO[]> => {
        await connectDB();
        const docs = (await Commit.find({ verified: true })
            .limit(20)
            .sort({ createdAt: -1 })
            .lean()) as unknown as CommitDoc[];
        return docs.map(toCommitDTO);
    },
    ["commits"],
    { revalidate: 60, tags: ["commits"] }
);

/**
 * Pagination helper for the public commits endpoint.
 */
export async function getCommitsPaged(page = 1, limit = 10) {
    await connectDB();
    const query = { verified: true };

    const [docs, total] = await Promise.all([
        Commit.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .lean() as unknown as CommitDoc[],
        Commit.countDocuments(query),
    ]);

    return {
        commits: docs.map(toCommitDTO),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
}

/**
 * Create a new (unverified) commit. Caller is responsible for validation.
 */
export async function createCommit(
    data: { username: string; email: string; commit: string; rating?: number }
): Promise<CommitDTO> {
    await connectDB();
    const doc = await new Commit({
        id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        username: data.username,
        email: data.email,
        commit: data.commit,
        rating: data.rating ?? 5,
        verified: false,
    }).save();

    return toCommitDTO(doc.toJSON() as CommitDoc);
}
