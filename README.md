# Data-Mining-A2

In this assignment, you will be developing a Web-based framework that allows one to create a fact star schema for a data warehouse that consists of only one data mart and can support some simple OLAP operations. Following are the required functionalities in this assignment. Each function may require one or more (static or dynamically generated) Web pages, along with interactions with the database. 

##### Creating dimensions and its attributes for the specified Data Mart. 
*You should allow the user to specify the number of dimensions and the number of attributes in each dimension. 
*Note that for each dimension, once the user submits the dimension name and its corresponding attributes from the Web, a table corresponding to this information will be created in the database in a programmatic way.
*For simplicity, apart from the primary key, you can assume that the other attributes are of string (or varchar) type. Users are also allowed to input some records into any created dimension table.
 
##### Defining a concept hierarchy for any of the dimensions. 
*This information can also be stored in the database as a table. Once created, all dimensions could be reused (selected) by future data marts.
 
##### Creating a Data Mart. 
*Here a user is allowed to enter the name of the Data Mart into a Web form. 
*After submitting the Data Mart name, it can be recorded in the back-end database.  
*Input a fact table name. User should also be allowed to specify the number of measures in the fact table. 
*Upon submitting the fact table name and its measures, a database table corresponding to the submitted fact table should be created programmatically. 
*User can then select the previously created dimensions for this data mart. 
*All attributes other than foreign keys in the fact table can be of either int or real number type. 
*When all tables of the data mart have been created, you should provide the option to display the created star schema of the Data Mart in a web page, including all the dimensions, any concept hierarchies, and the fact table. 
*Users can also enter some records into any created fact tables. 
 
##### Performing OLAP operation. 
*Provide an interface for users to perform Roll Up and Drill Down operations by any dimensions on any measures. Note: The drill down operations are virtual, since you are required to materialize only the base cuboid. [20 points] 
 
Once again, note that all the above functionalities are provided from of a Web application. During the demo, we will be creating a new Data Mart and performing some simple OLAP operations online from your system. 

To start with, you may also create the following Meta tables in the database: 
* DataMart (did (primary key), dm_name) 
* Dimensions (did references DataMart.did, dimid, dim_name). Here did and dimid together form a unique key. 
* FactTables (did references DataMart.did, factid, fact_name). Here did and factid together form a unique key. 
 
The following tutorial on creating a sales data mart is a good reference: https://www.codeproject.com/Articles/652108/Create-First-Data-WareHouse. 
