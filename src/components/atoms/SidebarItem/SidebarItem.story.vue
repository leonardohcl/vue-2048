<template>
  <Story group="atoms" :layout="{ type: 'grid' }" auto-props-disabled>
    <Variant title="Consumable">
      <div class="py-2">
        <SidebarItem
          :item="(item as Item)"
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
        <HstText title="Name" v-model="itemConfig.name" />
        <HstText title="Icon" v-model="itemConfig.icon" />
        <HstNumber title="Capacity" v-model="itemConfig.capacity" min="1" />
        <HstNumber title="Quantity" v-model="itemConfig.quantity" min="0" />
        <HstNumber title="Price" v-model="itemConfig.price" />
        <HstNumber title="Available coins" v-model="state.coins" />
        <HstCheckbox title="Allow using" v-model="state.allowUse" />
        <HstCheckbox title="Allow buying" v-model="state.allowPurchase" />
        <HstCheckbox title="Active" v-model="state.active" />
      </template>
    </Variant>
    <Variant title="Upgrade">
      <div class="py-2">
        <SidebarItem
          :item="(blockItem as Item)"
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
        <HstText title="Name" v-model="itemConfig.name" />
        <HstText title="Icon" v-model="itemConfig.icon" />
        <HstNumber title="Capacity" v-model="itemConfig.capacity" min="1" />
        <HstNumber title="Quantity" v-model="itemConfig.quantity" min="0" />
        <HstNumber title="Price" v-model="itemConfig.price" />
        <HstNumber title="Available coins" v-model="state.coins" />
        <HstCheckbox title="Allow using" v-model="state.allowUse" />
        <HstCheckbox title="Allow buying" v-model="state.allowPurchase" />
        <HstCheckbox title="Active" v-model="state.active" />
        <HstJson title="Price progression" v-model="itemConfig.priceProgression"/>
      </template>
    </Variant>
  </Story>
</template>
<script lang="ts" setup>
import { logEvent } from "histoire/client";
import SidebarItem from "./SidebarItem.vue";
import { reactive, computed } from "vue";
import Item from "@/model/Game utils/Item/Item";
import ConsumableItem, {
  Consumable,
} from "@/model/Game Utils/Item/ConsumableItem";
import UpgradeItem, { Upgrade } from "@/model/Game Utils/Item/Upgrade/Upgrade";
import WinningBlockUpgrade from "@/model/Game Utils/Item/Upgrade/WinningBlocks";

const itemConfig = reactive({
  icon: "fas fa-fw fa-star",
  name: "Sidebar Item",
  quantity: 0,
  capacity: 3,
  price: 0,
  priceProgression: [10, 20, 30],
});

const state = reactive({
  coins: 0,
  active: false,
  allowUse: false,
  allowPurchase: false,
});

const item = computed(
  () => new ConsumableItem({ ...itemConfig, id: Consumable.Generic })
);
const blockItem = computed(
  () =>
    new UpgradeItem({
      ...itemConfig,
      maxUses: itemConfig.capacity,
      id: Upgrade.Generic,
    })
);

function handleUse(data: any) {
  logEvent("use", { emmited: data });
}
function handleCancel(data: any) {
  logEvent("cancel", { emmited: data });
}
function handlePurchase(data: any) {
  logEvent("purchase", { emmited: data });
}
</script>
