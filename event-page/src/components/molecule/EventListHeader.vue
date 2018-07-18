<template>
  <div class="event-list-header">
    <div></div>

    <div v-for="model in collection">
      <span class="td" @click="onClick(model.value)">{{model.label}} <Icon 
        :class="{'is-selected': model.selected}" 
        v-if="model.enabled || model.selected" 
        class="md-18" 
        :name="model.order === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up'"
      /></span>
    </div>
  </div>
</template>

<script>
import Icon from '../atom/Icon'
export default {
  name: 'event-list-header',
  components: {
    Icon
  },
  props: ['collection'],
  methods: {
    onClick (value) {
      this.$emit('click', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
$height: 40px;

.event-list-header {
  @extend %h6;
  font-weight: bold;
  height: $height;
  line-height: $height;
  border-bottom: 1px solid $gallery;

  display: grid;
  grid-template-columns: 40px 1fr 120px 120px 80px;
}

.td {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  border-radius: $dim-50;
  cursor: pointer;
  vertical-align: middle;
}

.td i:not(.is-selected) {
  display: none;
}
.td i {
  vertical-align: middle;
  color: $dove-gray;
}
.td:hover {
  background: rgba($color-primary, .15);
}
.td:hover i {
  display: inline-block;
}
</style>
