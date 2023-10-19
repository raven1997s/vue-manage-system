<template>
  <div class="image-container">
    <img :src="imagePath" alt="Home Screenshot" class="styled-image" />
  </div>
</template>

<script>
import homeImage from '../assets/img/home.jpg';

export default {
  data() {
    return {
      imagePath: homeImage,
    };
  },
};
</script>


<style>
.image-container {
  background: url("assets/screenshots/home.jpg") center center no-repeat;  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>


