// required npm packages to run .js
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
 
// establish connection to mysql database
var connection = mysql.createConnection({

});



// query database for all information in table producs
connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

		// setting up Table require
		var table = new Table({
		    head: ['id:', 'ProductName', 'DepartmentName:', 'Price:', 'StockQuantity:']
		  , colWidths: [10, 20, 20, 10, 10]
		});
		// table requires data to be in array of arrays this sets it up from the objects returned
		var dataArray = new Array;
		for(var o in res) {

			temp = []
		    temp.push(res[o].id, res[o].ProductName, res[o].DepartmentName, res[o].Price, res[o].StockQuantity)

		    dataArray.push(temp)
		}

		for (var i = 0; i < dataArray.length;  i++) {
			table.push(dataArray[i])
		}
		// pretty in node!
		console.log(table.toString());

// inquirer propts for user imput
inquirer.prompt([{
        name: "item",
        message: "What is the product ID you are interested in buying? : "
    }, {
        name: "amount",
        message: "How many units of the product would you like to buy? : "
    }]).then(function(answers) {
    	//Selects the StockQuantity at the user imput id. 
        connection.query("SELECT StockQuantity FROM products WHERE id='" + answers.item + "'", function(err, res) {
            if (err) throw err;
            // calculates the ammount the user is buying subtracted from the quantity
            var changed = res[0].StockQuantity - answers.amount;
            // checks to make sure we are not going into a negative number 
            if (changed >= 0 ) {
            	//updates the mysql database
            	connection.query("UPDATE products SET products.StockQuantity = " + changed + " WHERE id = " + answers.item + ";", function(err, res) {});

                console.log("REMOVED: " + answers.amount + " from stock");
                //grabs the price at the selected id            
                connection.query("SELECT Price FROM products WHERE id='" + answers.item + "'", function(err2, res2) {
	    		if (err2) 
	    			throw err2;	
	    		//logs the price times the amount purchases to generate a Total
	   			console.log("Total = $" + (res2[0].Price * answers.amount))

	 			});
        	}   
        	//If stockQuantiy is < 0 else will run
            else {
                console.log("Insufficient quantity!");
            }
            //end the connection
            connection.end(function(err) {
                console.log("--ENDED CONNECTION--");
            });

                        
        });
     });

});


