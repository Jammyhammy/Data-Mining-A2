/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
//server.js


//Add record, format = r1,r2,parent,level
//At the end of each dimension create table statement add in parent nvarchar(50) and level nvarchar(50)
//for dimension attribute tell them that it must have parent,level
var express = require('express'),
    bodyParser = require('body-parser');


var app = express();
app.use('/src', express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

const sql2 = require('mssql')
const config = {
	user: 'sa',
    password: 'at063spmc',
    server: '192.168.1.47\\SQLEXPRESS', 
	database: 'batabining',
    options: {
        encrypt: true
    }	
}


app.post('/postForm', function(req, res){

    let mart = req.body.mart
    let fact = req.body.fact
    let measures = req.body.measures
    let dimensions = req.body.dimensions
    

    console.log(mart);
    console.log(fact);
    console.log(measures);
    console.log(dimensions);

	const pool1 = new sql2.ConnectionPool(config, err => {
        var query1 = `INSERT INTO DataMart VALUES ('${mart}')`
        pool1.request().query(query1, (err, result) => {
            if(err){
                console.log(err)
                return res.status(404).send(err)
            }
            //console.log(result)
            var query2 = `SELECT MAX(DataMartID) From DataMart`
            pool1.request().query(query2, (err, result) => {
                if(err){
                    console.log(err)
                    return res.status(404).send(err)
                }
                //console.log(result)
                var martId = result.recordset[0][""]
                for(var i = 0; i < dimensions.length; i++) {
                    var dim = dimensions[i]
                    var query3 = `EXEC spBuildDimensionTable '${dim.name}', ${martId}, '${dim.attributes},Parent,Level'`
                    pool1.request().query(query3, (err, result) => {
                        if(err){
                            console.log(err)
                            return res.status(404).send(err)
                        }
                        console.log(result)
                    })
                }
                var dm = dimensions.map((x) => name = x.name).reduce( (a,x) => `${a},${x}`)
                var query4 = `EXEC spBuildFactTable '${fact}', ${martId}, '${measures}', '${dm}'`
                console.log(query4)
                pool1.request().query(query4, (err, result) => {
                    if(err){
                        console.log(err)
                        return res.status(404).send(err)
                    }
                    console.log(result)
                })                
            })
         })
    })
    res.send({ok: true})
  });


app.get('/getDataMarts', function(req,res){
    var query = "SELECT * FROM DataMart"
    //console.log(query);
    const pool1 = new sql2.ConnectionPool(config, err => {
        pool1.request()
        .query(query, (err, result) => {
            // ... error checks
            var data = result.recordset;
            res.json(data);
        })
    })
});

//Add in parent, level for dimensions

app.get('/getQuery', function(req,res){
    let query = req.query.sql;
    console.log(query);
    const pool1 = new sql2.ConnectionPool(config, err => {
        pool1.request()
        .query(query, (err, result) => {
            if(err){
                console.log(err)
                return res.status(404)
            }
            var data = result.recordset;
            res.json(data);
        })
    })
});

app.post('/postQuery', function(req,res){
    let query = req.body.sql;
    console.log(req.body)
    console.log(query);
    const pool1 = new sql2.ConnectionPool(config, err => {
        pool1.request()
        .query(query, (err, result) => {
            if(err){
                console.log(err)
                return res.status(404)
            }
            res.send({ok: true})
        })
    })
});

// //Port 5000
var server = app.listen(5000,function(){
	console.log('listening at http://%s:%s',
	server.address().address, server.address().port);
});