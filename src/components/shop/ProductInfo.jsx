import { Card, CardContent, CardDescription,  CardTitle } from '@/components/ui/card';
import React from 'react';

export default function ProductInfo({ title, description, price, category }) {
  return (
    <Card className="flex flex-col text-start w-full gap-2 p-4">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      
      <CardContent className="flex flex-col gap-2 p-0">
        <CardDescription className="text-sm text-gray-700">{description}</CardDescription>
        <p className="text-sm font-medium text-green-600">${price}</p>
        <span className={`inline-block text-xs font-medium text-white ${category === 'Men' ? 'bg-blue-700' : 'bg-pink-500'} px-3 py-1 rounded-full`}>
          {category}
        </span>
      </CardContent>
    </Card>
  );
}
