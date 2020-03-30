<template>
    <div class="dimension">
      <b-form-group id="input-group-1" label="Dimension Name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="dim.name"
          required>
          </b-form-input>
      </b-form-group>  
      <b-form-group id="input-group-2" label="Attributes for dimension seperated by commas:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="dim.attributes"
          required>
          </b-form-input>
      </b-form-group>
    </div>
</template>

<script>
  export default {
    name: "AddDimension",
    props: ['dim']
    // data() {
    //   return {
    //     dimensionName: "",
    //     attributes: ""
    //   };
    
    };
</script>