DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT(5) AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price Decimal(10,3) NOT NULL,
  stock_quantity INT(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Raspberry Pi 3", "Microcontrollers", 35.00, 100),
("Raspberry Pi Zero ", "Microcontrollers", 15.00, 100),
("Arduino Uno", "Microcontrollers", 7.00, 100),
("Arduino Nano", "Microcontrollers", 4.00, 100),
("Arduino Micro", "Microcontrollers", 3.00, 10),
("Wemos D1 mini", "Microcontrollers", 6.00, 10),
("Esp8266 Wifi", "Microcontrollers", 2.00, 10),
("Orange Pi", "Microcontrollers", 20.00, 10),
("Beaglebone", "Microcontrollers", 68.00, 10);
 