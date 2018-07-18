<template>
    <div class="page">
        <br>    
        <h1>{{title}}</h1>

        <h4>Login now to view listings</h4>

        <div>
            <label class="label" for="">Email</label>
            <input @keyup="onChangeEmail" @keydown="onEnter" class="text-input" type="email" :value="email"/>
        </div>
        
        <br>

        <div>
            <label class="label" for="">Password</label>
            <input @keyup="onChangePassword" @keydown="onEnter" class="text-input" type="password" :value="password"/>
        </div>

        <br>
        
        <button @click="onSubmitLogin" class="button">Continue</button>

        <br>
        <br>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      title: 'Login'
    }
  },
  beforeMount () {
    this.onMagicLink()
    //this.onBeforeLoadLoginPage()
  },
  computed: {
    ...mapGetters('login', ['email', 'password'])
  },
  methods: {
    ...mapActions('login', [
      'onChangeEmail',
      'onChangePassword',
      'onSubmitLogin',
      'onEnter',
      'onBeforeLoadLoginPage',
      'onMagicLink'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.page {
    @extend %page;
    max-width: 480px;
}
</style>
