var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
 

var connection = mysql.createConnection({
    
});




connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

		// instantiate 
		var table = new Table({
		    head: ['id:', 'ProductName', 'DepartmentName:', 'Price:', 'StockQuantity:']
		  , colWidths: [10, 20, 20, 10, 10]
		});

		var dataArray = new Array;
		for(var o in res) {

			temp = []
		    temp.push(res[o].id, res[o].ProductName, res[o].DepartmentName, res[o].Price, res[o].StockQuantity)

		    dataArray.push(temp)
		}

		for (var i = 0; i < dataArray.length;  i++) {
			table.push(dataArray[i])
		}

		console.log(table.toString());

inquirer.prompt([{
        name: "item",
        message: "What is the product ID you are interested in buying? : "
    }, {
        name: "amount",
        message: "How many units of the product would you like to buy? : "
    }]).then(function(answers) {

        connection.query("SELECT StockQuantity FROM products WHERE id='" + answers.item + "'", function(err, res) {
            if (err) throw err;

            var changed = res[0].StockQuantity - answers.amount;

            if (changed > 0) {
            	connection.query("UPDATE products SET products.StockQuantity = " + changed + " WHERE id = " + answers.item + ";", function(err, res) {});

                console.log("REMOVED: " + answers.amount);
                            
                connection.query("SELECT Price FROM products WHERE id='" + answers.item + "'", function(err2, res2) {
	    		if (err2) 
	    			throw err2;	

	   			console.log(res2[0].Price * answers.amount)

	 			});
        	}   

            else {
                console.log("Insufficient quantity!");
            }

            connection.end(function(err) {
                console.log("--ENDED CONNECTION--");
            });

                        
        });
     });

});


