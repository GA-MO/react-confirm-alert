'use client'
import { Gallery, type GalleryItem } from '../gallery'
import { stylingExamples } from '../styling/gallery'
import { RoundButtons } from './round-buttons'

const tailwindOnly = stylingExamples.find((e) => e.id === 'tailwind-only')!

// Same order and anchors as the headings in content/docs/recipes/tailwind.mdx.
const tailwind: GalleryItem[] = [
  {
    id: 'default-css-plus-utilities',
    label: 'Default CSS plus utilities',
    change: 'classNames on top',
    Demo: RoundButtons,
    picture: {
      kind: 'confirm',
      title: 'Publish this post?',
      buttons: [{ label: 'Cancel' }, { label: 'Publish', variant: 'primary' }],
      classNames: { button: 'rounded-full px-4' },
    },
  },
  { ...tailwindOnly, change: 'unstyled + classNames' },
]

export function TailwindGallery() {
  return <Gallery items={tailwind} />
}
