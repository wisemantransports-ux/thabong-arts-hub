'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addArtwork } from '../actions';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : 'Save Artwork'}
        </Button>
    );
}

export default function AddArtworkForm({ artistId }: { artistId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const initialState = { message: '', type: 'idle' as const };
  const [state, dispatch] = useActionState(addArtwork, initialState);

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: "Success", description: state.message });
      router.push('/dashboard/artworks');
    } else if (state.type === 'error') {
      toast({ variant: 'destructive', title: "Error", description: state.message });
    }
  }, [state, toast, router]);
  
  return (
    <form action={dispatch}>
      <CardContent className="space-y-4">
        {/* Hidden artist ID */}
        <input type="hidden" name="artist_id" value={artistId} />

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="e.g., 'Kalahari Sunset'" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Artwork Image</Label>
          <Input id="image" name="image" type="file" accept="image/*" required />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (BWP)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 15000" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="draft" required>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
              </div>
        </div>

         <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your artwork..." rows={8} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <SubmitButton />
      </CardFooter>
    </form>
  );
}
