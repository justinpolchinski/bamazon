var mysql = require("mysql");
var inquirer = require("inquirer");
var arrProduct = ["Exit"];
var inStock = 0;
var productPrice = 0;
var orderQuantity = 0;
var newStockQuantity = 0;
var currentProduct;
var purchaseCost = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: process.argv[2],
    database: "bamazon_db"
  });
  connection.connect(function(err) {
    if (err) throw err;
    //inventory();
    productChoices();
  });
function inventory(){
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "Choose from Menu Options below:",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
                ]
    }).then(function(answer){
        console.log(answer.menu);
        switch (answer.menu) {
            case "View Products for Sale":
                productsForSale();
                break;
      
            case "View Low Inventory":
                lowInventory();
                break;
      
            case "Add to Inventory":
                addInventory();
                break;
      
            case "Add New Product":
              
                break;
            case "Exit":
                connection.end();
                break;
            }
    })
}

function productsForSale() {
    var query = "SELECT item_id, product_name, department_name,price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\n===================\nProduct ID: " + res[i].item_id +"\nDepartment: " + res[i].department_name  + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price.toFixed(2) + "\nQuantity: " + res[i].stock_quantity + "\n====================");
        }
        console.log("Press Arrow Key for Menu Options");
    });
    inventory();
}
function lowInventory() {
    var query = "SELECT item_id, product_name, department_name,price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if(res[i].stock_quantity<=15){
                console.log("\n===================\nProduct ID: " + res[i].item_id +"\nDepartment: " + res[i].department_name  + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price.toFixed(2) + "\nQuantity: " + res[i].stock_quantity + "\n====================");
               }
            }    
            console.log("Press Arrow Key for Menu Options");
    });
    inventory();
}
function addInventory() {
    inquirer.prompt({
        name: "name",
        type: "list",
        message: "Which product should be restocked?",
        choices: arrProduct
    }).then(function(answer){
          var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
          connection.query(query, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
              if (res[i].product_name == answer.name){
                  inStock = res[i].stock_quantity;
                  productPrice = res[i].price;
                  currentProduct = res[i].product_name;
                  console.log("Product ID: " + res[i].item_id + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
                  updateQuantity();
              }
      }
    })
  })
}
function updateQuantity(){
    inquirer.prompt({
        name: "quantity",
        type: "input",
        message: "How many more items should be added to inventory?",
    }).then(function (answer1){
    orderQuantity = answer1.quantity;
    newStockQuantity = parseInt(inStock)+ parseInt(orderQuantity);
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newStockQuantity
        },
        {
          product_name: currentProduct
        }
      ],
      function(err,res) {
        if (err) throw err;
        console.log("\n=====================");
        console.log("New Stock Quantity: " + newStockQuantity + " for " + currentProduct);
        console.log("=====================");
      })
        inventory();
    });
}

function productChoices(){
    var query = "SELECT product_name FROM products";
        //console.log("Query: " + query);
        connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            arrProduct.unshift(res[i].product_name);
        }
        //console.log(arrProduct);
        inventory();
        })
    }