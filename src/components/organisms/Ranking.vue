<template>
  <div class="ranking">
    <v-btn v-bind="buttonAttrs" @click="rankingModal.open()" />

    <RankingModal
      :ranking-id="rankingId"
      :with-board="withBoard"
      :with-run="withRun"
      ref="rankingModal"
    />
  </div>
</template>

<script>
import RankingModal from "@/components/molecules/RankingModal.vue";

import { computed, ref } from "vue";

export default {
  components: { RankingModal },
  props: {
    rankingId: { type: String, required: true },
    buttonOptions: {
      type: Object,
      default: () => ({}),
    },
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
    const buttonAttrs = computed(() => ({
      variant: "plain",
      prependIcon: "fas fa-fw fa-ranking-star",
      ...props.buttonOptions,
    }));

    const rankingModal = ref();

    return {
      buttonAttrs,
      rankingModal,
    };
  },
};
</script>

