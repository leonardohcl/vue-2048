<template>
  <li
    class="item"
    :class="{
      'item--empty': item.current <= 0,
      'item--active': active,
      'item--disabled': disabled && !active,
    }"
  >
    <div class="item__icon" @click="handleClick">
      <FontAwesomeIcon class="fa-2x" :icon="item.icon" fixed-width />
      <span class="badge badge-dark"> {{ item.current }}/{{ item.max }} </span>
    </div>
    <Btn
      v-if="!disabled && allowShopping && item.current < item.max"
      class="item__btn item__btn--purchase"
      icon="fa-plus-square"
      is-icon
      outlined
      @click="$emit('purchase', item.id)"
    />
    <Btn
      v-if="!disabled && active"
      class="item__btn item__btn--cancel"
      icon="fa-circle-xmark"
      is-icon
      outlined
      theme="danger"
      @click="$emit('cancel', item.id)"
    />
    <div class="item__details">
      {{ item.name }}
    </div>
  </li>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'

  export default {
    components: { Btn },
    props: {
      item: {
        type: Object,
        required: true,
        validate: (obj) => {
          if (!obj.id || !obj.name || !obj.max || !obj.current) return false
          return true
        },
      },
      active: {
        type: Boolean,
        default: false,
      },
      allowShopping: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['purchase'],
    setup(props, context) {
      const handleClick = (evt) => {
        if (!props.disabled) context.emit('click', evt)
      }

      return { handleClick }
    },
  }
</script>

<style lang="scss" scoped>
  .item {
    $container: &;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: relative;
    cursor: pointer;

    &__icon {
      color: $secondary;
      border-radius: 50%;
      padding: 1em;
      border: 3px solid $secondary;
      background-image: linear-gradient(
        45deg,
        fade-out($bg-secondary, 0.25) 0%,
        fade-out($secondary, 0.9) 100%
      );
      position: relative;
      .badge {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    &__btn {
      position: absolute;
      top: 0;
      &--purchase {
        right: 0;
      }
      &--cancel {
        left: 0;
      }
    }

    &__details {
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-break: none;
    }

    &--empty,
    &--disabled {
      cursor: initial;
      #{$container}__icon {
        opacity: 0.5;
      }
    }

    &--active {
      #{$container}__icon {
        animation: glow 0.5s ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }
    }

    &--shopping {
      cursor: initial;
    }

    &:hover {
      #{$container} {
        &__icon {
          color: lighten($secondary, 20%);
          background-image: linear-gradient(
            45deg,
            fade-out($secondary, 0.5) 0%,
            fade-out($bg-secondary, 0.25) 100%
          );
        }
      }
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 6px 0 $secondary;
    }
    100% {
      box-shadow: 0 0 6px 3px $secondary;
    }
  }
</style>
