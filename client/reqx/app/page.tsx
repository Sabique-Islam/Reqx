import Hero from './Pages/Hero/page';
import Navbar from './Pages/Navbar/page';
import Features from './Pages/Features/page';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}
