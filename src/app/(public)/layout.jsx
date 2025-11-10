import { ThemeProvider } from '@/components/context/theme-provider'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

export default function Homelayout({children}) {
  return (
    <div>
        <ThemeProvider
         attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
        <Navbar />
        {children}
        </ThemeProvider>
    </div>
  )
}
