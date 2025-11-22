"use client"
import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="p-4 flex flex-col gap-4">
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center border p-2 rounded">
          <div>
            <p>{item.product.title}</p>
            <p>{item.selectedColor} / {item.selectedSize}</p>
            <p>Quantity: 
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                className="w-12 ml-2 border rounded px-1"
              />
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => removeFromCart(index)} variant="destructive">Remove</Button>
          </div>
        </div>
      ))}
      <Button onClick={clearCart} variant="secondary">Clear Cart</Button>
      <Button className="bg-primary text-white">Proceed to Checkout</Button>
    </div>
  )
}
