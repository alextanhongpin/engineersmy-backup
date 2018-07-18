<template>
    <div class="bubble" :class="{'is-selected': selected}" @click="onClick">
      <slot></slot>&nbsp;
      <span class="count" v-if="count">{{count}}</span>
    </div>
</template>

<script>
export default {
  name: 'bubble',
  props: {
    count: { type: Number },
    selected: { type: Boolean },
    value: { type: Number }
  },
  methods: {
    onClick (evt) {
      this.$emit('click', this.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
$height: 24px;


.bubble {
  @extend %h6;
  display: inline-block;
  background: lighten($dove-gray, 25%);
  color: white;
  padding: 0 $dim-100;
  height: $height;
  line-height: $height;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
.bubble.is-selected {
  background: lighten($heliotrope, 5%);
}
.bubble:hover:not(.is-selected) {
  background: rgba($heliotrope, .5);
}
$count-height: #{$height * 3 / 4};
.count {
  height: $count-height;
  min-width: $count-height;
  line-height: $count-height;
  border-radius: $count-height;
  border: 1px solid white;
  display: inline-block;
  text-align: center;
  font-size: 10px;
}

</style>
