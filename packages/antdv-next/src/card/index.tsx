import type { App } from 'vue'
import Card from './Card'
import CardGrid from './CardGrid'
import CardMeta from './CardMeta'

export type { CardEmits, CardProps, CardSize, CardSlots, CardTabListType } from './Card'

export type { CardGridProps, CardGridRef } from './CardGrid'
export type { CardMetaProps, CardMetaRef } from './CardMeta'

(Card as any).Grid = CardGrid;
(Card as any).Meta = CardMeta;
(Card as any).install = (app: App) => {
  app.component(Card.name, Card)
  app.component(CardGrid.name, CardGrid)
  app.component(CardMeta.name, CardMeta)
}

export {
  CardGrid,
  CardMeta,
}
export default Card
