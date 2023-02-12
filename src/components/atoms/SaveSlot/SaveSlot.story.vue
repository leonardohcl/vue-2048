<template>
  <Story group="atoms" :layout="{ type: 'grid', width: '400px' }">
    <Variant title="Empty">
      <SaveSlot
        :slot-name="state.slotName"
        :mode="state.mode"
        @select="handleSelect"
      />
      <template #controls>
        <HstText title="Slot name" v-model="state.slotName" />
        <HstButtonGroup
          title="Memory mode"
          v-model="state.mode"
          :options="['save', 'load']"
        />
        <HstButtonGroup
          title="Theme"
          v-model="state.theme"
          :options="['primary', 'secondary']"
        />
      </template>
    </Variant>
    <Variant title="Standard">
      <SaveSlot
        :save="standardSave"
        :slot-name="state.slotName"
        :mode="state.mode"
        @select="handleSelect"
      />
      <template #controls>
        <HstText title="Slot name" v-model="state.slotName" />
        <HstButtonGroup
          title="Memory mode"
          v-model="state.mode"
          :options="['save', 'load']"
        />
        <HstButtonGroup
          title="Theme"
          v-model="state.theme"
          :options="['primary', 'secondary']"
        />
        <HstNumber title="Score" v-model="standardSave.progress.score" />
        <HstNumber title="Block" v-model="standardSave.progress.highestBlock" />
        <HstNumber
          title="Width"
          max="8"
          min="3"
          v-model="standardSave.settings.width"
        />
        <HstNumber
          title="Height"
          max="8"
          min="3"
          v-model="standardSave.settings.height"
        />
      </template>
    </Variant>
    <Variant title="Roguelike">
      <SaveSlot
        :save="roguelikeSave"
        :slot-name="state.slotName"
        :mode="state.mode"
        @select="handleSelect"
      />
      <template #controls>
        <HstText title="Slot name" v-model="state.slotName" />
        <HstButtonGroup
          title="Memory mode"
          v-model="state.mode"
          :options="['save', 'load']"
        />
        <HstButtonGroup
          title="Theme"
          v-model="state.theme"
          :options="['primary', 'secondary']"
        />
        <HstNumber title="Score" v-model="roguelikeSave.progress.score" />
        <HstNumber
          title="Block"
          v-model="roguelikeSave.progress.highestBlock"
        />
        <HstNumber title="Run" v-model="roguelikeSave.progress.run" />
        <HstNumber title="Coins" v-model="roguelikeSave.inventory.coins" />
        <HstNumber
          title="Width"
          max="8"
          min="3"
          v-model="roguelikeSave.settings.width"
        />
        <HstNumber
          title="Height"
          max="8"
          min="3"
          v-model="roguelikeSave.settings.height"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import GameController from "@/model/2048 Standard/GameController";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import { logEvent } from "histoire/client";
import SaveSlot from "./SaveSlot.vue";
import { reactive } from "vue";

const state = reactive({
  slotName: "slotname",
  mode: "load",
  theme: "primary",
});

const roguelikeSave = reactive(new RoguelikeGameController().getSaveFile());
const standardSave = reactive(new GameController().getSaveFile());

function handleSelect(slot: string) {
  logEvent("select", { emmited: slot });
}
</script>
