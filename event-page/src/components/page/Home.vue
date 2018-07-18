<template>
  <div>
    <div class="modal-overlay" 
      v-if="showSuggestForm"
      @click="onClickModalOverlay"
    ></div>
    <br>

    <div class="search-wrapper">
      <input 
        type="search"
        placeholder="Search for a tech event, e.g. Mobile"
        class="search-input"
        @keyup="onSearch"
        :value="keyword"
      />
      <break space="5"/>
      <small v-if="!count && autocorrectWord.length">
        Do you mean <b class="autocorrect" @click="onSelectAutocorrect(autocorrectWord)">{{autocorrectWord}}</b>?
      </small>
    </div>


    <br v-if="width >= 540">

    <div class="word-cloud-filter" v-if="width >= 540">
      <span>Add filters: </span>
      <div class="word-cloud-wrapper" v-for="word in wordcloud.slice(0, 5)" >
        <word-tag :selected="word.selected" @click="onSelectWordTag(word.tag)">
          {{word.tag}} (x{{word.score}})
        </word-tag>
      </div>

      <span @click="onToggleModalWordCloud(!showModalWordCloud)" class="button-all link" v-if="wordcloud.length > 5">See all</span>
    </div>

    <modal :show="showModalWordCloud" @close="onToggleModalWordCloud(false)">
      <word-cloud 
        :collection="wordcloud" 
        :count="wordcloudCount"
        @select="onSelectWordTag"></word-cloud>
    </modal>

    <div class="page">
      <br>

      <div class="page-title-wrapper">
        <div class="h1">
          {{ title }}
        </div>

        <div class="button-wrapper">
          <button class="button button--large" @click="onClickCreate">
            <span>Suggest Event</span> <i class="material-icons md-24">keyboard_arrow_down</i>
          </button>
          <div v-if="showSuggestForm" class="modal-wrapper">
            <form-event
              :name="name"
              :startDate="startDate"
              :uri="uri"
              :tags="tags"
              @keyup="onEditSuggestForm"
              @submit="onSubmitForm"
            />
          </div>
        </div>
      </div>


      <!-- <div class="page-subheading h3">Find events in Malaysia </div> -->

      <div class="event-count">
        <div>Displaying {{count}} {{count === 1 ? 'event' : 'events'}}</div>
        <div>
          <!--
          <input type="checkbox" id="expired" name="show_expired" v-model="showExpired" @change="onToggleFilter"/> <label for="expired">Show expired events</label>
          -->
          <Checkbox id="show_expired" @toggle="onToggleFilter"/>
          <label for="show_expired">Show expired events</label>
        </div>
      </div>

      <div class="event">
 
        <div v-for="(group, i) in aggregate">
          <!--Display the current month in MMMM format, e.g. January-->
          <div class="event-month" v-if="group.value.length">
            <b>
              {{mapMonth(group.key)}} {{mapYear(group.key)}}
            </b>
          </div>

          <!--Loop through item in months-->
          <div v-for="(model, j) in group.value" 
            class="event-group" 
            :class="{'is-selected': mapIsToday(model.key)}"
          >
            <div class="badge" v-if="mapIsToday(model.key)"></div>
            <!--Loop through item in dates-->
            <transition-group name="fade">
              <div v-for="(item, k) in model.value" :key="item.id">
                  <div class="event-list" :class='{"is-active": mapIsToday(item.start_date)}'>
                    <b :class='{"is-active": mapIsToday(item.start_date), "is-visible": k === 0}' class="event-date">{{mapDate(item.start_date)}}</b> 
                    <a class="event-name" target="_blank" :href="item.uri">{{item.name}} <span class="badge-new" v-if="mapIsToday(item.created_at)">New</span></a>
                  </div>  
              </div> 
            </transition-group>
          </div>
        </div>  
      </div>

      <!--Display placeholder if cannot connect to api-->
      <div class="placeholder" v-if="aggregate && !aggregate.length">
        We are sorry. It seems like our service is not reachable at the moment.
      </div>
      
      <br>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ButtonFloat from '../atom/ButtonFloat'
import Break from '../atom/Break'
import Checkbox from '../atom/Checkbox'
import WordTag from '../atom/WordTag'
import Modal from '../atom/Modal'
import FormEvent from '../organism/FormEvent'
import WordCloud from '../organism/WordCloud'
import Mapper from '../../store/helpers/mapper.ts'

