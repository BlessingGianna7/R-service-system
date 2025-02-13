// models/User.js

const { DataTypes, Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  username: "postgres",
  password: "postgres",
  database: "employee_management_system",
  host: "localhost",
  port: 5432,
});

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: "tb_username",
        fields: ["username"],
      },
      {
        name: "tb_email",
        fields: ["email"],
      },
    ],
  }
);

// Custom method to find a user by email
User.findByEmail = async function (email) {
  return await this.findOne({
    where: {
      email,
    },
  });
};

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("User table created successfully");
  })
  .catch((error) => {
    console.error("Error creating the user table:", error);
  });

module.exports = User;
