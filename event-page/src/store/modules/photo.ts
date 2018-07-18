import * as Compress from 'compress.js'
import * as uuidv4 from 'uuid/v4'
import { IPhoto } from '../model/photo'
import PhotoService from '../service/photo'

const photoService = PhotoService()

const compress = new Compress()
export default {
  namespaced: true,
  state: {
    photos: [],
    uploads: [],
    src: '',
    caption: '',
    id: '',
    progress: 0,
    showPreview: false,
    previewId: '',
    file: null
  },
  getters: {
    photos (state) {
      return state.photos
    },
    uploads (state) {
      return state.uploads
    },
    progress (state): number {
      return state.progress
    },
    showPreview (state): boolean {
      return state.showPreview
    },
    previewModel (state): any {
      return state.uploads.find(p => p.id === state.previewId)
    },
    file (state): any {
      return state.file
    }
  },
  mutations: {
    SET_FIELD (state, { key, value }): void {
      state[key] = value
    },
    ADD_PHOTO (state, value: IPhoto): void {
      state.uploads = state.uploads.concat([value])
    },
    SET_PROGRESS (state, value: number): void {
      state.progress = value
    },
    DELETE_PREVIEW_PHOTO (state, value: string): void {
      state.uploads = state.uploads.filter(p => p.id !== value)
    },
    DELETE_PHOTO (state, value: string): void {
      state.photos = state.photos.filter(p => p.id !== value)
    },
    UPDATE_CAPTION (state, value: string): void {
      const targetId = state.previewId
      const model = state.uploads.find(p => p.id === targetId)
      const newModel = { ...model, caption: value }
      const updatedCollection = state.uploads.map((m) => {
        if (m.id === targetId) {
          return newModel
        }
        return m
      })
      state.uploads = updatedCollection
    },
    UPLOAD_PHOTOS (state): void {
      const uploads = state.uploads
      state.photos = state.photos.concat(uploads)
      state.uploads = []
    },
    SET_COLLECTION (state, value: IPhoto[]): void {
      state.photos = value
    }
  },
  actions: {
    async onSelectPhoto ({ commit }, evt): Promise<void> {
      let files = []
      for (let i = 0; i < evt.currentTarget.files.length; i += 1) {
        files.push(evt.currentTarget.files.item(i))
      }
      const hasFiles = files && files.length
      if (!hasFiles) return
      const photos = await compress.compress(files, {
        size: 2, // the max size in MB, defaults to 2MB 
        quality: .75, // the quality of the image, max is 1, 
        maxWidth: 1920, // the max width of the output image, defaults to 1920px 
        maxHeight: 1920, // the max height of the output image, defaults to 1920px 
        resize: true // defaults to true, set false if you do not want to resize the image width and height 
      })
      photos.forEach((source) => {
        const photo: IPhoto = {
          id: uuidv4(),
          name: source.alt,
          src: `${source.prefix}${source.data}`,
          caption: source.alt,
          created_at: new Date().toUTCString()
        }
        commit('ADD_PHOTO', photo)
      })
      commit('SET_FIELD', {
        key: 'file',
        value: null
      })
    },
    async onDeletePhoto ({ commit }, value: string) {
      try {
        const ok = window.confirm('Are you sure you want to delete the photo?')
        if (!ok) {
          return
        }
        const res = await photoService.delete(value)
        commit('DELETE_PHOTO', value)
      } catch (error) {
        console.log(error)
      }
    },
    onDeletePreviewPhoto ({ commit, state }, value: string) {
      commit('DELETE_PREVIEW_PHOTO', value)
    },
    onPreviewPhoto ({ commit, state }, value: string) {
      console.log('onPreviewPhoto', value)
      document.body.style.overflow = !state.showPreview ? 'hidden' : 'auto'
      commit('SET_FIELD', {
        key: 'showPreview',
        value: !state.showPreview
      })
      commit('SET_FIELD', {
        key: 'previewId',
        value
      })
    },
    onClickClosePreview ({ commit }) {
      document.body.style.overflow = false ? 'hidden' : 'auto'
      commit('SET_FIELD', {
        key: 'showPreview',
        value: false
      })
    },
    onChangeCaption ({ commit }, evt) {
      commit('UPDATE_CAPTION', evt.currentTarget.value)
    },
    async onUploadPhotos ({ state, commit, dispatch }) {
      try {
        const ok = await photoService.create({
          data: state.uploads
        })
        commit('UPLOAD_PHOTOS')
      } catch(error) {
        console.log(error.message)
        window.alert('You must be logged in to upload photo')
        dispatch('login/logout', null, { root: true })
      }
    },
    async onFetchPhotos ({ commit }) {
      const { data } = await photoService.all()
      if (data) {
        commit('SET_COLLECTION', data)
      }
    }
  }
}