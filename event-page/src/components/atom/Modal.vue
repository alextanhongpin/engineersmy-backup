<template>
  <transition name="modal">
    <div class="overlay" v-if="show" data-ns="close" @click="onClickCloseOverlay">
        <div class="modal">
          <div class="modal-close" @click="onClickClose" data-ns="close" title="Click to close the popup">
            <Icon name="close"/>
          </div>
          <slot></slot>
        </div>
    </div>
  </transition>
</template>

<script>
import Icon from './Icon'
export default {
  name: 'modal',
  props: {
    show: { type: Boolean }
  },
  components: {
    Icon
  },
  methods: {
    onClickCloseOverlay (evt) {
      if (evt.target.dataset.ns === 'close') {
        this.$emit('close', evt)
      }
    },
    onClickClose (evt) {
      this.$emit('close', evt)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(black, .5);
  z-index: $layer-200;
  display: grid;
  max-height: 100vh;
  grid-template-columns: 1fr 10px minmax(0, 940px) 10px 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.modal {
  background: white;
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  border-radius: 5px;
  padding: $dim-100;
  position: relative;
  // Enable scrolling within the modal
  scroll-behavior: smooth;
  overflow-y: scroll;
  height: 100%;
  max-height: 100vh;
}

.modal-close {
  position: absolute;
  right: $dim-100;
  cursor: pointer;
  color: $dove-gray;
}

.modal-close:hover {
  color: $color-primary;
}

.modal-enter-active, modal-leave-active {
  transition: all .4s;
  opacity: 1;
}
.modal-enter, .modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  // transform: scale(0.4);
}

.modal-enter-active .modal, 
.modal-leave-active .modal {
  transition: all .4s;
  opacity: 1;
}
.modal-enter .modal,
.modal-enter .modal {
  transform: translate3d(0, -100px, 0);

}
</style>
