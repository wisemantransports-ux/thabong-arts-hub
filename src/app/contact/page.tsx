import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contact Us | Thapong Visual Art Centre',
  description: 'Get in touch with Thapong Visual Art Centre. Find our location, phone number, and email address.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Get In Touch</h1>
          <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you. Visit us or send a message.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mt-1 mr-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Thapong Visual Art Centre</p>
                    <p className="text-muted-foreground">Plot 126, Old Magistrate Court, Gaborone, Botswana</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-4 text-primary" />
                  <a href="tel:+2673913782" className="text-muted-foreground hover:text-primary">(+267) 391 3782</a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-4 text-primary" />
                  <a href="mailto:thapong@info.bw" className="text-muted-foreground hover:text-primary">thapong@info.bw</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" />
                    <Input type="email" placeholder="Your Email" />
                  </div>
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Your Message" rows={6} />
                  <Button type="submit" size="lg">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.679105151528!2d25.92383181501716!3d-24.65600398419515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebb5bfe636da69d%3A0x8192c4b4b889369!2sThapong%20Visual%20Arts%20Center!5e0!3m2!1sen!2sza!4v1683893699419!5m2!1sen!2sza"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </CardContent>
            </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
}
