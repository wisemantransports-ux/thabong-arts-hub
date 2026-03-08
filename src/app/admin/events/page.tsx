import { getEvents } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default async function AdminEventsPage() {
    const events = await getEvents();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Events</CardTitle>
                    <CardDescription>A list of all past and upcoming events.</CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => {
                            const isUpcoming = new Date(event.event_date) >= new Date();
                            return (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>
                                    <Badge variant={isUpcoming ? 'default' : 'outline'}>
                                        {isUpcoming ? 'Upcoming' : 'Past'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
