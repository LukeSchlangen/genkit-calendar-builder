import { vertexAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [vertexAI()],
});

export const menuSuggestionFlow = ai.defineFlow(
    {
        name: 'menuSuggestionFlow',
        inputSchema: z.object({ theme: z.string() }),
        outputSchema: z.object({ menuItem: z.string() }),
        streamSchema: z.string(),
    },
    async ({ theme }, { sendChunk }) => {
        const { stream, response } = ai.generateStream({
            model: vertexAI.model('gemini-2.5-flash'),
            prompt: `Invent a layout for a ${theme} themed calendar.
                    Your plan should be a markdown table with important
                    dates with what event happened on that date.`,
        });

        for await (const chunk of stream) {
            sendChunk(chunk.text);
        }

        const { text } = await response;
        return { menuItem: text };
    }
);