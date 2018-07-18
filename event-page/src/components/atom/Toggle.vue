<template>
    <div class="toggle-wrapper"
      :class='{"is-active": isActive}'
      @click="onClick"
    >
      <div class="toggle"></div>
    </div>
</template>

<script>
export default {
  name: 'toggle',
  props: ['isActive'],
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

$height: 25px;
.toggle-wrapper {
  cursor: pointer;
  background: rgba($dove-gray, .5);
  border-radius: #{$height / 2};
  width: #{$height * 1.6};
  height: #{$height * 0.8};
  box-shadow: inset 0 3px 6px rgba(black, .25);
  position: relative;
}
.toggle-wrapper.is-active {
  background: rgba($heliotrope, .75);
}

.toggle {
  background: white;
  display: inline-block;
  width: $height;
  height: $height;
  border-radius: #{$height / 2};
  box-shadow: 0 3px 9px rgba(black, .5);
  position: absolute;
  top: #{$height * 0.2 / -2};
  transition: .174s all cubic-bezier(.07,.41,.39,.95);
}

.toggle-wrapper.is-active .toggle {
  transform: translate3d(20px, 0, 0);
}
</style>
