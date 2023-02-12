<template>
  <v-card :id="id" class="dialog-box" v-bind="dialog">
    <v-card-text v-html="dialog.content" />
    <v-card-actions v-if="actions.length" class="dialog-box__actions">
      <v-btn
        v-for="btn in actions"
        class="justify-end"
        v-bind="btn"
        @click="btn.action ? btn.action({...dialog}) : null"
      >
        {{ btn.title }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Square from "../Square/Square.vue";
import { defineComponent } from "vue";
import DialogBoxConfig from "./model/DialogBoxConfig";
import DialogBoxAction from "./model/DialogBoxAction";

export default defineComponent({
  components: { Square },
  props: {
    id: { type: String, default: "" },
    dialog: { type: DialogBoxConfig, required: true },
    actions: { type: Array<DialogBoxAction>, default: () => [] },
  },
});
</script>

<style lang="scss">
.dialog-box {
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
