<template>
    <div class="page">

      <br>

        <div class="page-title">
          {{title}}
        </div>

      <br>

      <div>
        <label for="" class="label">Name</label>
        <input type="text" class="text-input" placeholder="Enter your event name">
      </div>

      <br>

      <div>
        <label for="" class="label">URL</label>
        <input type="text" class="text-input" placeholder="Enter your event link">
      </div>

      <br>

      <div>
        <label for="" class="label">Event Date</label>
        <input type="date" class="text-input" placeholder="Enter your event date">
      </div>

      <br>

      <div>
        <label for="" class="label">Event Tags</label>
        <div>
          <input type="text" class="" placeholder="Enter your event date">
        </div>
      </div>

      <br>

      <div>
        <button class="button">Create</button>
      </div>

      <br>
    </div>
</template>

<script>
export default {
  name: 'page-create',
  data () {
    return {
      title: 'Create Event'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.page {
  @extend %page;
  margin: $dim-100 auto;
  max-width: 480px;
}

.page-title {
  
}

</style>
