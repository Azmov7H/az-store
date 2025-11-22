
import Fetcher from '@/components/home/Fetcher';
import Hero from '@/components/home/Hero';

export default async function Home() {

  return (
    <main className="p-8">

      <Hero />
      <Fetcher />
    </main>
  );
}
