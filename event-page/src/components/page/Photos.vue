<template>
  <div>
    <div class="page">
      <br>

        <!--Section displaying title and action buttons-->
        <div class="page-header">
          <div class="h1">{{title}}</div>
          <div class="page-header__actions">
            <button class="button-outline" @click="onSelectPhotos" :disabled="uploads.length >= 5">Select Photos</button>
            <input class="input-uploader" ref="uploader" type="file" accept="image/*" @change="onSelectPhoto" :value="file" multiple/>
            <button class="button" :disabled="!uploads.length" @click="onUploadPhotos">Upload</button>
          </div>
        </div>

        <!--Section displaying subheading and details on what photos can be uploaded-->
        <div class="page-subheader">
          Upload events photos here
        </div>

        <break space="10"/>

        <!--Section for uploading images-->
        <transition-group name="zoom" class="upload-wrapper">
          <div class="upload-thumbnail-wrapper" v-for="(model, i) in uploads" :key="model.id || i">
            <div class="upload-thumbnail" :style="mapBackgroundImage(model.src)"></div>
            <div class="upload-thumbnail__actions">
              <span></span>
              <Icon class="md-24" name="delete" @click="onDeletePreviewPhoto(model.id)"/>
              <Icon class="md-24" name="visibility" @click="onPreviewPhoto(model.id)"/>
              <span></span>
            </div>
          </div>
        </transition-group>

        <!--Modal for previewing the image-->
        <modal :show="showPreview" @close="onClickClosePreview" v-if="previewModel">
          <div class="modal-photo-preview">
            <img :src="previewModel.src" alt="" width="100%" height="auto">
          </div>
          <div>
            <input
              class="text-input input-caption" 
              type="text" 
              placeholder="Enter your photo caption here" 
              @keyup="onChangeCaption"
              :value="previewModel.caption"
            />
          </div>
        </modal>

      <br>
    </div>

    <!--Display the timeline photos-->
    <div class="photos">
        <div class="image-wrapper" v-for="model in photos">
          <photo-grid v-bind="model" @delete="onDeletePhoto" :isAuthorized="isAuthorized"/>
          <break space="20"/>
        </div>
    </div>

    <placeholder v-if="!photos.length">
      No photos to see? Decorate this wall with photos you took from events.
    </placeholder>
  </div>
</template>

<script>
import Break from '../atom/Break'
import Icon from '../atom/Icon'
import Modal from '../atom/Modal'
import Placeholder from '../atom/Placeholder'
import PhotoGrid from '../molecule/PhotoGrid'
import { mapActions, mapGetters } from 'vuex'
import mapper from '../../store/helpers/mapper'

export default {
  name: 'page-photos',
  beforeMount () {
    this.src = ''
    this.onFetchPhotos()
  },
  components: {
    Break,
    Icon,
    Modal,
    PhotoGrid,
    Placeholder
  },
  data () {
    return {
      title: 'Photos'
    }
  },
  computed: {
    ...mapGetters('photo', [
      'photos',
      'uploads',
      'progress',
      'showPreview',
      'previewModel',
      'file'
    ]),
    ...mapGetters(['isAuthorized'])
  },
  methods: {
    ...mapActions('photo', [
      'onSelectPhoto',
      'onDeletePhoto',
      'onDeletePreviewPhoto',
      'onPreviewPhoto',
      'onClickClosePreview',
      'onChangeCaption',
      'onUploadPhotos',
      'onFetchPhotos'
    ]),
    ...mapper,
    onSelectPhotos () {
      this.$refs.uploader.click()
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  align-items: center;
}
.page-header__actions {
  text-align: right;
}
.page-subheader {
  color: $dove-gray;
}
.upload-wrapper {
  position: relative;
}
$thumbnail-dimension: 80px;

.upload-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, $thumbnail-dimension);
  grid-column-gap: $dim-100;
}
.upload-wrapper > div {
  display: inline-block
}
.upload-thumbnail-wrapper {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  height: $thumbnail-dimension;
  width: $thumbnail-dimension;
  display: inline-block;
  border: 1px solid $gallery;
}
.upload-thumbnail {
  height: $thumbnail-dimension;
  width: $thumbnail-dimension;
}

.upload-thumbnail-wrapper:hover .upload-thumbnail__actions {
  // display: grid;
  opacity: 1;
}
.upload-thumbnail__actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $layer-100;
  color: rgba(white, .6);
  display: grid;
  align-content: center;
  grid-template-columns: $dim-50 1fr 1fr $dim-50;
  opacity: 0;
  justify-content: center;
  text-align: center;
  background: rgba(black, .4);
  transition: .134s all ease-out;
}

.upload-thumbnail__actions > i {
  cursor: pointer;
}

.upload-thumbnail__actions > i:hover {
  color: white;
}

.input-uploader {
  display: none;
}

.photos {
  max-width: $max-column-width;
  margin: 0 auto;
}

.zoom-enter-active, zoom-leave-active {
  transition: all .134s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 1;
  transform: scale(1);
}
.zoom-enter, .zoom-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.05;
  transform: scale(.6);
}
</style>
