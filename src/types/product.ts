// Product Types
export interface Product {
    _id: string;
    id: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    category: 'running' | 'casual' | 'formal' | 'sports' | 'sandals' | 'boots';
    availableColors: string[];
    availableSizes: string[];
    stock: number;
    rating: number;
    reviews: number;
    isNew: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
}

export interface ProductsResponse {
    shoes: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
