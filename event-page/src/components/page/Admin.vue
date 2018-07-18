<template>
    <div>
      <div class="page">
        <div class="page-header">
          <div>
            <h1 class="h1">{{title}}</h1>
          </div>
          <div class="button-wrapper">
            <button class="button-outline" :disabled="!hasSelectedEvents" @click="onDeleteEvents">Delete</button>
            <button class="button" @click="onTogglePanel(!enableCreate)">Create</button>
          </div>
        </div>

        <div>
          View and manage events here. 
          <div v-for="filter in filters" class="bubble-wrapper">
            <bubble v-bind="filter" @click="onUpdateFilter">{{filter.label}}</bubble>
            &nbsp;
          </div>
        </div>

        <br>

        <div>
          <input class="search" type="search" placeholder="Search by keyword" :value="keyword" @keyup="onSearch"/>
        </div>
        
        <Break space="5"/>

        <div class="checkbox-wrapper">
          <Checkbox id="show_expired" @toggle="onToggleExpire"/>
          <label for="show_expired" class="h6">Show expired</label>
        </div>

        <br>

        <!--The header for the table view-->
        <event-list-header v-if="adminCollection.length" :collection="sorts" @click="onSort"/>

        <!--The list of event in the table-->
        <transition-group name="fade">
          <div v-for="model in adminCollection" v-if="adminCollection.length" :key="model.id">
            <event-list v-bind="model"
              @click="onPublish"
              @select="onToggleListSelection"
            />
          </div>
        </transition-group>
        
        <!--The table footer, display the number of items selected from the table-->
        <div v-if="adminCollection.length" class="event-counter">
          Selected <b>{{selectedEventsCount}}</b> {{selectedEventsCount === 1 ? 'event' : 'events'}}
        </div>

        <!--An empty placeholder, in case no events are available-->
        <div v-if="!adminCollection.length && !isLoading" class="event-placeholder">Yay. There are no events pending for moderation!</div>
        <br>

      </div>

      <transition name="slide-in">
        <aside class="aside" v-if="showPanel" :style="{top: scrollHeight + 'px'}">
          <div class="close-wrapper" title="Click to close the form" @click="onTogglePanel(false)">
            <icon name="close"/>
          </div>

          <h1>{{ enableUpdate ? "Update" : "Create" }}</h1>

          <form-event
              @keyup="onEditForm"
              @submit="enableUpdate ? onUpdateEvent(id) : onCreateEvent()"
              :name="name"
              :tags="tags"
              :startDate="startDate"
              :uri="uri"
              :buttonText='enableUpdate ? "Update" : "Create"'
          />

          <br>

          <div class="aside-footnote">* Events created by admin are published immediately.</div>
        </aside>
      </transition>
      
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bubble from '../atom/Bubble'
import Break from '../atom/Break'
import Checkbox from '../atom/Checkbox'
import Icon from '../atom/Icon'
import EventList from '../molecule/EventList'
import EventListHeader from '../molecule/EventListHeader'
import FormEvent from '../organism/FormEvent'
import mapper from '../../store/helpers/mapper.ts'
export default {
  name: 'admin-page',
  components: {
    Bubble,
    Break,
    Checkbox,
    EventList,
    EventListHeader,
    FormEvent,
    Icon
  },
  data () {
    return {
      title: 'Admin',
      scrollHeight: 40
    }
  },
  beforeMount () {
    this.onFetchEvents()
  },
  computed: {
    ...mapGetters('event', [
      'id',
      'name',
      'tags',
      'uri',
      'startDate',
      'adminCollection',
      'hasSelectedEvents',
      'selectedEventsCount',
      'upcomingCollectionCount',
      'filters',
      // New
      'enableCreate',
      'enableUpdate',
      'showPanel',
      'keyword',
      'sorts'
    ]),
    ...mapGetters('page', ['isLoading'])
  },
  methods: {
    ...mapper,
    ...mapActions('event', [
      'onFetchEvents',
      'onToggleListSelection',
      'onUpdateEvent',
      'onDeleteEvents',
      'onUpdateEventPublishedStatus',
      'onUpdateFilter',
      'onTogglePanel',
      'onEditForm',
      'onCreateEvent',
      'onToggleExpire',
      'onSearch',
      'onSort'
    ]),
    onPublish (id) {
      this.onUpdateEventPublishedStatus(id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.page {
  @extend %page;
  margin: $dim-200 auto;
}

.page-header {
  grid-template-columns: 1fr 1fr;
  display: grid;
  align-self: center;
}

.event-placeholder {
  @extend %placeholder;
}

.button-wrapper {
  text-align: right;
  align-self: center;
}
.event-counter {
  @extend %h6;
  color: $dove-gray;
  border-top: 1px solid $gallery;
  height: 30px;
  line-height: 40px;
  padding: 0 $dim-100;
}

.fade-enter-active, fade-leave-active {
  transition: all .134s;
  opacity: 1;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.bubble-wrapper {
  display: inline-block;
}
.aside {
  position: fixed;
  right: 0;
  top: 40px;
  width: 320px;
  background: white;
  display: block;
  padding: $dim-200;
  bottom: 0;
  box-shadow: -5px 0 10px rgba(black, .2);
}

.aside-footnote {
  @extend %h6;
  color: $dove-gray;
}

.close-wrapper {
  position: absolute;
  top: $dim-100;
  right: $dim-100;
  cursor: pointer;
  text-align: center;
  opacity: .75;
}
.close-wrapper:hover {
  opacity: 1;
}

.slide-in-enter-active, .slide-in-leave-active {
  transition: all 0.134s ease-out;
}
.slide-in-enter, .slide-in-leave-to {
  transform: translate3d(100%, 0, 0)
}

.search {
  @extend %h6;
  width: 100%;
  height: 35px;
  appearance: none;
  border: 1px solid $alto;
  border-radius: 5px;
  padding: 0 $dim-100;
}
.checkbox-wrapper {
  padding: 0 $dim-50;
}

</style>
