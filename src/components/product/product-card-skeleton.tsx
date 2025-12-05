import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden border shadow-sm">
            {/* Image Skeleton */}
            <Skeleton className="h-64 w-full" />

            {/* Content Skeleton */}
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>

            <CardContent>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>

            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}
