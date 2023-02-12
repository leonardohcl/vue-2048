<template>
  <Story group="atoms" auto-props-disabled :layout="{type:'grid'}">
    <DialogBox :dialog="dialog" :actions="state.withActions ? actions : []" />
    <template #controls>
      <h3 class="d-block htw-p-2">Dialog</h3>
      <HstText title="Title" v-model="state.config.title" />
      <HstText title="Subtitle" v-model="state.config.subtitle" />
      <HstText title="Content" v-model="state.config.content" />
      <HstText title="Color" v-model="state.config.color" />
      <HstSelect
        title="Variant"
        v-model="state.config.variant"
        :options="['flat', 'elevated', 'tonal', 'outlined', 'text', 'plain']"
      />
      <HstCheckbox title="Flat" v-model="state.config.flat" />
      <HstText title="Max Width" v-model="state.config.maxWidth" />
      <HstText title="Max Height" v-model="state.config.maxHeight" />
      <h3 class="d-block htw-p-2">Button</h3>

      <HstCheckbox title="With Button(s)" v-model="state.withActions" />
      <div v-if="state.withActions">
        <HstText title="Button text" v-model="state.button.title" disbled/>
        <HstText title="Prepend icon" v-model="state.button.prependIcon" />
        <HstText title="Append icon" v-model="state.button.appendIcon" />
        <HstText title="Button Color" v-model="state.button.color" />
        <HstText title="Size" v-model="state.button.size" />
      </div>
    </template>
  </Story>
</template>

<script setup>
import { reactive, computed } from "vue";
import DialogBox from "./DialogBox.vue";
import DialogBoxConfig from "./model/DialogBoxConfig";
import DialogBoxAction from "./model/DialogBoxAction";

const state = reactive({
  withActions: false,
  config: {
    title: "",
    subtitle: "",
    content: "This is a dialog",
    color: "secondary",
    variant: "elevated",
    flat: false,
    maxWidth: "400px",
    maxHeight: "",
  },
  button: {
    title: "Click",
    appendIcon: "",
    prependIcon: "",
    color: "",
    size: "",
  },
});

const dialog = computed(() => new DialogBoxConfig(state.config));

const actions = computed(() => [
  new DialogBoxAction({
    ...state.button,
    action: () => {
      window.alert("Dialog action executed");
    },
  }),
]);
</script>
