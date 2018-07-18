<template>
    <div class="button-float" @click="onClick">{{text}}</div>
</template>

<script>
export default {
  name: 'button-float',
  props: {
    text: String
  },
  methods: {
    onClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
.button-float {
  background: $color-primary;
  color: white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  font-size: 24px;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  box-shadow: 0 5px 10px rgba(black, .25);
  cursor: pointer;
}
.button-float:hover {
  background: darken($color-primary, 5%);
}
</style>
