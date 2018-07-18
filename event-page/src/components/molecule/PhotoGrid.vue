<template>
  <div class="photo-grid">
    <img class="photo-src" :src="src" height="auto" width="100%"/>
    <!--<img class="photo-src" :src="src" height="auto" width="100%" :class="{'is-active': isInViewport(top, bottom)}"/>-->
    <div class="photo-caption">
      <span>{{mapReadableDate(createdAt)}}.</span>
      <b><i>{{caption}}</i></b>

      <Icon class="md-18 icon-delete" @click="onDelete" v-if="id && isAuthorized" name="delete">delete</Icon>
    </div>
  </div>
</template>

<script>
import mapper from '../../store/helpers/mapper'
import Icon from '../atom/Icon'
export default {
  name: 'photo-grid',
  props: {
    id: { type: String },
    src: { type: String },
    createdAt: { type: Number },
    caption: { type: String },
    isAuthorized: { type: Boolean }
  },
  components: {
    Icon
  },
  methods: {
    ...mapper,
    onDelete (evt) {
      this.$emit('delete', this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
$caption-height: 40px;
.photo-caption {
  @extend %h6;
  color: $dove-gray;
  text-align: center;
  height: $caption-height;
  line-height: $caption-height;
}

.photo-src {
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid $gallery;
  transition: .174s all ease-out;
}


.icon-delete {
  cursor: pointer;
  vertical-align: middle;
}
.icon-delete:hover {
  color: $color-primary;
}
</style>
