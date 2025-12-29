'use client';

import { useState } from 'react';
import { runFlow, streamFlow } from '@genkit-ai/next/client';
import { calendarIdeationFlow } from '@/genkit/calendarIdeationFlow';

export default function Home() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState<string>('');

  async function getMenuItem(formData: FormData) {
    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);

    try {
      // Regular (non-streaming) approach
      const result = await runFlow<typeof calendarIdeationFlow>({
        url: '/api/menuSuggestion',
        input: { theme },
      });

      setResult(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error generating menu item:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function streamMenuItem(formData: FormData) {
    const theme = formData.get('theme')?.toString() ?? '';
    setIsLoading(true);
    setStreamedText('');

    try {
      // Streaming approach
      const result = streamFlow<typeof calendarIdeationFlow>({
        url: '/api/menuSuggestion',
        input: { theme },
      });

      // Process the stream chunks as they arrive
      for await (const chunk of result.stream) {
        setStreamedText((prev) => prev + chunk);
      }

      // Get the final complete response
      const finalOutput: any = await result.output;
      setResult(JSON.stringify(finalOutput, null, 2));
    } catch (error) {
      console.error('Error streaming menu item:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <form action={getMenuItem}>
        <label htmlFor="theme">Suggest a menu item for a restaurant with this theme: </label>
        <input type="text" name="theme" id="theme" />
        <br />
        <br />
        <button type="submit" disabled={isLoading}>
          Generate
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget.form!);
            streamMenuItem(formData);
          }}
        >
          Stream Generation
        </button>
      </form>
      <br />

      {streamedText && (
        <div>
          <h3>Streaming Output:</h3>
          <pre>{streamedText}</pre>
        </div>
      )}

      {result && (
        <div>
          <h3>Final Output:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </main>
  );
}