'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { useRouter } from 'next/navigation';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Artist } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  bio: z.string().min(20, 'Biography should be at least 20 characters long'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm({ artist }: { artist: Artist }) {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: artist.name,
            phone: artist.phone,
            bio: artist.bio,
        },
    });
    
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        const supabase = createClient();
        
        const { error } = await supabase
            .from('artists')
            .update({
                name: data.name,
                phone: data.phone,
                bio: data.bio
            })
            .eq('id', artist.id);

        if (error) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: error.message,
            });
        } else {
            toast({
                title: "Profile Updated",
                description: "Your public profile has been successfully updated.",
            });
            // Refresh server components
            router.refresh();
        }
        setIsSubmitting(false);
    };
    
    const [isUploading, setIsUploading] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = React.useState(artist.profile_image);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${artist.user_id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(filePath, file);

        if (uploadError) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: uploadError.message });
            setIsUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('artworks')
            .getPublicUrl(filePath);

        const { error: updateError } = await supabase
            .from('artists')
            .update({ profile_image: publicUrl })
            .eq('id', artist.id);
        
        if (updateError) {
            toast({ variant: 'destructive', title: 'Update Failed', description: updateError.message });
        } else {
            setAvatarUrl(publicUrl);
            toast({ title: 'Image Updated', description: 'Your profile picture has been changed.' });
            router.refresh();
        }

        setIsUploading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your public information here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                         <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarUrl} alt={artist.name}/>
                                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                            </div>
                        </FormItem>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <Input type="email" value={artist.email} readOnly disabled />
                            </FormItem>
                        </div>
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>WhatsApp Phone Number</FormLabel><FormControl><Input placeholder="Include country code, e.g., 267..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
