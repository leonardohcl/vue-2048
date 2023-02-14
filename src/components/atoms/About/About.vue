<template>
  <v-card title="About" prepend-icon="fas fa-fw fa-circle-info">
    <v-card-text>
      <p class="mb-3">
        This game was developed as a study on the Vue framework, specifically
        Vue3 with composition API and typescript; game development and game
        design.
      </p>
      <p class="text-justify mb-4">
        You can find the full code for it on
        <a class="text-primary" href="https://github.com/leonardohcl/vue-2048">GitHub</a>
      </p>
      <p class="font-weight-thin font-italic">version {{ version }}</p>
      <slot />
    </v-card-text>
    <v-card-actions class="justify-end">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
let version: string;
try {
  version = APP_VERSION;
} catch {
  version = "unknown";
}
</script>
