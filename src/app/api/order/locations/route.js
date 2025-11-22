export async function GET() {
  const districts = {
    Cairo: [
      'Nasr City', 'Heliopolis', 'Maadi', 'Zamalek', 'Garden City',
      'Downtown', 'Dokki', 'Shubra', 'El Rehab', '6th of October (Cairo part)'
    ],
    Giza: [
      'Dokki', 'Mohandessin', '6th of October', 'Haram', 'Imbaba',
      'Agouza', 'Boulaq', 'Sheikh Zayed', '6th of October (Giza part)'
    ]
  };

  return Response.json(districts, { status: 200 });
}
