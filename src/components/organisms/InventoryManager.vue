<template>
  <Sidebar
    class="inventory"
    title="Items"
    :items="items"
    :disabled="!game.isRunning"
    :active-item="game.activeItem"
    :allow-purchase="!game.isRunning"
    :allow-use="game.isRunning"
    :coins="game.inventory.wallet.coins"
    @use="handleUse"
    @cancel="handleCancel"
    @purchase="handleBuy"
  />
</template>

<script lang="ts">
  import { computed, defineComponent, inject } from 'vue'
  import Sidebar from '@/components/molecules/Sidebar/Sidebar.vue'
  import { BreakBlock } from '@/model/Game Utils/Item/Consumable/BreakBlock'
  import { UpgradeBlock } from '@/model/Game Utils/Item/Consumable/UpgradeBlock'
  import { ShrinkBlock } from '@/model/Game Utils/Item/Consumable/ShrinkBlock'
  import { MoveBlock } from '@/model/Game Utils/Item/Consumable/MoveBlock'
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import ConsumableItem from '@/model/Game Utils/Item/ConsumableItem'
  import { Highlighter } from '@/keys'
  import { FreezeBlock } from '@/model/Game Utils/Item/Consumable/FreezeBlock'

  export default defineComponent({
    components: { Sidebar },
    props: {
      game: { type: RoguelikeGameController, required: true },
    },
    setup(props) {
      const items = computed(() => {
        /**
         * These are the consumable items available for the current game design,
         *
         * Their prices take in consideration an average of 20 coins
         * per run in the early game and 40 coins in the late game
         **/
        const list = [
          new BreakBlock(),
          new UpgradeBlock(),
          new ShrinkBlock(),
          new MoveBlock(),
          new FreezeBlock(),
        ]

        return list.map((item) => props.game.inventory.bag[item.id])
      })

      const handleBuy = (item: ConsumableItem) => {
        props.game.inventory.buyItem(item)
        props.game.saveCurrent()
      }

      const highlighter = inject(Highlighter)

      const handleCancel = () => {
        props.game.deactivateItem()
        highlighter?.dismiss()
      }

      const handleUse = (item: ConsumableItem) => {
        props.game.activateItem(item)

        highlighter?.highlight('.board', {
          transitionDuration: 0,
          bgOpacity: 0,
          bgColor: 'transparent',
          bgCallbacks: [handleCancel],
        })
      }

      return {
        items,
        handleUse,
        handleBuy,
        handleCancel,
      }
    },
  })
</script>
