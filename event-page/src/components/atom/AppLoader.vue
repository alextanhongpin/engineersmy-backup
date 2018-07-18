<template>
    <i class="material-icons md-animate-rotate">sync</i>
</template>

<script>
export default {
  name: 'app-loader'
}
</script>

<style lang="scss" scoped>

.material-icons.md-animate-rotate {
    animation: rotate 1s ease-out infinite;
}

@keyframes rotate {
    from {
        transform: rotateZ(0deg);
    }
    to {
        transform: rotateZ(-360deg);
    }
}
</style>