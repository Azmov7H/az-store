import { CartProvider } from '@/components/context/CartContext'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

export default function Homelayout({children}) {
  return (
    <div>
      
       <CartProvider>
        <Navbar />
        {children}
        <Footer />
        </CartProvider>   
        
    </div>
  )
}
