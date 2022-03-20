<template>
  <Modal :id="id" :title="title">
    <RobotFactoryList :list="factories" :event-target="$options.name"/>
  </Modal>
</template>

<script>
  import Modal from "@/components/atoms/Modal.vue";
  import RobotFactoryList from "@/components//molecules/RobotFactoryList.vue";
  import { mapGetters } from "vuex";

  export default {
    components: { Modal, RobotFactoryList },
    name: "RobotFactoryModal",
    props: {
      id: { type: String, default: "factory-modal" },
      title: { type: String, default: "Select a Robot" },
    },
    computed: {
      ...mapGetters("robots", ["getFactory", "factories"]),
    },
  };
</script>
