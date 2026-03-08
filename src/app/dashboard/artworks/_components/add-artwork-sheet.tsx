'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateArtworkDescription } from '@/ai/flows/generate-artwork-description-flow';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const artworkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  category: z.string().min(1, 'Please select a category'),
  status: z.enum(['available', 'sold']),
  image: z.any().refine(files => files?.length > 0, 'Image is required.'),
  // Fields for AI generation
  medium: z.string().optional(),
  style: z.string().optional(),
  inspiration: z.string().optional(),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

export default function AddArtworkSheet({ children, artistName }: { children: React.ReactNode, artistName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      status: 'available',
    },
  });

  const onSubmit = (data: ArtworkFormValues) => {
    // In a real app, you would upload the image to Supabase storage
    // and then save the artwork data with the image URL to the database.
    console.log(data);
    toast({
        title: "Artwork Submitted",
        description: `${data.title} has been successfully submitted for review.`,
    });
    setIsOpen(false);
    form.reset();
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const { title, medium, style, inspiration } = form.getValues();
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
        form.setValue('description', result.description, { shouldValidate: true });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Add New Artwork</SheetTitle>
              <SheetDescription>
                Fill in the details of your new piece to add it to the marketplace.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4 overflow-y-auto pr-6 h-[calc(100vh-150px)]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Kalahari Sunset'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artwork Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (BWP)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 15000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Painting">Painting</SelectItem>
                                <SelectItem value="Sculpture">Sculpture</SelectItem>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>

              <div className="p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-semibold mb-2">AI Description Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">Provide some optional details and let AI help you write a compelling description.</p>
                <div className="space-y-4">
                    <FormField control={form.control} name="style" render={({ field }) => (
                      <FormItem><FormLabel>Artistic Style</FormLabel><FormControl><Input placeholder="e.g., 'Contemporary wildlife painting'" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="medium" render={({ field }) => (
                      <FormItem><FormLabel>Medium</FormLabel><FormControl><Input placeholder="e.g., 'Oil on canvas'" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="inspiration" render={({ field }) => (
                      <FormItem><FormLabel>Inspiration/Story</FormLabel><FormControl><Textarea placeholder="The story behind this piece..." {...field} /></FormControl></FormItem>
                    )} />
                </div>
              </div>

               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Description</FormLabel>
                        <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                            <Wand2 className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </Button>
                    </div>
                    <FormControl>
                      <Textarea placeholder="Describe your artwork..." rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="mt-4 border-t pt-4">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Artwork'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
