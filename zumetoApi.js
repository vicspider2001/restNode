var express = require('express');
var restaurant = express();
var dotenv = require('dotenv'); 
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = "mongodb+srv://test:testuser@cluster0.bbssi.mongodb.net/zometo?retryWrites=true&w=majority";
var cors = require('cors')
const bodyParser = require('body-parser')
var  port = process.env.PORT || 1500;
var db;

restaurant.use(bodyParser.urlencoded({extended:true}));
restaurant.use(bodyParser.json());
restaurant.use(cors());


restaurant.get('/',(req,res)=>{
    res.send("This is root page")
})



// return all Restaurantsy (Params)
restaurant.get('/restaurants',(req,res) => {
    var query = {};
    console.log(req.query.city)
    if(req.query.city){
        query={state_id:Number(req.query.city)}
    }

// return all Restaurants wrt city (Query Params)
else if(req.query.city){
    var city = (req.query.city)
    query={"state_id":Number(req.query.city)}
}

 // return all Restaurants wrt ID (Query Param)
    else if(req.query.details){
        var details = (req.query.details)
        query={"restaurant_id":Number(req.query.details)}
    }

// return all Restaurants wrt location (Query Params)
    else if(req.query.location){
        var location = Number(req.query.location)
        query={"location_id":Number(req.query.location)}
    }

// return all Restaurants wrt mealTypes (Query Params)
    else if(req.query.meals){
        var meals = Number(req.query.meals)
        query={"mealTypes.mealtype_id":Number(req.query.meals)}
    }

// return all Restaurants wrt Cuisines (Query Params)
    else if(req.query.cuisine){
        var cuisine = Number(req.query.cuisine)
        query={"cuisines.cuisine_id":Number(req.query.cuisine)}
    }
// return all Restaurants wrt Cost (Query Params)
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query = {$and:[{cost:{$gt:lcost,$lt:hcost}}]}
    }

// return all Restaurants wrt Costs and Meal Types (Query Params)
    else if(req.query.meals && req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query = {$and:[{cost:{$gt:lcost,$lt:hcost}}]},
        {"mealTypes.mealtype_id":Number(req.query.meals)}
    }


db.collection('RestaurantData').find(query).toArray((err,result) => {
	if(err) throw err;
	res.send(result)
    })
})

// return all Restaurants Menus (Param)
restaurant.get('/RestaurantMenus',(req,res) => {
    var query = {};
    console.log(req.query.menus)
    if(req.query.menus){
        query={menu_id:Number(req.query.menus)}
    }


 // return all Restaurants wrt Menus (Query Param)
    else if(req.query.RestID){
        var RestID = (req.query.RestID)
        query={"restaurant_id":Number(req.query.RestID)}
    }

           
db.collection('RestaurantMenu').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})

// return all Restaurants Locations (Param)
restaurant.get('/OurLocations',(req,res) => {
    var query = {};
    console.log(req.query.locations)
    if(req.query.locations){
        query={menu_id:Number(req.query.locations)}
    }

db.collection('RestaurantLocation').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})

// return all MealTypes (Param)
restaurant.get('/mealtypes',(req,res) => {
    var query = {};
    console.log(req.query.mealtypes)
    if(req.query.mealtypes){
        query={menu_id:Number(req.query.mealtypes)}
    }

db.collection('RestaurantData').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})

// return all the orders
restaurant.get('/orders',(req,res) => {
    db.collection('RestaurantOrders').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// post orders to orders database 
restaurant.post('/orderNow',(req,res)=>{
	console.log(req.body);
	db.collection('RestaurantOrders').insert(req.body,(err,result) => {
		if(err) throw err;
		res.send("Orders Placed")
	})
})

// Delete orders from orders database
restaurant.delete('/delOrders',(req,res)=>{
    db.collection('RestaurantOrders').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// update orders in orders database
restaurant.put('/updateStatus/:id',(req,res) => {
    var id = Number(req.params.id);
    var status = req.body.status?req.body.status:"Confirmed"
    db.collection('RestaurantOrders').updateOne(
        {id:id},
        {
            $set:{
                "date":req.body.date,
                "bank_status":req.body.bank_status,
                "bank":req.body.bank,
                "status":status
            }
        }
    )
    res.send('data updated')
})




MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('zometo');
    restaurant.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })

})