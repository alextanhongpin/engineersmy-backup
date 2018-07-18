<template>
    <div>
        <div>
          <label for="" class="label label--small">Name</label>
          <input type="text" class="text-input" placeholder="Event name" name="name" @keyup="onKeyUp" :value="name"/>
        </div>
        
        <break space="10"/>

        <div>
          <label for="" class="label label--small">URL</label>
          <input type="text" class="text-input" placeholder="Event url" name="uri" @keyup="onKeyUp" :value="uri"/>
        </div>

        <break space="10"/>

        <div>
          <label for="" class="label label--small">Date</label>
          <input type="date" class="text-input" placeholder="Event date" name="startDate" @change="onKeyUp" :value="startDate"/>
        </div>

        <break space="10"/>

        <div>
          <label for="" class="label label--small">Tags</label>
          <div>
            <input type="text" class="text-input" placeholder="Comma-separated tags (e.g. react, web)" name="tags" @keyup="onKeyUp" :value="tags"/>
          </div>
        </div>
        
        <break space="20"/>

        <div class="button-wrapper">
          <button class="button" @click="onSubmit">{{buttonText}}</button>
        </div>

        <break space="5"/>
    </div>
</template>

<script>
import Break from '../atom/Break'
export default {
  name: 'form-event',
  props: {
    name: { type: String },
    uri: { type: String },
    startDate: { type: String },
    tags: { type: String, default: '' },
    buttonText: { type: String, default: 'Create' }
  },
  components: {
    Break
  },
  methods: {
    onKeyUp (evt) {
      // Enter key
      if (evt.keyCode === 13) {
        return this.$emit('submit')
      }
      const payload = {
        key: evt.currentTarget.name,
        value: evt.currentTarget.value.trim()
      }
      this.$emit('keyup', payload)
    },
    onSubmit (evt) {
      this.$emit('submit')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.label--small {
  @extend %h6;
}

.button-wrapper {
  text-align: right;
}
</style>
