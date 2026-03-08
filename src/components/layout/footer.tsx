import Link from 'next/link';
import { Palette, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">Thapong Visual Art Centre</span>
            </Link>
            <p className="text-sm text-muted-foreground">The heart of Botswana's art, connecting talent with the world.</p>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/artworks" className="text-sm text-muted-foreground hover:text-primary">Artworks</Link></li>
              <li><Link href="/artists" className="text-sm text-muted-foreground hover:text-primary">Artists</Link></li>
              <li><Link href="/events" className="text-sm text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/businesses" className="text-sm text-muted-foreground hover:text-primary">Businesses</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">Artist Login</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-primary">Artist Sign Up</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Thapong Visual Art Centre. Powered by Africa Arts Hub.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
