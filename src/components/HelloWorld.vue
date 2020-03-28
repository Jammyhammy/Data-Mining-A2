<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  <div>
    <b-form-input v-model="martName" placeholder="Enter the name of the data mart."></b-form-input>
  </div>
    <p>
    </p>
    <b-row>
      <b-col lg="4" class="pb-2"><b-button size="lg">Create a Data Mart: {{ martName }}</b-button></b-col>
    </b-row>    
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data: function() {
    return {
      msg: "",
      martName: ""
    }
  },
  created() {
    this.blepTest();
    axios.get("http://localhost:5000/getTest").then(response => (this.msg = response.data.Data[0].Text))
    // let sql = require('mssql/msnodesqlv8');
    // let config = {
    //     user: 'sa',
    //     password: 'at063spmc',
    //     server: '192.168.1.47\\SQLEXPRESS', 
    //     database: 'batabining' 
    // };
    // sql.connect(config, function(err) {
    //   if(err)console.log(err);
    //   var request = new sql.Request();
    //   request.query('select * from Table1', function(err, result) {
    //     if(err) console.log(err);
    //     console.log(JSON.stringify(result));
    //   })
    // })

  },
  methods: {
    blepTest () {
      console.log("hi");
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
