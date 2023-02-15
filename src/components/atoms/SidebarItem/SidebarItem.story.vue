<template>
  <Story group="atoms" :layout="{ type: 'grid' }" auto-props-disabled>
    <div class="py-2">
      <SidebarItem
        id="test"
        :name="state.name"
        :icon="state.icon"
        :capacity="state.capacity"
        :quantity="state.quantity"
        :enough-coins="state.coins >= state.price"
        :price="state.price"
        :block-icon="state.blockIcon"
        :coins="state.coins"
        :active="state.active"
        :allow-purchase="state.allowPurchase"
        :allow-use="state.allowUse"
        @use="handleUse"
        @cancel="handleCancel"
        @purchase="handlePurchase"
      />
    </div>
    <template #controls>
      <HstText title="Name" v-model="state.name" />
      <HstText title="Icon" v-model="state.icon" />
      <HstNumber title="Block" v-model="state.blockIcon"/>
      <HstNumber title="Capacity" v-model="state.capacity" min="1" />
      <HstNumber title="Quantity" v-model="state.quantity" min="0" />
      <HstNumber title="Price" v-model="state.price" />
      <HstNumber title="Available coins" v-model="state.coins" />
      <HstCheckbox title="Allow using" v-model="state.allowUse" />
      <HstCheckbox title="Allow buying" v-model="state.allowPurchase" />
      <HstCheckbox title="Active" v-model="state.active" />
    </template>
  </Story>
</template>
<script lang="ts" setup>
  import { logEvent } from 'histoire/client'
  import SidebarItem from './SidebarItem.vue'
  import { reactive } from 'vue'

  const state = reactive({
    coins: 0,
    icon: 'fas fa-fw fa-star',
    name: 'Sidebar Item',
    quantity: 0,
    capacity: 3,
    price: 0,
    active: false,
    allowUse: false,
    allowPurchase: false,
    blockIcon: -1,
  })

  function handleUse(data: any) {
    logEvent('use', { emmited: data })
  }
  function handleCancel(data: any) {
    logEvent('cancel', { emmited: data })
  }
  function handlePurchase(data: any) {
    logEvent('purchase', { emmited: data })
  }
</script>
