'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateArtworkDescription } from '@/ai/flows/generate-artwork-description-flow';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addArtwork } from '../actions';
import { Label } from '@/components/ui/label';

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

export default function AddArtworkSheet({ children, artistName }: { children: React.ReactNode, artistName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const initialState = { message: '', type: 'idle' as const };
  const [state, dispatch] = useFormState(addArtwork, initialState);
  
  // Local state for description to allow AI generation before form submission
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: "Success", description: state.message });
      setIsOpen(false);
    } else if (state.type === 'error') {
      toast({ variant: 'destructive', title: "Error", description: state.message });
    }
  }, [state, toast]);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const form = document.querySelector('form');
    if (!form) return;

    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const medium = formData.get('medium') as string;
    const style = formData.get('style') as string;
    const inspiration = formData.get('inspiration') as string;

    if (!title) {
        toast({
            variant: "destructive",
            title: "Title is required",
            description: "Please enter a title before generating a description.",
        });
        setIsGenerating(false);
        return;
    }

    try {
        const result = await generateArtworkDescription({
            title,
            artistName: artistName,
            medium: medium || 'Not specified',
            style: style || 'Not specified',
            inspiration,
        });
        setDescription(result.description);
        toast({
            title: "Description Generated!",
            description: "The AI has crafted a new description for your artwork.",
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate a description. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-2xl w-full">
          <form action={dispatch}>
            <SheetHeader>
              <SheetTitle>Add New Artwork</SheetTitle>
              <SheetDescription>
                Fill in the details of your new piece to add it to the marketplace.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4 overflow-y-auto pr-6 h-[calc(100vh-150px)]">
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
                    <Input id="price" name="price" type="number" placeholder="e.g., 15000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Painting">Painting</SelectItem>
                            <SelectItem value="Sculpture">Sculpture</SelectItem>
                            <SelectItem value="Photography">Photography</SelectItem>
                            <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-semibold mb-2">AI Description Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">Provide some optional details and let AI help you write a compelling description.</p>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="style">Artistic Style</Label>
                        <Input id="style" name="style" placeholder="e.g., 'Contemporary wildlife painting'" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="medium">Medium</Label>
                        <Input id="medium" name="medium" placeholder="e.g., 'Oil on canvas'" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="inspiration">Inspiration/Story</Label>
                        <Textarea id="inspiration" name="inspiration" placeholder="The story behind this piece..." />
                    </div>
                </div>
              </div>

               <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="description">Description</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                            <Wand2 className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </Button>
                    </div>
                    <Textarea id="description" name="description" placeholder="Describe your artwork..." rows={8} required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="available" required>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="mt-4 border-t pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <SubmitButton />
            </SheetFooter>
          </form>
      </SheetContent>
    </Sheet>
  );
}
