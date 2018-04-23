require('dotenv').config();
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
    productChoices();
    //runSearch();
  });
  function runSearch(){
      inquirer.prompt({
          name: "name",
          type: "list",
          message: "What would you like to purchase or choose Exit to leave Bamazon?",
          choices: arrProduct
      }).then(function(answer){
            var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
            connection.query(query, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if(answer.name == "Exit"){connection.end();}
                if (res[i].product_name == answer.name){
                    inStock = res[i].stock_quantity;
                    productPrice = res[i].price;
                    currentProduct = res[i].product_name;
                    console.log("Product ID: " + res[i].item_id + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
                    quantityCheck();
                }
        }
      })
    })
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
        runSearch();
        })
       
}
function quantityCheck(){
    inquirer.prompt({
        name: "quantity",
        type: "input",
        message: "How many would you like?",
    }).then(function(answer1){
                orderQuantity = answer1.quantity;
                if(inStock>orderQuantity){
                    console.log("====================="); 
                    console.log("Thank you for your business!");
                    newStockQuantity = inStock-orderQuantity;
                    updateProduct();
            }else{
                console.log("Sorry we have insufficient inventory");
                productChoices();
            }
    })
}
function updateProduct() {
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
        purchaseCost = orderQuantity * productPrice;
        console.log("Order Cost: $"+purchaseCost + " for " + orderQuantity + " " + currentProduct);
        console.log("=====================");
        console.log("New Stock Quantity: " + newStockQuantity + " for " + currentProduct);
        productChoices();
      }
    )};
