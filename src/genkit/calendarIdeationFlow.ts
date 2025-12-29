import { vertexAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [vertexAI()],
});

export const calendarIdeationFlow = ai.defineFlow(
    {
        name: 'calendarIdeationFlow',
        inputSchema: z.object({ theme: z.string() }),
        outputSchema: z.object({
            importantDates: z.array(
                z.object(
                    {
                        date: z.string(),
                        event: z.string(),
                    }
                )
            )
        }),
    },
    async ({ theme }) => {
        const { text } = await ai.generate({
            model: vertexAI.model('gemini-2.5-flash'),
            prompt: `Create a list of important dates for a ${theme} themed calendar.
                    Only return the valid JSON itself (no backticks or anything).`,
        });

        return { importantDates: JSON.parse(text) };
    }
);