<template>
  <ul class="robot-factory-list">
    <RobotFactoryListItem
      v-for="factory in list"
      :key="factory.id"
      :factory="factory"
      :event-target="eventTarget || $option.name"
    />
  </ul>
</template>

<script>
  import RobotFactoryListItem from "@/components/atoms/RobotFactoryListItem.vue";
  export default {
    components: { RobotFactoryListItem },
    name: "RobotFactoryList",
    props: {
      list: { type: Array, required: true },
      eventTarget: { type: String },
    },
  };
</script>

<style lang="scss" scoped>
  .robot-factory-list {
    padding: 0;
  }
</style>
