<template>
  <div class="hello">
    <h1></h1>

    <b-form-group label="Select or create a data mart?">
      <b-form-radio v-model="selected" name="blep-radios" value="A">Create new data mart</b-form-radio>
      <b-form-radio v-model="selected" name="blep-radios" value="B">Select existing data mart</b-form-radio>
      <b-form-radio v-model="selected" name="blep-radios" value="C">All-in-one</b-form-radio>
    </b-form-group>
    <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>    
    <template v-if="selected === 'A'">
      <h3>Creating a Data Mart.</h3>
      <b-form @submit="onDataSubmit" v-if="show">
        <b-form-group
          id="dm-input-group-1"
          label="Data mart name:"
          label-for="dm-input-1"
          description="Scroll down if you've created one">
          <b-form-input
            id="dm-input-1"
            v-model="addMartForm.mart"
            required
            placeholder="Enter data mart name"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </template>
    <template v-if="selected === 'C'">
      <h3>Creating a Data Mart with everything.</h3>
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
                      v-bind:dim="dim"
                      v-bind:options="createDimensionOptions">
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
    </template>
    
    <template v-if="selected === 'B'">
      
      <b-form-group id="input-group-5" label="Select a Data Mart:" label-for="input-5">
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

        <div class="create-dimension-form">
          <h3>Creating dimensions and its attributes for the specified Data Mart.</h3>
          <b-form @submit="onCDSubmit" v-if="show">
            <b-form-group id="cdinput-group-4" label-for="cdinput-4">
              <label for="cddim-sb">Number of Dimensions:</label>
              <b-form-spinbutton id="cddim-sb" v-model="cdDimNum" @change="onCDDimChange($event)" min="0" max="10">
              </b-form-spinbutton>
            </b-form-group>

            <AddDimension v-for="dim in cdform.dimensions" 
                          v-bind:key="dim.id" 
                          v-bind:dim="dim"
                          v-bind:options="createDimensionOptions"
                          v-bind:noexist="true">
            </AddDimension>      



            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </div>

        <div class="dimension-form">
          <h3>Input records for dimensions.</h3>
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

        <div class="create-fact-form">
          <h3>Creating fact table with selected dimensions for the specified Data Mart.</h3>
          <b-form @submit="onCFSubmit" v-if="show">
            <label for="cfdim-sb">Number of Dimensions:</label>
            <b-form-spinbutton id="cfdim-sb" v-model="cfDimNum" @change="onCFDimChange($event)" min="0" max="10">
            </b-form-spinbutton>
            </b-form-group>

            <AddDimension v-for="dim in cfform.dimensions" 
                        v-bind:key="dim.id" 
                        v-bind:dim="dim"
                        v-bind:options="createDimensionOptions"
                        v-bind:nocreate="true">
            </AddDimension>      

            <b-form-group id="cfinput-group-2" label="Fact table name:" label-for="cfinput-2">
              <b-form-input
                id="cfinput-2"
                v-model="cfform.fact"
                required></b-form-input>
            </b-form-group>

            <b-form-group id="cfinput-group-3" label="Measures seperated by commas:" label-for="cfinput-3">
              <b-form-input
                id="cfinput-3"
                v-model="cfform.measures"
                required></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </div>

        <div class="fact-form">
          <h3>Input records for facts.</h3>
          <b-form-group id="finput-group-6" label="Fact:" label-for="finput-6">
            <b-form-select
              id="finput-6"
              v-model="fact"
              :options="factOptions"
              @change="onMartFactChange($event)" 
            >
            <template v-slot:first>
              <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
            </template>      
            </b-form-select>
          </b-form-group>
        <template v-if="addFact.format.length > 0">
          <div class="add-fact-form">
            <b-form-group id="finput-group-7" label-for="finput-7">
              <label for="finput-7">Add record to dimension {{addFact.name}} in format: {{addFact.format}}</label>          
              <b-form-input
                id="finput-7" 
                v-model="addFact.record"></b-form-input>
            </b-form-group>
          <b-button type="button" variant="primary" @click="onFactSubmit($event)">Submit</b-button>
          </div>
        </template>
        </div>

        <h3>Get Star Schema</h3>
        <b-button type="button" variant="primary" @click="getStarSchema($event)">Star Schema</b-button>
        <div v-if="tables.length > 0">
          <h3 style="margin-top:15px;">Star Schema for Data Mart:</h3>
          <div v-for="item in tables">
              <h5 style="margin-top:25px;">{{item.type}} table</h5>
              <table class="vue-table" align="center">
                <tr>
                  <th>{{item.name}}</th>
                </tr>
                <tr v-for="col in item.columns">
                  <td>{{col}}</td>
                </tr>
              </table>
          </div>
        </div>

        
        <div class="olap-form">
          <h3 style="margin-top:25px;">Performing OLAP operation.</h3>
          <b-form-group id="olinput-group-6" label="Select a dimension to perform OLAP operations:" label-for="olinput-6">
            <b-form-select
              id="olinput-6"
              v-model="olapDimension"
              :options="dimensionOptions"
              @change="onOLAPDimChange($event)">
            <template v-slot:first>
              <b-form-select-option value="" disabled>-- Please select an option --</b-form-select-option>
            </template>      
            </b-form-select>
          </b-form-group>
          
          <template v-if="olapForm.format.length > 0">
            <div class="add-olap-form">
              <b-form-group id="olinput-group-7" label-for="olinput-7">
                <label for="olinput-7">Specify measures for {{olapForm.name}}. Example format for measure: {{olapForm.format}}</label>          
                <b-form-input
                  id="olinput-7" 
                  v-model="olapForm.measure"></b-form-input>
              </b-form-group>
            <b-button type="button" variant="primary" @click="onOlapSubmit($event)">Submit</b-button>
            </div>
            <template v-if="olapResults.length > 0">
              <b-table striped hover :items="olapResults"></b-table>
            </template>
          </template>
        </div>  
      </template>
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
      olDimNum:0,
      cdDimNum:0,
      cfDimNum:0,
      form: {
        mart: '',
        fact: '',
        dimensions: [],
        measures:'',
      },
      cdform: {
        dimensions: []
      },
      cfform: {
        dimensions:[],
        fact: '',
        measures:''
      },
      show: true,
      dataMartOptions: [{DataMartID: 0, Name:""}],
      dataMart: null,
      dimensionOptions: [],
      factOptions: [],
      olapDimension: null,
      dimension: null,
      fact: null,
      createDimensionOptions: [],
      addMartForm: {
        name:''
      },
      addForm: {
        name: '',
        format: '',
        record: ''
      },
      addFact: {
        name: '',
        format: '',
        record: ''
      },  
      olapForm: {
        name: '',
        format: '',
        record: '',
        measures: [],
        columns: []
      },
      olapResults: [],        
      selected: '',
      tables: []
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
    axios.get("http://localhost:5000/getQuery?sql=" 
    + encodeURIComponent(`SELECT * FROM Dimension`))
    .then(response => {
      this.createDimensionOptions = response.data.map((x) => ({'value': {'id': x.DimensionID, 'name':x.Name}, 'text': x.Name}));
    })
    .catch(error => (console.log(error)))
    
  },
  methods: {
    refresh() {
      axios.get("http://localhost:5000/getQuery?sql=" + encodeURIComponent("SELECT * FROM DataMart"))
      .then(response => {
        this.dataMartOptions = response.data.map((x) => ({'value': x.DataMartID, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Dimension`))
      .then(response => {
        this.createDimensionOptions = response.data.map((x) => ({'value': {'id': x.DimensionID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Dimension WHERE DataMartID = ${this.dataMart}`))
      .then(response => {
        this.dimensionOptions = response.data.map((x) => ({'value': {'id': x.DimensionID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))   
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Fact WHERE DataMartID = ${evt}`))
      .then(response => {
        this.factOptions = response.data.map((x) => ({'value': {'id': x.FactID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))              
    },
    onDimChange(evt) {
      this.form.dimensions = [];
      for(var i = 0; i < this.dimNum; i++) {
        this.form.dimensions.push({
          id:i,
          name:"",
          attributes:"",
          dimension: null,
          selected:"A"
        })
      }
    },
    onOLDimChange(evt) {
      this.olapForm.measures = [];
      for(var i = 0; i < this.olDimNum; i++) {
        this.olapForm.measures.push({
          id:i,
          name:"",
        })
      }
    },    
    onCDDimChange(evt) {
      this.cdform.dimensions = [];
      for(var i = 0; i < this.cdDimNum; i++) {
        this.cdform.dimensions.push({
          id:i,
          name:"",
          attributes:"",
          dimension: null,
          selected:"A"
        })
      }
    },
    onCFDimChange(evt) {
      this.cfform.dimensions = [];
      for(var i = 0; i < this.cfDimNum; i++) {
        this.cfform.dimensions.push({
          id:i,
          name:"",
          attributes:"",
          dimension: null,
          selected:"B"
        })
      }
    },
    onDataSubmit(evt) {
      var query = `INSERT INTO [dbo].[DataMart] ([Name]) VALUES ('${this.addMartForm.mart}')`
      var body = {sql: query}
      console.log(body)
      axios.post(`${this.uri}/postQuery`, body)
      .then(response => {
        this.$bvToast.toast(`${query} was successful!`, {
          title: 'Your sql submitted successfully.',
          autoHideDelay: 3000
        })        
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });   
    }, 
    onMartChange(evt) {
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Dimension WHERE DataMartID = ${evt}`))
      .then(response => {
        this.dimensionOptions = response.data.map((x) => ({'value': {'id': x.DimensionID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT * FROM Fact WHERE DataMartID = ${evt}`))
      .then(response => {
        this.factOptions = response.data.map((x) => ({'value': {'id': x.FactID, 'name':x.Name}, 'text': x.Name}));
      })
      .catch(error => (console.log(error)))      
    },
    onMartFactChange(evt) {
      //Select fact
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT column_name from information_schema.columns where table_name = '${evt.name}'`))
      .then(response => {
        debugger;
        response.data.shift()
        var dm = response.data.map((x) => name = `'${x.column_name}'`).reduce( (a,x) => `${a},${x}`)
        this.addFact.name = this.fact.name;
        this.addFact.format = dm;
      })
      .catch(error => (console.log(error)))
    },
    getStarSchema(evt) {
      evt.preventDefault()
      var app = this;
      app.tables = [];
      var martId = app.dataMart
      console.log(app.dimensionOptions);
      for(var i =0; i< app.dimensionOptions.length; i++) {
        var dim = app.dimensionOptions[i];
        const bleptext = dim.text;
        axios.get("http://localhost:5000/getQuery?sql=" 
        + encodeURIComponent(`SELECT column_name from information_schema.columns where table_name = '${dim.text}'`))
        .then(response => {
          app.tables.push({name: bleptext, type: 'dimension', columns: response.data.map((x) => name = `'${x.column_name}'`)})
          console.log(app.tables)
        })
        .catch(error => (console.log(error)))
      }
      console.log(app.factOptions);
      for(var i =0; i< app.factOptions.length; i++) {
        var f = app.factOptions[i];
        const whydoyou=f.text;
        axios.get("http://localhost:5000/getQuery?sql=" 
        + encodeURIComponent(`SELECT column_name from information_schema.columns where table_name = '${f.text}'`))
        .then(response => {
          app.tables.push({name: whydoyou, type: 'fact', columns: response.data.map((x) => name = `'${x.column_name}'`)})
          console.log(app.tables)
        })
        .catch(error => (console.log(error)))
      }      
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
    onOLAPDimChange(evt) {
      //Select dimension
      this.olapResult = [];
      axios.get("http://localhost:5000/getQuery?sql=" 
      + encodeURIComponent(`SELECT column_name from information_schema.columns where table_name = '${evt.name}'`))
      .then(response => {
        response.data.shift()
        var dm = response.data.map((x) => name = `${x.column_name}`).reduce( (a,x) => `${a},${x}`)
        this.olapForm.columns = response.data.map((x,i) => ({value: i, text: x.column_name}));
        debugger;
        this.olapForm.name = this.olapDimension.name;
        this.olapForm.format = dm;
      })
      .catch(error => (console.log(error)))
    },
    onOlapSubmit(evt) {
      console.log(this.olapForm.measure)
      if(this.olapForm.measure.indexOf(',') === -1) {
        axios.get("http://localhost:5000/getQuery?sql=" 
        + encodeURIComponent(`SELECT ${this.olapForm.measure}, COUNT(*) AS 'Count' from ${this.olapForm.name} GROUP BY ${this.olapForm.measure} WITH ROLLUP`))
        .then(response => {
          this.olapResults = response.data
        })
        .catch(error => (console.log(error)))
      } else {
        axios.get("http://localhost:5000/getQuery?sql=" 
        + encodeURIComponent(`SELECT ${this.olapForm.measure}, COUNT(*) AS 'Count' from ${this.olapForm.name} GROUP BY ${this.olapForm.measure} WITH ROLLUP`))
        .then(response => {
          this.olapResults = response.data
        })
        .catch(error => (console.log(error)))
      }
    },
    onRecordSubmit(evt) {
      var query = `INSERT INTO ${this.addForm.name} VALUES (${this.addForm.record})`
      var body = {sql: query}
      console.log(body)
      axios.post(`${this.uri}/postQuery`, body)
      .then(response => {
        this.$bvToast.toast(`${query} was successful!`, {
          title: 'Your sql submitted successfully.',
          autoHideDelay: 3000
        })           
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });       
    },
    onFactSubmit(evt) {
      var query = `INSERT INTO ${this.addFact.name} VALUES (${this.addFact.record})`
      var body = {sql: query}
      console.log(body)
      axios.post(`${this.uri}/postQuery`, body)
      .then(response => {
        this.$bvToast.toast(`${query} was successful!`, {
          title: 'Your sql submitted successfully.',
          autoHideDelay: 3000
        })           
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });       
    },    
    onCDSubmit(evt) {
      evt.preventDefault()
      //console.log(result)
      console.log(this.dataMart);
      var martId = this.dataMart
      for(var i = 0; i < this.cdform.dimensions.length; i++) {
          var dim = this.cdform.dimensions[i]
          if(dim.selected === 'A') {
              var query = `EXEC spBuildDimensionTable '${dim.name}', ${martId}, '${dim.attributes}'`
              var body = {sql: query}
              console.log(body)
              axios.post(`${this.uri}/postQuery`, body)
              .then(response => {
                this.$bvToast.toast(`${query} was successful!`, {
                  title: 'Your sql submitted successfully.',
                  autoHideDelay: 3000
                })                   
                console.log(response)
              })
              .catch(function (error) {
                console.log(error);
              });
          }
      }
      //refresh()       
    },
    onCFSubmit(evt) {
      evt.preventDefault()
      console.log(this.dataMart);
      var martId = this.dataMart
      var fact = this.cfform.fact;
      var measures = this.cfform.measures;
      var dm = this.cfform.dimensions.map((x) => name = x.name).reduce( (a,x) => `${a},${x}`)
      var query4 = `EXEC spBuildFactTable '${fact}', ${martId}, '${measures}', '${dm}'`
      console.log(query4)  
      var query = query4
      var body = {sql: query}
      console.log(body)
      axios.post(`${this.uri}/postQuery`, body)
      .then(response => {
        this.$bvToast.toast(`${query} was successful!`, {
          title: 'Your sql submitted successfully.',
          autoHideDelay: 3000
        })           
        console.log(response)
      })
      .catch(function (error) {
        this.$bvToast.toast(`${query} had an error, please reload the page.`, {
          title: 'Not successful.',
          autoHideDelay: 3000
        })            
        console.log(error);
      });       
    },    
    onSubmit(evt) {
      evt.preventDefault()
      axios.post(`${this.uri}/postForm`, this.form)
        .then(function (response) {
          this.$bvToast.toast(`SQL successful!`, {
            title: 'Your sql submitted successfully.',
            autoHideDelay: 3000
          })             
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      //refresh()
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
<style lang="scss" scoped>

#player {
    -webkit-filter: grayscale(1) blur(9px);
    opacity: .6;
    position:relative;
  top:-20px;
    pointer-events:none;
}

.player-contain {
  position:relative;
  background: #000;
  background-image: linear-gradient(116deg, #1A73A2 9%, #73B677 83%, #B1E458 100%);
  width: 640px;
  height: 330px;
  overflow: hidden;
  pointer-events:none;
  h2 {
    position: absolute;
    z-index: 3;
    top: 100px;
/*     left: 30px; */
    font-family: "Helvetica", arial;
    font-weight: 200;
    color: #fff;
    width: 100%;
    text-align: center;
    font-size: 40px;
    text-shadow: 0 1px 1px rgba(0,0,0,.5)
    
  }
}

.vue-table {
    font:16px sans-serif;
    border-collapse: collapse;
    vertical-align: middle;
    margin-bottom:15px;
    
    td,th { border:2px solid #000; padding: 5px }
    th { padding: 3px 16px; position: relative; cursor:pointer; }
    th:before { 
        font-family:'Material Icons', sans-serif;
    }
    th:before { color: silver;} 
  }    
  


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
