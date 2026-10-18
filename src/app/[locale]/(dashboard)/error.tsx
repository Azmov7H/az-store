"use client";

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground">Try refreshing the page.</p>
        </div>
    );
}
