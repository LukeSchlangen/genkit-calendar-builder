import { vertexAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [vertexAI()],
});

const ImportantDatesInputSchema = ai.defineSchema('ImportantDatesInputSchema', z.object({ theme: z.string() }));

const ImportantDatesOutputSchema = ai.defineSchema('ImportantDatesOutputSchema', z.array(
    z.object({
        date: z.string(),
        event: z.string(),
    })
));

const ImportantDatesPrompt = ai.prompt<
    z.ZodTypeAny, // Input schema
    typeof ImportantDatesOutputSchema, // Output schema
    z.ZodTypeAny // Custom options schema
>('calendar-ideation');


export const calendarIdeationFlow = ai.defineFlow(
    {
        name: 'calendarIdeationFlow',
        inputSchema: ImportantDatesInputSchema,
        outputSchema: ImportantDatesOutputSchema,
    },
    async ({ theme }) => {
        const { text } = await ImportantDatesPrompt({ theme });

        return JSON.parse(text);
    }
);