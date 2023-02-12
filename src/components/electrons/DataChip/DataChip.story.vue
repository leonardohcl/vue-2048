<template>
  <Story  :layout="{type:'grid'}" group="electrons">
    <Variant v-for="theme in themes" :key="theme" :title="theme">
      <DataChip :theme="theme" :value="state.value" :chip-options="state.options" />
    </Variant>
    <template #controls>
        <HstText title="Value" v-model="state.value"/>
        <HstJson title="Options" v-model="state.options"/>
    </template>
  </Story>
</template>

<script setup>
import { reactive } from "vue";
import DataChip from "./DataChip.vue";
import THEMES from "./themes.json";

const themes = Object.getOwnPropertyNames(THEMES);

const state = reactive({ value: 0, options: {} });
</script>
