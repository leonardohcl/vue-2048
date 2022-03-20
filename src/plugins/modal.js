import Vue from "vue";

const eventBus = new Vue();

export default {
  install(Vue) {
    if (Vue.prototype.$modal) return;
    Vue.prototype.$modal = {
      events: eventBus,
      open(id) {
        this.events.$emit("open", id);
      },
      close(id) {
        this.events.$emit("close", id);
      },
    };
  },
};
