<template>
    <div class="shimmer" :class="{'is-animating': isLoading}"></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'app-shimmer',
  computed: {
    ...mapGetters('page', ['isLoading'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

@keyframes shimmer {
   from {
     background-position: 0 0;
   }
   to { 
     background-position: 100vw 0;
   }
}

.shimmer.is-animating {
    background: linear-gradient(90deg, rgba($heliotrope, .1), $heliotrope, rgba($heliotrope, .1));
    background-position: 0 0;
    animation: shimmer 1s linear infinite;
}
.shimmer {
    height: 5px;
    width: 100%;
    display: block;
    grid-row: 2;
    grid-column: 1 / -1;
}
</style>



