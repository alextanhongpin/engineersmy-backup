<template>
    <transition name="fade">
        <div class="sidebar-wrapper" v-if="isOpen">
            <div 
                class="sidebar-empty" 
                @click="toggle"
            ></div>
            <div class="sidebar">
                <h1>{{title}}</h1>
                <br>
                <div v-for="route in routes">
                    <div @click="toggle"><router-link class="no-link" :to="route.path">{{route.name}}</router-link></div>
                    <br>
                </div>
                <div class="no-link logout" @click="logout" v-if="isAuthorized">Logout</div>
            </div>
        </div>
    </transition>
    
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'sidebar',
  data () {
    return {
      title: 'Sidebar',
      routes: [
        {
          path: '/home',
          name: 'Home'
        },
        {
          path: '/photos',
          name: 'Photo'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('sidebar', ['isOpen']),
    ...mapGetters(['isAuthorized'])
  },
  methods: {
    ...mapActions('login', ['logout']),
    ...mapActions('sidebar', ['toggle'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import '../../styles/theme.scss';
.sidebar-wrapper {
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: minmax(100vh, 100%);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: $layer-200;
}

.sidebar-empty {
    grid-column: 2;
    grid-row: 1;

    background: rgba(black, .15);
    width: calc(100vw + 240px);
    height: 100vh;
}

.sidebar {
    grid-column: 1;
    grid-row: 1;

    height: 100vh;
    background: white;
    padding: 0 20px;
}

.fade-enter-active,
.fade-leave-active  {
    transition: .174s all ease-out;
    transform: translate3d(0, 0, 0);
    opacity: 1;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translate3d(-240px, 0, 0);
}

.logout {
    cursor: pointer;
}

</style>
