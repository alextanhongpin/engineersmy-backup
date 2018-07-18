import * as moment from 'moment'
import { Event, IEvent, EventServer } from '../model/event'
import mapper from '../helpers/mapper'
import PrivateEventService from '../service/event-private'
import PublicEventService from '../service/event-public'
import similarity from '../helpers/similarity'

const enum FilterEnum {
  All,
  Pending,
  Approved,
  Expired
}

enum SortEnum {
  Name = <any>'name',
  StartAt = <any>'start_date',
  CreatedAt = <any>'created_at'
}

enum OrderEnum {
  Asc = <any>'asc',
  Dsc = <any>'dsc'
}

const privateEventService = PrivateEventService()
const publicEventService = PublicEventService()
const isProduction = false

export default {
  namespaced: true,
  state: {
    collection: [], // The collection after filter and transformation
    searchTimeout: null, // The search timeout context

    filter: FilterEnum.All, // The filter keyword, defaults to all
    sort: SortEnum.CreatedAt, // The sort keyword, defaults to created_at in descending order
    sortOrder: OrderEnum.Dsc, // asc or desc
    enableCreate: false, // Flag to display create form for admin
    enableUpdate: false,
    // enableUpdate: false, // Flag to toggle the admin update
    ...Event,

    previousCount: 0,
    currentCount: 0,
    showExpired: false,
    keyword: ''
  },
  getters: {
    id (state): string {
      return state.id
    },
    name (state): string {
      return state.name
    },
    startDate (state): string {
      return state.startDate
    },
    uri (state): string {
      return state.uri
    },
    tags (state): string {
      return state.tags
    },
    count (state): number {
      return state.collection.length
    },
    enableCreate (state): boolean {
      return state.enableCreate
    },
    enableUpdate (state): boolean {
      return state.enableUpdate
    },
    showPanel (state): boolean {
      return state.enableUpdate || state.enableCreate
    },
    keyword (state): string {
      return state.keyword
    },
    pendingCollection: (state, getters) => getters.collection.filter(e => !e.is_published),
    pendingCount: (state, getters) => getters.pendingCollection.length,
    approvedCollection: (state, getters) => getters.collection.filter(e => e.is_published),
    approvedCount: (state, getters) => getters.approvedCollection.length,
    upcomingCollection: (state, getters) => getters.collection.filter(e => new Date(e.start_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)),
    upcomingCollectionCount: (state, getters) => getters.upcomingCollection.length,
    // Logic for selected collections
    selectedCollection: (state, getters) => getters.collection.filter(e => e.is_selected),
    selectedEventsCount: (state, getters) => getters.selectedCollection.length,
    hasSelectedEvents: (state, getters) => getters.selectedEventsCount > 0,
    collection (state) {
      const results = state.collection
      .filter(e => state.showExpired ? e : onlyUpcoming(e))
      .filter(e => e.name.toLowerCase().includes(state.keyword.trim().toLowerCase()))

      if (!results.length) {
        return state.collection
        .filter(e => state.showExpired ? e : onlyUpcoming(e))
        .filter(e => {
          const keywords = state.keyword.trim()
          .toLowerCase()
          .split('')

          const values = e.name.toLowerCase()
          .split(' ')
          .join('')
          .split('')
          const score = similarity(keywords, values)
          console.log('score:', score)
          return score > 0.5
        })
      }
      return results
    },
    // adminCollection displays the collection for the admin page based on the filter selected
    adminCollection (state, getters) {
      const collectionState = {
        [FilterEnum.All]: getters.collection,
        [FilterEnum.Pending]: getters.pendingCollection,
        [FilterEnum.Approved]: getters.approvedCollection
      }
      const collection = collectionState[state.filter]
      if (!collection) {
        return []
      }
      return collection.sort((a, b) => {
        const order = (state.sortOrder === 'asc' ? 1 : -1)
        if (state.sort === SortEnum.Name) {
          return sortAlphabetical(a[state.sort], b[state.sort]) * order
        }
        return sortByDate(a[state.sort], b[state.sort]) * order
      })
    },
    filters (state, getters) {
      return [
        {
          label: 'All',
          selected: state.filter === FilterEnum.All,
          count: getters.upcomingCollectionCount,
          value: FilterEnum.All
        },
        {
          label: 'Pending',
          selected: state.filter === FilterEnum.Pending,
          count: getters.pendingCount,
          value: FilterEnum.Pending
        },
        {
          label: 'Approved',
          selected: state.filter === FilterEnum.Approved,
          count: getters.approvedCount,
          value: FilterEnum.Approved
        }
      ]
    },
    sorts (state, getters) {
      return [
        {
          label: 'Event Title',
          selected: state.sort == SortEnum.Name,
          order: state.sortOrder,
          value: SortEnum.Name,
          enabled: true
        },
        {
          label: 'Created',
          selected: state.sort == SortEnum.CreatedAt,
          order: state.sortOrder,
          value: SortEnum.CreatedAt,
          enabled: true
        },
        {
          label: 'Happening',
          selected: state.sort == SortEnum.StartAt,
          order: state.sortOrder,
          value: SortEnum.StartAt,
          enabled: true
        },
        {
          label: 'Published',
          selected: false,
          order: state.sortOrder,
          enabled: false
        }
      ]
    }
  },
  mutations: {
    SET_FIELD (state, { key, value }) {
      state[key] = value
    },
    UPDATE_COLLECTION (state, { key, value }) {
      state.collection = state.collection.map(e => {
        if (e.id === key) {
          return value
        }
        return e
      })
    },
    // Insert a new event into existing collection
    INSERT_COLLECTION (state, payload) {
      state.collection = state.collection.concat([payload])
    },
    REMOVE_FROM_COLLECTION (state, payload) {
      state.collection = state.collection.filter((e) => {
        return !payload.includes(e.id)
      })
    },
    // updateSelection updates the toggle for event selection
    TOGGLE_LIST (state, { key, value }) {
      // Update the toggle state of the event that is selected
      const updatedCollection = state.collection.map((event) => {
        if (event.id === key) {
          event.is_selected = value
        }
        return event
      })
      state.currentCount = updatedCollection.filter(e => e.is_selected).length
      state.collection = updatedCollection

      // Conditions set in order to allow updates
      const enableUpdate = state.currentCount === 1 && state.previousCount === 0
      if (enableUpdate) {
        const model = updatedCollection.find(e => e.is_selected)
        state.name = model.name
        state.tags = model.tags && Array.isArray(model.tags) ? model.tags.join(', ') : ''
        state.startDate = moment(model.start_date).format('YYYY-MM-DD')
        state.uri = model.uri
        state.id = model.id
      } else {
        state.name = ''
        state.tags = ''
        state.startDate = ''
        state.uri = ''
        state.id = ''
      }
      state.enableUpdate = enableUpdate
    },
    // Clears the form fields
    CLEAR_FIELD (state) {
      state.id = ''
      state.name = ''
      state.startDate = ''
      state.uri = ''
      state.tags = ''
    }
  },
  actions: {
    // fetchEvents is responsible for fetching all events, but requires user
    // to be authenticated
    async onFetchEvents ({ commit, dispatch, state }) {
      try {
        dispatch('page/pageOnLoad', null, { root: true })
        const res = await publicEventService.all()
        commit('SET_FIELD', {
          key: 'collection',
          value: (res && res.data) ? res.data.map(e => ({ ...e, is_selected: false })) : []
        })
        
        dispatch('page/pageDidLoad', null, { root: true })
      } catch (error) {
        console.error(error)
        dispatch('login/logout', null, { root: true })
      }
    },
    // Delete a list of events by id
    async onDeleteEvents ({ commit, dispatch, state }) {
      try {
        const ids: string[] = state.collection
          .filter(e => e.is_selected)
          .map(e => e.id)

        const res = await privateEventService.bulkDelete(ids)
        commit('REMOVE_FROM_COLLECTION', ids)
        commit('CLEAR_FIELD')
        commit('SET_FIELD', {
          key: 'enableCreate',
          value: false
        })
        commit('SET_FIELD', {
          key: 'enableUpdate',
          value: false
        })
      } catch (error) {
        console.log(error)
      }
    },
    // onUpdateEvent updates the event
    async onUpdateEvent ({ commit, dispatch, state }, id) {
      try {
        dispatch('page/pageOnLoad', null, { root: true }) // Loading
        const { name, tags, startDate, uri } = state
        const model = state.collection.find(e => e.id === id)

        const payload: EventServer = {
          ...model,
          name,
          uri,
          tags: mapper.mapStringToArray(tags),
          startDate: mapper.mapDateToUTC(startDate)
        }

        const ok = await privateEventService.update(payload)
        dispatch('page/pageDidLoad', null, { root: true }) // Done

        if (ok) {
          commit('UPDATE_COLLECTION', {
            key: id,
            value: payload
          })
        }

        commit('CLEAR_FIELD')
        commit('SET_FIELD', {
          key: 'enableCreate',
          value: false
        })
        commit('SET_FIELD', {
          key: 'enableUpdate',
          value: false
        })
        dispatch('onFetchEvents')
      } catch (error) {
        console.error(error)
      }
    },
    // Updates the publish status of events
    async onUpdateEventPublishedStatus ({ commit, dispatch, state }, id) {
      try {
        dispatch('page/pageOnLoad', null, { root: true }) // Loading
        const model = state.collection.find(e => e.id === id)
        const payload: EventServer = {
          ...model,
          is_published: !model.is_published
        }
        const ok = await privateEventService.update(payload)
        dispatch('page/pageDidLoad', null, { root: true }) // Done

        if (ok) {
          commit('UPDATE_COLLECTION', {
            key: id,
            value: payload
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    // Edit the create form value
    onEditForm ({ commit }, { key, value }) {
      commit('SET_FIELD', { key, value })
    },
    // Toggles the list selection
    onToggleListSelection ({ commit, state }, { key, value }) {
      // Set the prev count to be the current count
      commit('SET_FIELD', {
        key: 'previousCount',
        value: state.currentCount
      })
      commit('TOGGLE_LIST', { key, value })
    },
    // Creates a new event and fetch the list again
    async onCreateEvent ({ state, commit, dispatch }) {
      const { name, startDate, uri, tags } = state

      const payload: EventServer = {
        name,
        uri,
        start_date: mapper.mapDateToUTC(startDate),
        tags: mapper.mapStringToArray(tags)
      }

      try {
        const res = await privateEventService.create(payload)

        if (res && res.error) {
          return window.alert(res.error)
        }
        const newEvent: EventServer = {
          id: res.id,
          name,
          start_date: payload.start_date,
          tags: payload.tags,
          uri,
          is_published: true
        } 

        commit('INSERT_COLLECTION', newEvent)
      } catch (error) {
        console.log(error)
      }
      commit('CLEAR_FIELD')
    },
    // Updates the filter selection
    onUpdateFilter ({ commit }, value) {
      commit('SET_FIELD', {
        key: 'filter',
        value: value
      })
    },
    onTogglePanel ({ commit }, value) {
      if (value) {
        // Allow create, but disable update
        commit('CLEAR_FIELD')
        commit('SET_FIELD', {
          key: 'enableCreate',
          value
        })
        commit('SET_FIELD', {
          key: 'enableUpdate',
          value: !value
        })
        return
      }

      // Disable both the create and update
      commit('SET_FIELD', {
        key: 'enableCreate',
        value
      })
      commit('SET_FIELD', {
        key: 'enableUpdate',
        value: value
      })
    },
    onToggleExpire ({ commit }, value) {
      commit('SET_FIELD', {
        key: 'showExpired',
        value
      })
    },
    onSearch ({ commit }, evt) {
      commit('SET_FIELD', {
        key: 'keyword',
        value: evt.currentTarget.value
      })
    },
    onSort ({ commit, state }, value) {

      if (state.sort === value) {
        commit('SET_FIELD', {
          key: 'sortOrder',
          value: state.sortOrder === OrderEnum.Asc ? OrderEnum.Dsc : OrderEnum.Asc
        })
        return
      }
      commit('SET_FIELD', {
        key: 'sort',
        value
      })
    }
  }
}

// Filter only upcoming events
function onlyUpcoming (event): Boolean  {
  return new Date(event.start_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
}

function sortAlphabetical(a, b) {
  const A = a.toLowerCase()
  const B = b.toLowerCase()
  if (A < B){
    return -1;
  } else if (A > B){
    return  1;
  } else {
    return 0;
  }
}

function sortByDate (a, b) {
  const A = new Date(a).getTime()
  const B = new Date(b).getTime()
  if (A < B){
    return -1;
  } else if (A > B){
    return  1;
  } else {
    return 0;
  }
}