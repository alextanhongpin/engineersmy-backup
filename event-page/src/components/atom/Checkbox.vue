<template>
  <div class="checkbox">
    <input 
      type="checkbox" 
      class="input-checkbox"
      :name="id" 
      :id="id" 
      v-model="isSelected" @change="onToggleCheckbox"
    />
    <Icon
      :name="isSelected ? 'check_box' : 'check_box_outline_blank'" 
      class="md-18"
    />
  </div>
</template>

<script>
// -- DESCRIPTION
// A checkbox with a predefined style for toggling
//
// -- USAGE
//
// <Checkbox id="show_expired" @toggle="onToggleFilter"/>
// <label for="show_expired">Show expired events</label>
//
import Icon from './Icon'
export default {
  name: 'checkbox',
  components: {
    Icon
  },
  beforeMount () {
    this.isSelected = false
  },
  props: {
    id: { type: String }
  },
  data () {
    return {
      isSelected: this.isSelected
    }
  },
  methods: {
    onToggleCheckbox (evt) {
      this.$emit('toggle', this.isSelected)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
.checkbox {
  display: inline-block;
  vertical-align: middle;
}
.input-checkbox {
  display: none;
}
.input-checkbox + i {
  color: rgba($dove-gray, .5);
  display: inline-block;
  transition: .174s all ease-out;
}
.input-checkbox:checked + i {
  color: $heliotrope;
}
</style>
