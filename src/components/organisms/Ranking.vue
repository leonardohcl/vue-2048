<template>
  <div class="ranking">
    <Btn v-bind="buttonAttrs" v-b-modal="`${id}-ranking`" />

    <RankingModal
      :id="`${id}-ranking`"
      :ranking-id="rankingId"
      :with-board="withBoard"
      :with-run="withRun"
    />
  </div>
</template>

<script>
  import RankingModal from '@/components/molecules/RankingModal.vue'
  import Btn from '@/components/atoms/Btn.vue'

  import { computed } from 'vue'

  export default {
    components: { RankingModal, Btn },
    props: {
      rankingId: { type: String, required: true },
      id: { type: String, default: 'main-game' },
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
        theme: 'plain',
        isIcon: true,
        icon: 'ranking-star',
        outlined: true,
        ...props.buttonOptions,
      }))

      return {
        buttonAttrs,
      }
    },
  }
</script>

