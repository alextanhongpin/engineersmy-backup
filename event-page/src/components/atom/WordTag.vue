<template>
    <div
      :class="{'is-selected': selected}"
      class="word-tag" 
      @click="onClick"
      :title="title"
    >
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'word-tag',
  props: {
    selected: { type: Boolean, default: false },
    title: { type: String }
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

$height: 24px;
.word-tag {
  @extend %h6;
  color: white;
  background: lighten($color-primary, 15%);
  border-radius: 5px;
  height: $height;
  line-height: $height;
  display: inline-block;
  padding: 0 $dim-100;
  margin: 0 $dim-50;
  cursor: pointer;
}
.word-tag.is-selected {
  background: $color-primary;
}

</style>
