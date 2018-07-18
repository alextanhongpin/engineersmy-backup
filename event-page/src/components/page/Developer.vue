<template>
    <div>
    
      <h1>{{title}}</h1>

      <div>
        <input class="search" type="search" placeholder="Search for developers"/>
      </div>

      <break/>
    
      <div class="card">
        <img class="card-photo" :src="picture"/>
        <div class="card-info-wrapper">
          <div><b>{{name}}</b></div>
          <div>{{nickname}}</div>
          <div><a :href="mailto" class="card-email link">{{email}}</a></div>
          <break :space="10"/>
          <div>
            <span class="tag">JavaScript</span>
            <span class="tag">Go</span>
          </div>
        </div>
        <break :space="10"/>

      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Break from '../atom/Break'
export default {
  name: 'template',
  components: {
    Break
  },
  data () {
    return {
      title: 'Developers'
    }
  },
  computed: {
    ...mapGetters(['name', 'email', 'nickname', 'picture']),
    mailto () {
      return `mailto:${this.email}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.search {
  @extend %h6;
  height: 35px;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  border: none;
  border-radius: $dim-50;
  padding: 0 $dim-100;
  box-shadow: 0 5px 40px rgba(black, .2);
}

.card {
  width: 200px;
  display: inline-block;
  background: white;
  border-radius: $dim-50;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(black, .2);
}
.card-photo {
  width: 100%;
  height: auto;
}

.card-info-wrapper {
  padding: 0 $dim-100;
  width: 100%;
}

.card-email {
  display: inline-block;
}

.tag {
  @extend %h6;
  background: $color-primary;
  color: white;
  padding: 0 $dim-50;
  border-radius: $dim-50;
}
</style>
