import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "./sequelize";

class Hotel extends Model<
  InferAttributes<Hotel>,
  InferCreationAttributes<Hotel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare location: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare ratings: number | null;
  declare rating_count: number | null;
}

Hotel.init(
  {
    id: {
      type: "INTEGER",
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: "STRING",
      allowNull: false,
    },
    location: {
      type: "STRING",
      allowNull: false,
    },
    ratings: {
      type: "FLOAT",
      allowNull: true,
      defaultValue: null,
    },
    rating_count: {
      type: "INTEGER",
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      allowNull: false,
      type: "DATE",
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: "DATE",
      defaultValue: new Date(),
    },
  },
  {
    tableName: "hotels",
    sequelize: sequelize,// This is the connection instance we created in the sequelize.ts file
    underscored: false, // createdAt --> created_at
    timestamps: true, // createdAt, updatedAt
  },
); // This will be called in the index.ts file where we set up the database connection and initialize all models

export default Hotel;