export default {
  name: 'home',
  beforeMount () {
    this.showSuggestForm = false
    this.pageOnLoad()
    this.onFetchEvents()
  },
  mounted () {
    this.pageDidLoad()
  },
  components: {
    FormEvent,
    ButtonFloat,
    Break,
    Checkbox,
    Modal,
    WordTag,
    WordCloud
  },
  data () {
    return {
      title: 'Home',
      showSuggestForm: this.showSuggestForm
    }
  },
  computed: {
    ...mapGetters(['width']),
    ...mapGetters('home', [
      'count',
      'aggregate',
      'keyword',
      'name',
      'startDate',
      'uri',
      'tags',
      'wordcloud',
      'wordcloudCount',
      'showModalWordCloud',
      'autocorrectWord'
    ])
  },
  methods: {
    ...mapActions('page', ['pageOnLoad', 'pageDidLoad']),
    ...mapActions('home', [
      'onFetchEvents',
      'onSearch',
      'onEditSuggestForm',
      'onSubmitSuggestForm',
      'onToggleExpireFilter',
      'onToggleModalWordCloud',
      'onSelectWordTag',
      'onSelectAutocorrect'
    ]),
    ...Mapper,
    onClickCreate () {
      this.showSuggestForm = !this.showSuggestForm
    },
    onClickModalOverlay () {
      // Only close if the fields are empty
      this.showSuggestForm = false
    },
    onSubmitForm () {
      this.onSubmitSuggestForm()
      this.showSuggestForm = false
    },
    onToggleFilter (value) {
      const payload = {
        key: 'showExpired',
        value
      }
      this.onToggleExpireFilter(payload)
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

.autocorrect {
  cursor: pointer;
}

.autocorrect:hover {
  text-decoration: underline;
}

.page-title-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  justify-content: space-between;
}

.page-title-wrapper > div:last-child {
  justify-self: flex-end; 
  align-self: center;
}

.page-subheading {}

.event-count {
  @extend %h6;
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  color: $dove-gray;
}
.event-count > div {
  display: inline-block;
}
.event-count > div:last-child {
  // justify-self: flex-end;
  padding: 0 $dim-100;
}

.event-month {
  height: 40px;
  line-height: 40px;
  padding: 0 $dim-100;
  margin: $dim-100 0 0;
  color: $dove-gray;
}
.event-group {
  border-radius: 5px;
  border-color: 1px solid transparent;
  border-bottom: 1px solid $gallery;
  position: relative;
}
.badge {
  background: $color-primary;
  height: 20px;
  width: 80px;
  position: absolute;
  right: 0;
  top: 10px;
}
.badge:after {
  @extend %h6;
  content: 'Today';
  position: absolute;
  font-weight: bold;
  color: white;
  width: 80px;
  text-align: center;
}
.badge:before {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 20px;
  border-left: 8px solid white;
  border-bottom: 10px solid $color-primary;
  border-top: 10px solid $color-primary;
}

.event-group.is-selected {
  border: 1px solid $gallery;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .15);
  margin: 0 0 $dim-100 0;
  // transition: .134s all ease-out;
}

.event-group.is-selected:hover {
  box-shadow: 0 5px 15px rgba($color-primary, .4);
}
$event-list-height: 40px;
.event-list {
  display: grid;
  grid-template-columns: 70px 1fr;
  min-height: $event-list-height;
  line-height: $event-list-height;
  padding: 0 $dim-100;
  cursor: pointer;
  border-radius: 5px;
}
$event-list-selected-height: 40px;

.event-list:hover:not(.is-active) {
  background: $gallery;
}

.event-date {
  visibility: hidden;
  @extend %h6;
}
.event-date.is-active {
  color: $color-primary;
}

.event-name {
  color: inherit;
  text-decoration: none;
  @extend %h5;
}
.event-name:hover {
  color: $color-primary;
  text-decoration: underline;
}
.event-name:before {
  content: "\25CB";
  display: inline-block;
  padding: 0 10px 0 0;
  font-weight: 700;
  color: rgba($dove-gray, .5);
}
.event-date.is-visible {
  visibility: visible;
}
.search-wrapper {
  max-width: $max-column-width;
  margin: 0 auto;
}
.search-input {
  @extend %h5;
  width: 100%;
  box-shadow: 0 5px 10px rgba(black, .25);
  height: 40px;
  border-radius: 5px;
  padding: 0 $dim-100;
  border: none;
}

.button-wrapper {
  position: relative;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(black, .5);
  z-index: $layer-100;
}

.modal-wrapper {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  box-shadow: 0 5px 10px rgba(black, .25);
  border: 1px solid $alto;
  padding: $dim-100;
  border-radius: 5px;
  width: 360px;
  background: white;
  z-index: $layer-200;
  transform-origin: right top;
  animation: scaleIn .134s ease-out forwards;
}

@media (max-width: $breakpoint-100) {
  .modal-wrapper {
    position: fixed;
    top: $dim-100;
    left: $dim-100;
    width: calc(100% - #{$dim-200});
    animation: slideDown .174s ease-out forwards;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0.05;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes slideDown {
  from {
    opacity: 0.05;
    transform: translate3d(0, -100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-enter-active, fade-leave-active {
  transition: all .134s;
  opacity: 1;
  transform: translateY(0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.badge-new {
  @extend %h6;
  background: $jungle-green;
  color: white;
  padding: 0 $dim-50;
  border-radius: 5px;
  font-weight: bold;
  height: 20px;
  display: inline-block;
  line-height: 20px;
}

.placeholder {
  @extend %placeholder;
}

.button-all {
  cursor: pointer;
}

.word-cloud-filter {
  max-width: $max-column-width;
  width: 100%;
  margin: 0 auto;
}

.word-cloud-wrapper {
  margin: $dim-50 0;
  display: inline-block;
}



// Responsive

@media(max-width: $breakpoint-100) {
  .event-list {
    grid-template-columns: 1fr;
    line-height: auto;
  }
  .event-date.is-visible {
    display: block;
  }
  .event-date {
    display: none;
  }
  .event-name {
    width: 100%;
  }
}
</style>
