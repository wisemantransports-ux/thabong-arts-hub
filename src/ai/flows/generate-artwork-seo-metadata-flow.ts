'use server';
/**
 * @fileOverview A Genkit flow for generating SEO-optimized titles and meta descriptions for artworks.
 *
 * - generateArtworkSeoMetadata - A function that handles the generation of SEO metadata.
 * - GenerateArtworkSeoMetadataInput - The input type for the generateArtworkSeoMetadata function.
 * - GenerateArtworkSeoMetadataOutput - The return type for the generateArtworkSeoMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtworkSeoMetadataInputSchema = z.object({
  artworkTitle: z.string().describe('The title of the artwork.'),
  artworkDescription: z.string().describe('A detailed description of the artwork.'),
  artistName: z.string().describe('The name of the artist who created the artwork.'),
  artworkCategory: z.string().describe('The category of the artwork (e.g., painting, sculpture, photography).'),
  artworkPrice: z.number().optional().describe('The price of the artwork, if available.'),
});
export type GenerateArtworkSeoMetadataInput = z.infer<typeof GenerateArtworkSeoMetadataInputSchema>;

const GenerateArtworkSeoMetadataOutputSchema = z.object({
  seoTitle: z
    .string()
    .describe('An SEO-optimized title for the artwork, suitable for search engine results. Max 60 characters.'),
  metaDescription: z
    .string()
    .describe('An SEO-optimized meta description for the artwork, encouraging clicks. Max 160 characters.'),
});
export type GenerateArtworkSeoMetadataOutput = z.infer<typeof GenerateArtworkSeoMetadataOutputSchema>;

export async function generateArtworkSeoMetadata(
  input: GenerateArtworkSeoMetadataInput
): Promise<GenerateArtworkSeoMetadataOutput> {
  return generateArtworkSeoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtworkSeoMetadataPrompt',
  input: {schema: GenerateArtworkSeoMetadataInputSchema},
  output: {schema: GenerateArtworkSeoMetadataOutputSchema},
  prompt: `You are an expert SEO content creator specializing in art marketplaces. Your task is to generate an SEO-optimized title and meta description for an artwork.

The title should be concise, compelling, and include the artwork name, artist name, and relevant keywords (e.g., 'African Art', 'Original Painting'). It should be no more than 60 characters.

The meta description should be engaging, around 150-160 characters, and encourage clicks, incorporating relevant keywords from the artwork details.

Artwork Details:
Title: {{{artworkTitle}}}
Description: {{{artworkDescription}}}
Artist: {{{artistName}}}
Category: {{{artworkCategory}}}
{{#if artworkPrice}}
Price: {{{artworkPrice}}}
{{/if}}

Generate the output in JSON format as described by the output schema.`,
});

const generateArtworkSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateArtworkSeoMetadataFlow',
    inputSchema: GenerateArtworkSeoMetadataInputSchema,
    outputSchema: GenerateArtworkSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate SEO metadata.');
    }
    return output;
  }
);
