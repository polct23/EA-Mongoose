import { Schema, model, Types } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface IShop {
  name: string;
  email: string;
  direction: string;
  videogames?: Types.ObjectId[];
  _id?: string;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const shopSchema = new Schema<IShop>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  direction: { type: String, required: true },
  videogames: [{ type: Schema.Types.ObjectId, ref: 'Videogame' }]
});

// 3. Create a Model.
export const ShopModel = model('Shop', shopSchema);