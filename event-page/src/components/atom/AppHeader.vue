<template>
  <div class="app-header">
    <div class="app-header_icon-wrapper">
      <i @click="toggle" class="material-icons app-header_icon">menu</i>
    </div>
    <div class="app-header_col-center">
      <span><router-link to="/home" class="home-link">{{title}}</router-link></span>
    </div>
    <div class="app-header_col-right">
      <router-link to="/home" class="header-link user-wrapper" v-if="isAuthorized">
        <div class="user-photo" :style="mapBackgroundImage(picture)"></div> {{nickname || 'Admin'}}
      </router-link>
      <router-link to="/login" class="header-link" v-else>Login</router-link>

      <!--&nbsp;
      <router-link to="/register" class="header-link">Register</router-link>-->
    </div>
  </div>
</template>
 
<script>
import { mapActions, mapGetters } from 'vuex'
import mapper from '../../store/helpers/mapper'
export default {
  name: 'app-header',
  data () {
    return {
      title: 'Engineers.my'
    }
  },
  computed: {
    ...mapGetters(['isAuthorized', 'nickname', 'picture'])
  },
  methods: {
    ...mapActions('sidebar', ['toggle']),
    ...mapper
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';


%app-header-layout {
  grid-row: 1;
  grid-column: 1 / 4;
  display: grid;
  grid-template-columns: 20px [app-menu] 40px minmax(0, 1fr) [userinfo] 160px 20px;
  grid-template-rows: 40px;
}


.app-header {
  @extend %app-header-layout;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: $heliotrope;
  color: white;
  box-shadow: 0 5px 10px rgba(black, .2);
  font-weight: bold;
}

.app-header_icon-wrapper {
  grid-column: 2 / 3;
  display: grid;
  align-self: center;
  justify-self: center;
  cursor: pointer;
  opacity: .75;
}

.app-header_icon-wrapper.is-disabled {
  opacity: .4;
}

.app-header_icon-wrapper:hover {
  opacity: 1;
}

.app-header_col-center {
  grid-column: 3 / 4;
}
.app-header_col-right {
  grid-column: 4 / 5;
  text-align: right;
}

.home-link {
  @extend %link;
  color: white;
  text-decoration: none;
}

.header-link {
  @extend %link;
  @extend %h6;
  color: rgba(white, .8);
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  max-width: 100%;
  padding: 0 $dim-50;
}

.header-link:hover {
  color: white;
}

.user-wrapper {
  transition: .174s all ease-out;
  height: 35px;
  line-height: 35px;
  margin: #{$dim-50/2} 0;
  border-radius: 5px;
}
.user-wrapper:hover {
  background: rgba(white, .2);
}
.user-photo {
  height: 25px;
  width: 25px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 5px;
}

</style>
