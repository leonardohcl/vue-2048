<template>
  <v-dialog
    class="ranking-modal"
    max-height="800"
    max-width="600"
    v-model="isOpen"
    transition="slide-y-transition"
  >
    <v-card title="Ranking" prepend-icon="fas fa-fw fa-ranking-star">
      <v-card-text>
        <RankingEntry
          v-for="(entry, idx) in ranking"
          :key="idx"
          :position="idx + 1"
          :entry="entry"
          :with-board="withBoard"
          :with-run="withRun"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import RankingEntry from "@/components/atoms/RankingEntry.vue";
import { useStore } from "vuex";
import { computed, defineComponent } from "vue";
import useDialogCommands from "@/composables/dialogCommands";

export default defineComponent({
  components: { RankingEntry },
  props: {
    rankingId: { type: String, required: true },
    withRun: {
      type: Boolean,
      default: false,
    },
    withBoard: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const ranking = computed(() => store.getters.ranking(props.rankingId));

    return { ranking, ...useDialogCommands() };
  },
});
</script>

<style lang="scss">
.ranking-modal {
  &--table {
    max-width: 100%;
    text-align: center;
    thead {
      font-weight: bold;
    }

    .truncated-field {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 90px;
    }
  }

  &--square {
    margin: 0 auto;
  }
}
</style>
