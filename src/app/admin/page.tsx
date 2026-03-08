import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getArtworks, getArtists, getBusinesses, getEvents } from '@/lib/data';
import { Paintbrush, User, Building, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage() {
    const artworks = await getArtworks();
    const artists = await getArtists();
    const businesses = await getBusinesses();
    const events = await getEvents();
    const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date());
    
    const totalArtworks = artworks.length;
    const totalArtists = artists.length;
    const totalBusinesses = businesses.length;
    const totalValue = artworks.reduce((sum, art) => sum + art.price, 0);

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
                    <Paintbrush className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalArtworks}</div>
                    <p className="text-xs text-muted-foreground">pieces on the platform</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalArtists}</div>
                    <p className="text-xs text-muted-foreground">registered artists</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Creative Businesses</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBusinesses}</div>
                    <p className="text-xs text-muted-foreground">businesses listed</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                     <p className="text-xs text-muted-foreground">events scheduled</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">BWP {totalValue.toLocaleString()}</div>
                     <p className="text-xs text-muted-foreground">total artwork value</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Artworks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                    <Link href="/admin/artworks">
                        <Paintbrush className="mr-2 h-4 w-4" /> View All Artworks
                    </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Artists</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                    <Link href="/admin/artists">
                        <User className="mr-2 h-4 w-4" /> View All Artists
                    </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
