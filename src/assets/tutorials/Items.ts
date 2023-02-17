import { BreakBlock } from '@/model/Game Utils/Item/Consumable/BreakBlock'
import { MoveBlock } from '@/model/Game Utils/Item/Consumable/MoveBlock'
import { ShrinkBlock } from '@/model/Game Utils/Item/Consumable/ShrinkBlock'
import { UpgradeBlock } from '@/model/Game Utils/Item/Consumable/UpgradeBlock'
import { Consumable } from '@/model/Game Utils/Item/ConsumableItem'
import { FreezeBlock } from '@/model/Game Utils/item/Consumable/FreezeBlock'
import { ITutorial } from '@/model/Game Utils/Tutorial'

const ItemsTutorial: ITutorial = {
  title: 'Items',
  routine: [
    {
      highlight: '.inventory',
      highlightConfig: { padding: 10 },
      clearTextBeforeHighlight: true,
      dialog: {
        content:
          'Items can be used during a turn to make sure you can go further',
        config: {
          maxWidth: 250,
        },
      },
      dialogPosition: { vertical: 'top-inset', horizontal: 'right' },
    },
    {
      dialog: {
        content: 'If you have an item, just click on its icon to use it',
        config: { maxWidth: 200 },
      },
    },
    {
      dialog: {
        append: true,
        content:
          'The board will highlight the squares in which the item can be used',
        config: { maxWidth: 200 },
      },
    },
    {
      dialog: {
        append: true,
        content:
          'Clicking on the square that you want to use the item will activate its effect',
        config: { maxWidth: 200 },
      },
    },
    {
      dialog: {
        content: 'Each item changes the board in a different way',
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Consumable.BreakBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new BreakBlock().name
        }</b> removes a block from the board`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Consumable.UpgradeBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new UpgradeBlock().name
        }</b> increases the value of the block`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Consumable.ShrinkBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new ShrinkBlock().name
        }</b> decreases the value of the block`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Consumable.MoveBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new MoveBlock().name
        }</b> moves a block to an empty square or switch places with another block`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Consumable.FreezeBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new FreezeBlock().name
        }</b> will freeze the block in place so it won't move on your next play`,
        config: { maxWidth: 200 },
      },
    },
  ],
}

export default ItemsTutorial
