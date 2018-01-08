var mongo = require("mongodb").MongoClient;
var prompt = require("prompt-sync")();
var url = "mongodb://localhost:27017/resturant_db";


mongo.connect(url,function(err,db){
	let collection = db.collection('restaurants');
	getChoice(collection);	
});

function implementChoice(collection, callback1){
	callback1(collection);
};

function getChoice(collection){
	console.log("\n ******* Please select a number ******** \n",
				"\n1: Add a restaurant.",
				"\n2: Show a restaurant's information.",
				"\n3: Edit a restaurant's information", 
				"\n4: Delete a restaurant's information.",
				"\n0: Exit \n");
	let choice = (prompt("Enter you choice: "));
	switch(choice) {
		case "0":
			process.exit(-1);
		case "1":
		//console.log("switch",collection);
			implementChoice(collection, addRestaurant);
			break;
		case "2":
			implementChoice(collection, findRestaurant);
			break;
		case "3":
			implementChoice(collection, editRestaurant);
			break;
		case "4":
			implementChoice(collection, deleteRestaurant);
			break;
		default:
			console.log("\nThe choice you enterd is not in the menu. Please try again.");
			getChoice(collection);
			break;
	};
};

function addRestaurant(collection){
	//console.log("resturant function",collection);
	let restaurant = {};
	let name = prompt('Enter the new restaurant name: ');
	if(name){
		restaurant.name = name;
	};
	let street = prompt('Enter the street: ');
	if(street){
		restaurant.address = {};
		restaurant.address.street = street;
	};
	let zipcode = prompt('Enter the zipcode: ');
	if(zipcode){
		if(restaurant.hasOwnProperty("address")){
			restaurant.address.zipcode = zipcode;
		}else{
			restaurant.address = {};
			restaurant.address.zipcode = zipcode;
		};
	};
	let yelp = prompt('Enter Yelp address: ');
	if(yelp){
		restaurant.yelp = yelp;
	};
	if(restaurant.name && restaurant.address){
		collection.insertOne(restaurant, function(err, result){
			if(result){
				console.log("\nThe new restaurant information was saved successfully \n");
			};
			getChoice(collection);
		});	
	}else{
		console.log("\nPlease Enter valid restaurant information \n");
		getChoice(collection);
	};	
	
};

function findRestaurant(collection){
	let restaurant_name = prompt('Enter the restaurant name: ');
	
	collection.findOne({name: restaurant_name},function(err, result){
		if(result){
			console.log("\nRestaurant name: ",result.name, "\nAddress: ","\n    Street: ",result.address.street, "\n    Zipcode: ", result.address.zipcode,"\nYelp: ", result.yelp);
		}else{
			console.log("\nRestaurant not found");
		};
		getChoice(collection);
	});
};

function editRestaurant(collection){
	let name = prompt('Enter the name of the restaurant you would like to update: ');
	collection.count({name:name}, function(err, result){
		if(result){
			console.log("\nplease enter the new data when prompted and if you don't wish to change the data in the prompted field then just press enter.");
			let newName = prompt("\nEnter the new name: ");
			let newStreet = prompt("\nEnter the new street address: ");
			let newZipcode = prompt("\nEnter the new Zipcode: ");
			let newYelp = prompt("\nEnter the new yelp address: ");
			let newRestaurant = {};
			if(newName){
				newRestaurant.name = newName;
			};
			if(newStreet){
				newRestaurant.address = {};
				newRestaurant.address.street = newStreet;
			};
			if(newZipcode){
				if(newRestaurant.address){
					newRestaurant.address.zipcode = newZipcode;
				}else{
					newRestaurant.address = {};
					newRestaurant.address.zipcode = newZipcode;
				};
			};
			if(newYelp){
				newRestaurant.yelp = newYelp;
			};
			if(newRestaurant.name || newRestaurant.address.street || newRestaurant.address.zipcode || newRestaurant.yelp){
				collection.updateOne({name:name},newRestaurant, function(err, result){
					if(result.result.nModified){
						console.log('The restaurant information was updated');	
						getChoice(collection);
					};
				});
			};
		}else{
			console.log("\nRestaurant not found");	
			getChoice(collection);
		};
	});
	
};

function deleteRestaurant(collection){
	let name = prompt("\nEnter the name of the restaurant you want to delete: ");
		collection.deleteOne({name: name}, function(err, result){
			if(result.result.ok){
				console.log("\nThe restaurant was deleted successfully.")
			}else{
				console.log("\nRestaurant not found");
			}
			getChoice(collection);
		});
};