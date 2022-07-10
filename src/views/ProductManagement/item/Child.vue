<template>
  <div>
    <slot name="top" :myUser="user"></slot>
    <br/>
    <slot name="bottom"></slot>
    <br/>
  </div>
</template>




<script>
 export default {
   name: 'test',
   data() {
     return {
       user: "Ross"

     }
   }
 }
</script>
