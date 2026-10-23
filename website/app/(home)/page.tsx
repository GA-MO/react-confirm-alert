import { VariantA } from '@/components/variants/a'

// The owner picks a variant at /variants/a, /b or /c; until then the home page shows A.
export default function HomePage () {
  return <VariantA />
}
