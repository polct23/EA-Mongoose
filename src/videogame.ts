import { Schema, model } from 'mongoose';

// 1. Create an interface representing a TS object.
export interface IVideogame {
  nombre: string;
  año: number;
  publisher: string;
  rating: number;
  _id?: string;
}

// 2. Create a Schema corresponding to the document in MongoDB.
const videogameSchema = new Schema<IVideogame>({
  nombre: { type: String, required: true },
  año: { type: Number, required: true },
  publisher: { type: String, required: true },
  rating: { type: Number, required: true }
});

// 3. Create a Model.
export const VideogameModel = model('Videogame', videogameSchema);