'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Artist } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  bio: z.string().min(20, 'Biography should be at least 20 characters long'),
  profile_image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function MyProfilePage() {
    const { toast } = useToast();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        const supabase = createClient();
        async function fetchArtist() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: artistProfile, error } = await supabase
                    .from('artists')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching artist profile:', error.message);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Could not fetch your profile.',
                    });
                } else if (artistProfile) {
                    setArtist(artistProfile);
                    form.reset({
                        name: artistProfile.name,
                        email: artistProfile.email,
                        phone: artistProfile.phone,
                        bio: artistProfile.bio,
                    });
                }
            }
            setIsLoading(false);
        }
        fetchArtist();
    }, [form, toast]);

    const onSubmit = (data: ProfileFormValues) => {
        // In a real app, this would call supabase.from('artists').update(...)
        console.log("Updating profile:", data);
        toast({
            title: "Profile Updated",
            description: "Your public profile has been successfully updated.",
        });
    };
    
    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>My Profile</CardTitle><CardDescription>Loading your profile...</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!artist) {
        return <Card><CardHeader><CardTitle>Profile Not Found</CardTitle><CardDescription>We couldn't find an artist profile associated with your account.</CardDescription></CardHeader></Card>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your public information here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                         <FormField
                            control={form.control}
                            name="profile_image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={artist.profile_image} />
                                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} readOnly disabled /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>WhatsApp Phone Number</FormLabel><FormControl><Input placeholder="Include country code, e.g., 267..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
