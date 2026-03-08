'use server';
/**
 * @fileOverview An AI assistant for generating compelling artwork descriptions.
 *
 * - generateArtworkDescription - A function that handles the artwork description generation process.
 * - GenerateArtworkDescriptionInput - The input type for the generateArtworkDescription function.
 * - GenerateArtworkDescriptionOutput - The return type for the generateArtworkDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtworkDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the artwork.'),
  artistName: z.string().describe('The name of the artist.'),
  medium: z.string().describe('The medium and materials used for the artwork (e.g., "Oil on canvas", "Bronze sculpture").'),
  style: z.string().describe('The artistic style of the artwork (e.g., "Abstract Expressionism", "Realism", "Contemporary wildlife painting").'),
  inspiration: z.string().optional().describe('The inspiration or story behind the artwork.'),
  keywords: z.array(z.string()).optional().describe('A list of keywords describing the artwork, its themes, or subject matter.'),
});
export type GenerateArtworkDescriptionInput = z.infer<typeof GenerateArtworkDescriptionInputSchema>;

const GenerateArtworkDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed description for the artwork.'),
});
export type GenerateArtworkDescriptionOutput = z.infer<typeof GenerateArtworkDescriptionOutputSchema>;

export async function generateArtworkDescription(input: GenerateArtworkDescriptionInput): Promise<GenerateArtworkDescriptionOutput> {
  return generateArtworkDescriptionFlow(input);
}

const generateArtworkDescriptionPrompt = ai.definePrompt({
  name: 'generateArtworkDescriptionPrompt',
  input: {schema: GenerateArtworkDescriptionInputSchema},
  output: {schema: GenerateArtworkDescriptionOutputSchema},
  prompt: `You are an expert art curator and marketer. Your goal is to create a compelling, detailed, and attractive description for an artwork that will appeal to potential buyers and art enthusiasts.\n\nConsider the following details about the artwork:\n\nTitle: "{{title}}"\nArtist: "{{artistName}}"\nMedium: "{{medium}}"\nStyle: "{{style}}"\n{{#if inspiration}}Inspiration: "{{inspiration}}"{{/if}}\n{{#if keywords}}Keywords: {{#each keywords}} "{{this}}"{{/each}}{{/if}}\n\nCraft a description that highlights the artwork's unique qualities, emotional impact, and artistic significance. Make it engaging and informative, suitable for a gallery website or catalog. The description should be between 150 and 300 words.\n`,
});

const generateArtworkDescriptionFlow = ai.defineFlow(
  {
    name: 'generateArtworkDescriptionFlow',
    inputSchema: GenerateArtworkDescriptionInputSchema,
    outputSchema: GenerateArtworkDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateArtworkDescriptionPrompt(input);
    return output!;
  }
);
