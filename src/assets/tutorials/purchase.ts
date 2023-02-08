import { ITutorial } from '@/model/Game Utils/Tutorial'

const PurchaseTutorial: ITutorial = {
  title: 'Purchase',
  routine: [
    {
      highlight: { x: 'center', y: 'center' },
      clearTextBeforeHighlight: true,
      dialog: {
        content: 'You can only buy items and upgrades between turns',
      },
      dialogPosition: { vertical: 'center', horizontal: 'center' },
    },
    {
      dialog: {
        append: true,
        content: 'The price of each item/upgrade is indicated bellow it',
      },
    },
    {
      dialog: {
        append: true,
        content:
          'If it is yellow, you can buy it by clicking the button with the price',
      },
    },
  ],
}

export default PurchaseTutorial
