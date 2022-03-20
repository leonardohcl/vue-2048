<template>
  <ul class="robot-factory-list" v-if="list.length > 0">
    <RobotFactoryListItem
      v-for="factory in list"
      :key="factory.id"
      :factory="factory"
      :event-target="eventTarget || $option.name"
      :disable-actions="disableActions"
    />
  </ul>
  <ul class="robot-factory-list" v-else>
    <li class="text-center">
      No Robots Available
    </li>
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
      disableActions: Boolean
    },
  };
</script>

<style lang="scss" scoped>
  .robot-factory-list {
    padding: 0;
    list-style: none;
  }
</style>
