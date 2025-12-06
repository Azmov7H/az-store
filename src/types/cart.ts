// Cart Types
export interface CartItem {
    id: string;
    _id?: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
    stock: number;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (product: CartItem) => void;
    removeItem: (id: string, selectedColor: string, selectedSize: string) => void;
    updateQuantity: (id: string, quantity: number, selectedColor: string, selectedSize: string) => void;
    clear: () => void;
    itemCount: number;
    totalPrice: number;
}
