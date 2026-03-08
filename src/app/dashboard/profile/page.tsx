'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileForm from './_components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Artist } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyProfilePage() {
    const router = useRouter();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const getArtist = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: artistData, error } = await supabase
                .from('artists')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching artist profile:', error.message);
            }
            
            if (artistData) {
                setArtist(artistData);
            }
            setLoading(false);
        };
        getArtist();
    }, [router]);
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Loading your profile...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-10 w-56" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-24 w-full" />
                        </div>

                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!artist) {
       return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Not Found</CardTitle>
                    <CardDescription>
                        We couldn't find an artist profile associated with your account. 
                        Please contact support if you believe this is an error.
                    </CardDescription>
                </CardHeader>
            </Card>
       )
    }

    return <ProfileForm artist={artist} />;
}
