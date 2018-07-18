<template>
  <div class="event-list">
    <!--Display the checkbox for the event-->
    <div class="event-list-index">
      <input type="checkbox" class="event-checkbox" :name="id" :id="id" v-model="isSelected" @change="onToggleCheckbox"/>
      <Icon :name="isSelected ? 'check_box' : 'check_box_outline_blank'" class="md-18"/>
    </div>

    <!--Display the info for the event-->
    <label :for="id" class="event-list-column">
      <div class="event-name" :title="name">
        <a :href="uri" class="link-hover" :title="name" target="_blank">{{name}}</a>
      </div>
      <div 
        class="event-created_at" 
        :title="mapFormatDate(created_at)"
      >{{mapFormatDate(created_at)}}</div>
      <div 
        class="event-start_date"
        :title="mapStandardDate(start_date)"
      >{{mapStandardDate(start_date)}}</div>
    </label>

    <!--Display the toggle button for the event-->
    <div class="event-list-toggle">
      <toggle :isActive="is_published === true" @click="onClick"/>
    </div>
  </div>
</template>

<script>
import Icon from '../atom/Icon'
import Toggle from '../atom/Toggle'
import mapper from '../../store/helpers/mapper.ts'
export default {
  name: 'event-list',
  beforeMount () {
    this.isSelected = false
  },
  components: {
    Icon,
    Toggle
  },
  props: {
    name: { type: String, default: '' },
    id: { type: String, default: '' },
    created_at: { type: String, default: '' },
    start_date: { type: [String, Number], default: '' },
    is_published: { type: Boolean, default: false },
    uri: { type: String, default: '' },
    is_selected: { type: Boolean, default: false },
    tags: { type: Array }
  },
  data () {
    return {
      isSelected: this.isSelected
    }
  },
  methods: {
    ...mapper,
    onToggleCheckbox (evt) {
      const payload = {
        key: evt.currentTarget.name,
        value: this.isSelected
      }
      this.$emit('select', payload)
    },
    onClick () {
      this.$emit('click', this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

$height: 45px;
.event-checkbox {
  display: none;
}
.event-list {
  @extend %h5;
  display: grid;
  grid-template-columns: 40px 1fr 80px;
  height: $height;
  line-height: $height;
  border-radius: 5px;
}
.event-list:hover {
  background: $gallery;
}
.event-list-index {
  align-self: center;
  justify-content: center;
  padding: 0 $dim-100;
}
.event-list-column {
  grid-column: 2 / 3;
  display: grid;
  grid-template-columns: 1fr 120px 120px;
}
.event-list-toggle {
  align-self: center;
  justify-content: center;
}

.event-name {
  @extend %h5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-created_at,
.event-start_date {
  @extend %h6;
  color: $dove-gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}
.event-checkbox + i {
  color: rgba($dove-gray, .5);
  display: inline-block;
  line-height: $height;
  transition: .174s all ease-out;
}
.event-checkbox:checked + i {
  color: $heliotrope;
}
</style>
