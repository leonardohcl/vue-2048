import { ITutorial } from '@/model/Game Utils/Tutorial'

const tutorial: ITutorial = {
  title: 'Rewards',
  routine: [
    {
      highlight: { x: 'center', y: 'center' },
      dialog: {
        content: 'At the end of each turn you are rewarded with coins',
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: 'center', horizontal: 'center' },
    },
    {
      dialog: {
        append: true,
        content:
          'You can use the coins to buy items and upgrades between turns',
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          'The amount of coins you earn is based on the board at the end of the turn',
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content: 'Higher blocks grants more coins',
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          'Empty squares grants as many coins as the highest possible block',
        config: {
          maxWidth: 300,
        },
        append: true,
      },
    },
    {
      dialog: {
        content:
          'Unless you ended the turn before winning or losing, then each empty square is worth only 0.5 coins',
        config: {
          maxWidth: 300,
        },
        append: true,
      },
    },
    {
      highlight: '.coins',
      highlightConfig: { padding: 10 },
      clearTextBeforeHighlight: true,
      dialog: {
        content: 'Here is how many coins you have at the moment',
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { horizontal: 'right-inset', vertical: 'bottom' },
    },
  ],
}

export default tutorial
