<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Data mart name:"
        label-for="input-1"
        description="Scroll down if you've created one">
        <b-form-input
          id="input-1"
          v-model="form.mart"
          required
          placeholder="Enter data mart name"></b-form-input>
      </b-form-group>


      <b-form-group id="input-group-4" label-for="input-4">
        <label for="dim-sb">Number of Dimensions:</label>
        <b-form-spinbutton id="dim-sb" v-model="dimNum" @change="onDimChange($event)" min="0" max="10">
        </b-form-spinbutton>
      </b-form-group>

      <AddDimension v-for="dim in form.dimensions" 
                    v-bind:key="dim.id" 
                    v-bind:dim="dim">
      </AddDimension>      

      <b-form-group id="input-group-2" label="Fact table name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.fact"
          required></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Measures seperated by commas:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.measures"
          required></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="This is what will be submitted">
      <pre class="m-0">{{ form }}</pre>
    </b-card>

    <h1>Select a data mart:</h1>
    <b-form-group id="input-group-5" label="Data Mart:" label-for="input-5">
      <b-form-select
        id="input-5"
        v-model="dataMart"
        :options="dataMartOptions"
        @change="onMartChange($event)" 
      >
      <template v-slot:first>
        <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
      </template>      
      </b-form-select>
    </b-form-group>

    <template v-if="+dataMart > 0">
      <div class="dimension-form">
        <b-form-group id="input-group-6" label="Dimension:" label-for="input-6">
          <b-form-select
            id="input-6"
            v-model="dimension"
            :options="dimensionOptions"
            @change="onMartDimChange($event)" 
          >
          <template v-slot:first>
            <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
          </template>      
          </b-form-select>
        </b-form-group>
      <template v-if="addForm.format.length > 0">
        <div class="add-record-form">
          <b-form-group id="input-group-7" label-for="input-7">
            <label for="input-7">Add record to dimension {{addForm.name}} in format: {{addForm.format}}</label>          
            <b-form-input
              id="input-7" 
              v-model="addForm.record"></b-form-input>
          </b-form-group>
        <b-button type="button" variant="primary" @click="onRecordSubmit($event)">Submit</b-button>
        </div>
      </template>
      </div>
    </template>

  </div>
</template>

<script>
import axios from 'axios'
import AddDimension from "../components/AddDimension.vue"
export default {
  name: 'HelloWorld',
  data () { // shorthand for data: function()
    return {
      msg: "It'sa me mario",
      uri: "http://localhost:5000",
      dimNum:0,
      form: {
        mart: '',
        fact: '',
        dimensions: [],
        measures:'',
      },
      show: true,
      dataMartOptions: [{DataMartID: 0, Name:""}],
      dataMart: null,
      dimensionOptions: [],
      dimension: null,
      addForm: {
        name: '',
        format: '',
        record: ''
      }
    }
  },
  components: {
    AddDimension
  },
  created() {
    //axios.get("http://localhost:5000/getTest").then(response => (this.msg = response.data.Data[0].Text))
    axios.get("http://localhost:5000/getQuery?sql=" + encodeURIComponent("SELECT * FROM DataMart"))
    .then(response => {
      this.dataMartOptions = response.data.map((x) => ({'value': x.DataMartID, 'text': x.Name}));
    })
    .catch(error => (console.log(error)))
  },
  methods: {
    onDimChange(evt) {
      this.form.dimensions = [];
      for(var i = 0; i < this.dimNum; i++) {
        this.form.dimensions.push({
          id:i,
          name:"",
          attributes:""
        })
      }
    },
    onMartChange(evt) {
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Dimension WHERE DataMartID = ${evt}`))
      .then(response => {
        this.dimensionOptions = response.data.map((x) => ({'value': {'id': x.DimensionID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))
    },
    onMartDimChange(evt) {
      //Select dimension
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT column_name from information_schema.columns where table_name = '${evt.name}'`))
      .then(response => {
        response.data.shift()
        var dm = response.data.map((x) => name = `'${x.column_name}'`).reduce( (a,x) => `${a},${x}`)
        this.addForm.name = this.dimension.name;
        this.addForm.format = dm;
      })
      .catch(error => (console.log(error)))
    },
    onRecordSubmit(evt) {
      var query = `INSERT INTO ${this.addForm.name} VALUES (${this.addForm.record})`
      var body = {sql: query}
      console.log(body)
      axios.post(`${this.uri}/postQuery`, body)
        .then(response => {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        });       
    },            
    onSubmit(evt) {
      evt.preventDefault()
      axios.post(`${this.uri}/postForm`, this.form)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });      
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.mart = ''
      this.form.fact = ''
      this.form.measures = ""
      this.form.dimensions = []
      this.dimNum = 0
      this.dimNum = 2
      this.form.mart = 'ddm_ttest'
      this.form.fact = 'ffact_ttest'
      this.form.measures = "ffact_bblep1,ffact_bblep2"
      this.form.dimensions = [
        {
          "id": 0,
          "name": "bbdm_test1",
          "attributes": "bbdim_test1_1,bbdim_test1_2"
        },
        {
          "id": 1,
          "name": "bbdm_test2",
          "attributes": "bbdim_test2_1,bbdim_test2_2"
        }
      ]
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
