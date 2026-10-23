'use client'
import { useState, type ReactNode } from 'react'

// A trigger for an example that returns the library's Promise, with what it resolved to beside it.
export function Try({ run, children }: { run: () => Promise<unknown>, children: ReactNode }) {
  const [result, setResult] = useState<string>()
  return (
    <div className="try">
      <button onClick={async () => setResult(JSON.stringify(await run()) ?? 'undefined')}>{children}</button>
      <output>{result && `→ ${result}`}</output>
    </div>
  )
}
