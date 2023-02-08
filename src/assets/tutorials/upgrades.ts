import MemoryCapacityUpgrade from '@/model/Game Utils/Item/Upgrade/MemoryCapacity'
import { Upgrade } from '@/model/Game Utils/Item/Upgrade/Upgrade'
import WidthUpgrade from '@/model/Game Utils/Item/Upgrade/Width'
import WinningBlockUpgrade from '@/model/Game Utils/Item/Upgrade/WinningBlocks'
import { ITutorial } from '@/model/Game Utils/Tutorial'

const tutorial: ITutorial = {
  title: 'Upgrades',
  routine: [
    {
      highlight: '.upgrade-shop',
      highlightConfig: { padding: 10 },
      dialog: {
        content: 'Upgrades affect the board of the game',
        config: { maxWidth: 200 },
      },
      dialogPosition: { vertical: 'top-inset', horizontal: 'left' },
    },
    {
      dialog: {
        content: 'Buy upgrades so you can go even further each turn',
        config: { maxWidth: 200 },
        append: true,
      },
    },
    {
      highlight: `.sidebar-item__${Upgrade.WinningBlock}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new WinningBlockUpgrade().name
        }</b> upgrades the highest block you can reach in a turn`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Upgrade.MemoryCapacity}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new MemoryCapacityUpgrade().name
        }</b> updates the size of memory of the game`,
        config: { maxWidth: 200 },
      },
    },
    {
      dialog: {
        content: 'This will increase the maximum number of undos available',
        config: { maxWidth: 200 },
        append: true,
      },
    },
    {
      highlight: `.sidebar-item__${Upgrade.Width}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new WidthUpgrade().name
        }</b> will add another column to the board`,
        config: { maxWidth: 200 },
      },
    },
    {
      highlight: `.sidebar-item__${Upgrade.Height}`,
      clearTextBeforeHighlight: true,
      dialog: {
        content: `<b>${
          new WidthUpgrade().name
        }</b> will add another row to the board`,
        config: { maxWidth: 200 },
      },
    },
  ],
}

export default tutorial
