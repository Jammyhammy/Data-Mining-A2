<template>
    <div class="dimension">
      <b-form-group :label="`Dimension #${dim.id+1}`">
        <b-form-radio v-model="dim.selected" :name="`${dim.id} some-radios`" value="A" :disabled="!!nocreate">Create new dimension</b-form-radio>
        <b-form-radio v-model="dim.selected" :name="`${dim.id} some-radios`" value="B" :disabled="!!noexist">Use pre-existing dimension</b-form-radio>
      </b-form-group>
      <div class="mt-3">Selected: <strong>{{ dim.selected }}</strong></div>

      <template v-if="dim.selected === 'B'">
        <div class="dimension-form">
          <b-form-group id="input-group-6" label="Dimension:" label-for="input-6">
            <b-form-select
              id="input-6"
              v-model="dimension"
              :options="options"
              @change="onDimChange($event)"
            >
            <template v-slot:first>
              <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
            </template>      
            </b-form-select>
          </b-form-group>
        </div>
      </template>

      <template v-if="dim.selected === 'A'">
        <b-form-group id="input-group-1" label="Dimension Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="dim.name"
            required>
            </b-form-input>
        </b-form-group>  
        <b-form-group id="input-group-2" label="Attributes for dimension - Order from board to narrow (seperated by commas):" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="dim.attributes"
            required>
            </b-form-input>
        </b-form-group>
      </template>

    </div>
</template>

<script>
  export default {
    name: "AddDimension",
    props: ['dim', 'options', 'nocreate', 'noexist'],
    data () {
      return {
        dimension: null
      }
    },
    methods: {
      onDimChange(evt) {
        //console.log(evt)
        this.dim.name = this.dimension.name;
        //this.dim.attributes = this.dimension.attributes;
        //this.$emit('input', this.dimension)
      }
    }
    // data() {
    //   return {
    //     dimensionName: "",
    //     attributes: ""
    //   };
    
    };
</script>