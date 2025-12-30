'use client';

import { useState } from 'react';
import { runFlow } from '@genkit-ai/next/client';
import { calendarIdeationFlow } from '@/genkit/calendarIdeationFlow';

export default function Home() {
  const [result, setResult] = useState<string>('');

  async function getImportantDateCalendar(formData: FormData) {
    const theme = formData.get('theme')?.toString() ?? '';

    const result = await runFlow<typeof calendarIdeationFlow>({
      url: '/api/calendarIdeation',
      input: { theme },
    });

    setResult(JSON.stringify(result, null, 2));
  }

  return (
    <main>
      <form action={getImportantDateCalendar}>
        <label htmlFor="theme">Suggest important dates for a calendar with this theme: </label>
        <input type="text" name="theme" id="theme" />
        <br />
        <button type="submit">
          Generate
        </button>
      </form>
      <br />
      {result && (
        <div>
          <h3>Final Output:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </main>
  );
}