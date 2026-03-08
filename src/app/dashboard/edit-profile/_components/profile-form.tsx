'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Artist } from '@/lib/types';
import { updateProfile } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : 'Save Changes'}
    </Button>
  );
}

export default function ProfileForm({ artist }: { artist: Artist }) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(artist.profile_image);

  const initialState = { message: '', type: 'idle' as const };
  const [state, dispatch] = useActionState(updateProfile, initialState);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (state.type === 'success' && state.message) {
      toast({
        title: "Success",
        description: state.message,
      });
    } else if (state.type === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: "Update Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your public artist information here. This will be visible on your profile page.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="profile-image-upload">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview ?? undefined} alt={artist.name} />
                <AvatarFallback>{artist.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input id="profile-image-upload" name="profile_image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={artist.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Cannot be changed)</Label>
              <Input id="email" name="email" type="email" value={artist.email} readOnly disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Profile URL Slug</Label>
            <Input id="slug" name="slug" defaultValue={artist.slug} required />
            <p className="text-sm text-muted-foreground">This creates your unique profile URL. Use lowercase letters, numbers, and hyphens.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp Phone Number</Label>
            <Input id="phone" name="phone" defaultValue={artist.phone} placeholder="Include country code, e.g., 267..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea id="bio" name="bio" defaultValue={artist.bio} rows={5} required minLength={20} />
            <p className="text-sm text-muted-foreground">A short biography of at least 20 characters to display on your public profile.</p>
          </div>
          
          <SubmitButton />
          
        </form>
      </CardContent>
    </Card>
  );
}
