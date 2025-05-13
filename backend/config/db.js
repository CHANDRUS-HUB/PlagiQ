require('dotenv').config(); 

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, 
});

sequelize.authenticate()
  .then(() => {
    console.log("Database connection successful");
    sequelize.sync({ force: false })
      .then(() => {
        console.log("Database synced!");
      })
      .catch((err) => {
        console.error("Error syncing database:", err);
      });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = sequelize;
