import specterProImage from '../assets/specterpro.jpg'

export const gearItems = [
  { id: 'laptop', name: 'Acer Nitro V15', detail: 'Laptop', image: '/images/anv15.webp' },
  { id: 'monitor', name: 'SpecterPro 27GX', detail: 'Monitor', image: specterProImage },
  { id: 'phone', name: 'Vivo Y35', detail: 'Phone', image: '/images/vivoy35.png' },
  { id: 'keyboard', name: 'Redragon Lakshmi', detail: 'Keyboard', image: '/images/lakshmi.jpg' },
  { id: 'mouse', name: 'Razer Cobra', detail: 'Mouse', image: '/images/mouse.webp' },
  { id: 'earphone', name: 'Moondrop CHU', detail: 'Earphone', image: '/images/moondrop.webp' },
] as const

export type GearId = (typeof gearItems)[number]['id']
