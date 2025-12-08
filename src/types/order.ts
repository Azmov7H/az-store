// Order Types
export interface OrderProduct {
    shoeId: string;
    title: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
}

export interface Order {
    _id?: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
    products: OrderProduct[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateOrderData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
    products: OrderProduct[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    notes?: string;
}
