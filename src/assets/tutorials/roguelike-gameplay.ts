import { ITutorial } from '@/model/Game Utils/Tutorial'

const RoguelikeGameplayTutorial: ITutorial = {
  title: 'Rules',
  routine: [
    {
      highlight: { x: 'center', y: 'center' },
      dialog: {
        content:
          '2048 is a puzzle game where the objective is to slide blocks on a grid to combine them and create a block with the number 2048.',
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: 'center', horizontal: 'center' },
    },
    {
      dialog: {
        content:
          'However, this is a twist on the original game to make it more like a roguelike game',
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          'Roguelike games are turn-based games that at the the end of each turn you can start-over',
      },
    },
    {
      dialog: {
        content:
          'Between turns you can buy items and upgrades to go even further on the next turn',
        append: true,
      },
    },
    {
      dialog: {
        content:
          'Each turn you must slide blocks on the board to combine them and create blocks with higher value',
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: 'center', horizontal: 'center' },
    },
    {
      dialog: {
        content:
          'The game board is a grid with blocks of different numbers. You can slide the blocks up, down, left, or right to combine them.',
        append: true,
          config: {
          maxWidth: 300,
        },
      },
    },
    {
      highlight: { x: 'center', y: 'center' },
      dialog: {
        content:
          'When you move the blocks, they will slide in that direction until they hit either a wall or another block.',
        append: true,
        config: {
          maxWidth: 300,
        },
      },
      dialogPosition: { vertical: 'center', horizontal: 'center' },
    },
    {
      dialog: {
        content:
          'When two blocks with the same number touch, they merge into a single block with the combined value.',
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          'You win the turn the if you can keep merging blocks until you reach the final block.',
        config: {
          maxWidth: 300,
        },
      },
    },
    {
      dialog: {
        content:
          'The turn is over when you can no longer move the blocks and there are no more possible combinations.',
        append: true,
        config: {
          maxWidth: 300,
        },
      },
    },
  ],
}

export default RoguelikeGameplayTutorial
