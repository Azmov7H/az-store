import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'
import ClientLayout from "@/context/ClientLayout"

export default function Homelayout({children}) {
  return (
    <div>

      <ClientLayout>        
          <Navbar />
          <div className="p-8 mt-8">
        {children}
        </div>
        <Footer />
        
        </ClientLayout>   
        
    </div>
  )
}
