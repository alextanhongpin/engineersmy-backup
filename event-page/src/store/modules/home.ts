// The home page module
import * as zenscroll from 'zenscroll'

import { Event, Events, IEvent, EventServer } from '../model/event'
import mapper from '../helpers/mapper'
import PublicEventService from '../service/event-public'
import similarity from '../helpers/similarity'
// const TIMEOUT_INTERVAL_MS = 150

// Initialize a new public service
const publicEventService = PublicEventService()

export default {
  namespaced: true,
  state: {
    ...Event,
    ...Events,
    aggregate: [],
    showExpired: false,
    keyword: '', // Stores the keyword presentation value
    keywordGhost: '', // Stores the keyword throttled value
    searchTimeout: null, // Stores the timeout reference to the search
    showModalWordCloud: false,
    selectedTags: [], // A collection to hold a list of selected tags
  },
  getters: {
    name (state): string {
      return state.name
    },
    tags (state): string[] {
      return state.tags
    },
    uri (state): string {
      return state.uri
    },
    startDate (state): string {
      return state.startDate
    },
    count (_, getter): number {
      return getter.events.length
    },
    keyword (state): string {
      return state.keyword
    },
    wordcloud (state, getters): any {
      const tags = state.collection
      .map(e => e.tags)
        .reduce((a, b) => a.concat(b), [])
        .filter(nonNull => nonNull)
        .map(e => e.toLowerCase())
      
      const aggregate = tags.reduce((a, b) => {
          if (!a[b]) {
            a[b] = 0
          }
          a[b] += 1
          return a
        }, {})

      // Create a default tag which selects everything
      const all = {
        tag: 'all',
        score: tags.length,
        selected: state.selectedTags.length === 0
      }
      return Object.entries(aggregate).map(([tag, score]) => {
        return {
          tag,
          score,
          selected: state.selectedTags.includes(tag)
        }
      })
      .concat([all])
      .sort((a, b) => {
        return b.score - a.score
      })
    },
    wordcloudCount (state, getter): number {
      return getter.wordcloud.filter(e => e.selected).length
    },
    // Returns events that has already undergo rules such as filter, sort, and pagination, tag filters
    events (state, getter): IEvent[] {
      return state.collection
      .filter(state.showExpired ? filterNone : filterExpire)
      .filter(state.keywordGhost.length === 0 ? filterNone : filterKeyword(state.keywordGhost))
      .filter(state.selectedTags.length === 0 ? filterNone : filterTags(state.selectedTags))
    },
    autocorrectWord (state, getter): string {
      const trimmedKeyword = state.keyword.trim().toLowerCase()
      if (!trimmedKeyword.length) {
        return ''
      }
      if (!state.collection.length) {
        return ''
      }
      const names = state.collection
      .filter(state.showExpired ? filterNone : filterExpire)
      .filter(state.selectedTags.length === 0 ? filterNone : filterTags(state.selectedTags))
      .map((e) => e.name && e.name.toLowerCase())
      .filter((e) => {
        return e && e[0] === trimmedKeyword[0]
      })
      .map((e) => e.split(' '))
      .reduce((a, b) => a.concat(b), [])
      .map((e) => {
        const similarityScore = similarity(e.split(''), trimmedKeyword.split(' ').join('').split(''))
        const bonus = (e && e[0]) === (trimmedKeyword && trimmedKeyword[0]) ? 0.2 : 0
        const chainBonus = (e && e[1]) === (trimmedKeyword && trimmedKeyword[1]) ? 0.4 : 0
        return {
          name: e,
          score: similarityScore + bonus + chainBonus
        }
      })
      .sort((a, b) => {
        return b.score - a.score
      })

      return names && names[0] && names[0].name
    },
    // Returns new events by filtering expired ones
    filterExpire (state): IEvent[] {
      return state.collection.filter((evt) => {
        const present = evt.start_date
        const start = new Date().setHours(0, 0, 0, 0)
        return present >= start
      })
    },
    // Return the aggregated results of the events (by month, by day)
    aggregate (state, getter): any {
      const hasCollection = getter.events.length
      if (!hasCollection) return

      const monthYear = getter.events
      .map((event) => {
        // Conversion of timestamp string to int is required, else date will be invalid
        const date = new Date(event.start_date)
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const day = date.getDate()
        return {
          ...event,
          start_date: new Date(event.start_date),
          created_at: new Date(event.created_at),
          updated_at: new Date(event.updated_at),
          keyMonth: `${year}:${month}`,
          keyDate: `${year}:${month}:${day}`
        }
      })
      .reduce((prev, curr) => {
        if (!prev[curr.keyMonth]) {
          prev[curr.keyMonth] = []
        }
        prev[curr.keyMonth].push(curr)
        return prev
      }, [])

      const output = Object.entries(monthYear).map(([_, value]) => {
        return {
          key: value && value[0] && value[0].start_date,
          value
        }
      })

      const eventsByDate = output.map(({ key, value }) => {
        const newValue = value.reduce((prev, curr) => {
          if (!prev[curr.keyDate]) {
            prev[curr.keyDate] = []
          }
          prev[curr.keyDate].push(curr)
          return prev
        }, [])

        const outputValue = Object.entries(newValue).map(([_, value]) => {
          return {
            key: value && value[0] && value[0].start_date,
            value
          }
        })
        return {
          key,
          value: outputValue
        }
      })

      // byCreatedDate sort the events by the created date
      const byCreatedDate = (a, b) => {
        return new Date(a.key).getTime() - new Date(b.key).getTime()
      }

      const final = eventsByDate.sort(byCreatedDate)
      .map(({ key, value }) => ({ key, value: value.sort(byCreatedDate) }))

      return final
    },
    showModalWordCloud (state): boolean {
      return state.showModalWordCloud
    }
  },
  mutations: {
    SET_FIELD (state, { key, value }) {
      state[key] = value
    },
    CLEAR_FIELD (state) {
      state.name = ''
      state.uri = ''
      state.tags = ''
      state.startDate = ''
    },
    SET_TAGS (state, value) {
      if (value === 'all') {
        state.selectedTags = []
        return
      }
      const tags = state.selectedTags
      if (tags.includes(value)) {
        state.selectedTags = tags.filter(t => t !== value)
      } else {
        state.selectedTags = tags.concat(value)
      }
    }
  },
  actions: {
    async onFetchEvents ({ commit }) {
      try {
        const response = await publicEventService.published()
        commit('SET_FIELD', {
          key: 'collection',
          value: (response && response.data) || []
        })
      } catch (error) {
        console.error(error)
        commit('SET_FIELD', {
          key: 'collection',
          value: []
        })
      }
    },
    // Perform search by keyword
    onSearch ({ commit }, evt) {
      const keywordTrimmed = evt.currentTarget.value.trim()
      commit('SET_FIELD', {
        key: 'keyword',
        value: keywordTrimmed
      })
      commit('SET_FIELD', {
        key: 'keywordGhost',
        value: keywordTrimmed
      })
    },
    onEditSuggestForm ({ commit, dispatch }, { key, value }) {
      commit('SET_FIELD', {
        key, value
      })
    },
    async onSubmitSuggestForm ({ commit, dispatch, state }) {
      const { name, startDate, uri, tags } = state
      const payload: EventServer = {
        name,
        start_date: mapper.mapDateToUTC(startDate),
        uri,
        tags: mapper.mapStringToArray(tags)
      }

      try {
        const res = await publicEventService.suggest(payload)
        if (res && res.error) {
          window.alert(res.error)
        }
        if (res && res.id) {
          window.alert('Thank you for suggesting this event! It will be published once it has been reviewed!')
        }
      } catch (error) {
        console.log(error)
      }
      dispatch('onClearSuggestForm')
    },
    onClearSuggestForm ({ commit }) {
      commit('CLEAR_FIELD')
    },
    onToggleExpireFilter ({ commit }, { value }) {
      commit('SET_FIELD', {
        key: 'showExpired',
        value
      })
    },
    onToggleModalWordCloud ({ commit }, value) {
      // Toggle body overflow
      if (value) {
        // const myScroller = zenscroll.createScroller(document.querySelector('body'), 500, 0)
        zenscroll.toY(0, 100)
      } 
      document.body.style.overflow = value ? 'hidden' : 'auto'
      commit('SET_FIELD', {
        key: 'showModalWordCloud',
        value
      })
    },
    onSelectWordTag ({ commit }, value) {
      commit('SET_TAGS', value)
    },
    onSelectAutocorrect ({ commit }, value) {
      commit('SET_FIELD', {
        key: 'keyword',
        value: value
      })
      commit('SET_FIELD', {
        key: 'keywordGhost',
        value: value
      })
    }
  }
}

// -- FILTERS
function filterExpire (event): boolean {
  const present = new Date(event.start_date).getTime()
  const start = new Date().setHours(0, 0, 0, 0)
  return present >= start
}

function filterKeyword (keyword) {
  return function (event): boolean {
    const lowercaseEvent = event && event.name.toLowerCase().trim()
    const lowercaseKeyword = keyword.toLowerCase().trim()
    return lowercaseEvent.includes(lowercaseKeyword)
  }
}

function filterAutocorrect (keyword) {
  return function (event): boolean {
    const lowercaseEvent = event && event.name.toLowerCase().trim()
    const lowercaseKeyword = keyword.toLowerCase().trim()

    const values = lowercaseEvent.split(' ').join('').split('')
    const keywords =  lowercaseKeyword.split(' ').join('').split('')
    const score = similarity(keywords, values)
    return score > 0.5
  }
}

function filterNone (event): IEvent {
  return event
}

function filterTags (tags) {
  return function (event): boolean {
    const hasTags = event && event.tags && event.tags.length > 0
    // Filter true, which means this is excluded
    if (!hasTags) {
      return false
    }
    return event.tags.map(e => tags.includes(e)).some(isTrue => isTrue)
  }
}