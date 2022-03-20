<template>
  <Modal :id="id" :title="title">
    <RobotFactoryList
      :list="factories"
      :event-target="$options.name"
      :disable-actions="disableActions"
    />
    <template v-slot:footer>
      <div class="text-center">
        <Btn size="sm" outlined theme="plain" tag="router-link" to="robot-lab">
          <FontAwesomeIcon icon="fa-user-secret" />
        </Btn>
      </div>
    </template>
  </Modal>
</template>

<script>
  import Modal from "@/components/atoms/Modal.vue";
  import Btn from "@/components/atoms/Btn.vue";
  import RobotFactoryList from "@/components//molecules/RobotFactoryList.vue";
  import { mapGetters } from "vuex";

  export default {
    components: { Modal, RobotFactoryList, Btn },
    name: "RobotFactoryModal",
    props: {
      id: { type: String, default: "factory-modal" },
      title: { type: String, default: "Select a Robot" },
      disableActions: Boolean,
      grantAccessToLab: Boolean,
    },
    computed: {
      ...mapGetters("robots", ["getFactory", "factories"]),
    },
  };
</script>
