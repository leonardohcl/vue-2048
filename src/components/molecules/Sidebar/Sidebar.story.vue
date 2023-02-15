<template>
  <Story group="molecules" auto-props-disabled>
    <div class="pa-5">
      <Sidebar
        :items="(items as Item[])"
        :coins="state.coins"
        :title="state.title"
        :allow-purchase="state.allowPurchase"
        :allow-use="state.allowUse"
        @use="handleUse"
        @cancel="handleCancel"
        @purchase="handlePurchase"
      />
    </div>

    <template #controls>
      <HstText title="Title" v-model="state.title" />
      <HstNumber title="Available Coins" v-model="state.coins" />
      <HstCheckbox title="Allow purchase" v-model="state.allowPurchase" />
      <HstCheckbox title="Allow use" v-model="state.allowUse" />
      <div class="htw-p-2" v-for="(item, idx) in itemConfig" :key="idx">
        <b>item #{{ idx + 1 }}</b>
        <HstText title="Name" v-model="item.name" />
        <HstText title="Icon" v-model="item.icon" />
        <HstNumber title="Capacity" v-model="item.capacity" min="1" />
        <HstNumber title="Quantity" v-model="item.quantity" min="0" />
        <HstNumber title="Price" v-model="item.price" />
      </div>
    </template>
  </Story>
</template>

<script lang="ts" setup>
  import Item from '@/model/Game utils/Item/Item'
  import Sidebar from './Sidebar.vue'

  import { reactive, computed, ref } from 'vue'
import { logEvent } from 'histoire/client';
  const state = reactive({
    coins: 0,
    allowPurchase: true,
    allowUse: false,
    title: 'Sidebar',
  })

  const itemConfig = ref(
    new Array(4).fill(0).map((_, idx) => ({
      id: `test${idx}`,
      icon: 'fas fa-fw fa-star',
      name: `Item ${idx}`,
      quantity: 0,
      capacity: 3,
      price: 100,
    }))
  )

  const items = computed(() =>
    itemConfig.value.map((config) => new Item(config))
  )

  function handleUse(data:any){
    logEvent('use', {emitted: data})
  }
  function handleCancel(data:any){
    logEvent('cancel', {emitted: data})
  }
  function handlePurchase(data:any){
    logEvent('purchase', {emitted: data})
  }
</script>
