<template>
    <div>
      <break space="5"/>
      <!--The modal title-->
      <div class="h2">{{title}}</div>
      <break space="10"/>

      <!--The modal subtitle-->
      <div class="subheading">Apply filters to get more relevant results. You are currently applyling <b>{{count}}</b> {{count === 1 ? 'filter' : 'filters'}}.</div>
      <break space="10"/>

      <div v-for="word in collection" class="word-tag-wrapper">
        <word-tag
          :title="word.tag"
          :selected="word.selected"
          @click="onClick(word.tag)"
          >{{word.tag}} (x{{word.score}})</word-tag>
      </div>
      
    </div>
</template>

<script>
import Break from '../atom/Break'
import WordTag from '../atom/WordTag'
export default {
  name: 'word-cloud',
  components: {
    Break,
    WordTag
  },
  props: {
    collection: { type: Array },
    count: { type: Number }
  },
  data () {
    return {
      title: 'Filter Tags'
    }
  },
  methods: {
    onClick (value) {
      this.$emit('select', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
.word-tag-wrapper {
  display: inline-block;
  margin: $dim-50 auto;
}
.subheading {
  @extend %h6;
  color: $dove-gray;
  padding: 0 $dim-50;
}
</style>
