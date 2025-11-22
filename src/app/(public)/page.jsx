import Fetcher from '@/components/home/Fetcher'
import Hero from '@/components/home/Hero'
import Testimonials from '@/components/home/Testimonials'
import React from 'react'

export default function page() {
  return (
    <div className='p-10'>
      <Hero />
      <Fetcher />
      <Testimonials />
    </div>
  )
}
