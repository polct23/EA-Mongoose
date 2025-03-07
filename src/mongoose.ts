import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { VideogameModel, IVideogame } from './videogame.js';
import { ShopModel, IShop } from './shop.js';

async function createVideogame(videogameData: IVideogame): Promise<IVideogame> {
  const newVideogame = new VideogameModel(videogameData);
  return await newVideogame.save();
}

async function getVideogameById(videogameId: string): Promise<IVideogame | null> {
  return await VideogameModel.findById(videogameId);
}

async function listVideogames(): Promise<IVideogame[]> {
  return await VideogameModel.find();
}

async function updateVideogame(videogameId: string, videogameData: Partial<IVideogame>): Promise<IVideogame | null> {
  return await VideogameModel.findByIdAndUpdate(videogameId, videogameData, { new: true });
}

async function deleteVideogame(videogameId: string): Promise<IVideogame | null> {
  return await VideogameModel.findByIdAndDelete(videogameId);
}

async function aggregateVideogames() {
  return await VideogameModel.aggregate([
    {
      $group: {
        _id: '$publisher',
        total: { $sum: 1 }
      }
    }
  ]);
}

// CRUD para Shop
async function createShop(shopData: IShop): Promise<IShop> {
  const newShop = new ShopModel(shopData);
  return await newShop.save();
}

async function getShopById(shopId: string): Promise<IShop | null> {
  return await ShopModel.findById(shopId);
}

async function listShops(): Promise<IShop[]> {
  return await ShopModel.find();
}

async function updateShop(shopId: string, shopData: Partial<IShop>): Promise<IShop | null> {
  return await ShopModel.findByIdAndUpdate(shopId, shopData, { new: true });
}

async function deleteShop(shopId: string): Promise<IShop | null> {
  return await ShopModel.findByIdAndDelete(shopId);
}

async function aggregateShops() {
  return await ShopModel.aggregate([
    {
      $group: {
        _id: '$direction',
        total: { $sum: 1 }
      }
    }
  ]);
}

async function main() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err));

  const user1: IUser = {
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  };

  console.log("user1", user1);
  const newUser = new UserModel(user1);
  const user2: IUser = await newUser.save();
  console.log("user2", user2);

  const user3: IUser | null = await UserModel.findById(user2._id);
  console.log("user3", user3);

  const user4: IUser | null = await UserModel.findOne({ name: 'Bill' });
  console.log("user4", user4);

  const user5: Partial<IUser> | null = await UserModel.findOne({ name: 'Bill' })
    .select('name email').lean();
  console.log("user5", user5);

  // CRUD para Videogame
  const videogame1: IVideogame = {
    nombre: 'The Legend of Zelda',
    año: 1986,
    publisher: 'Nintendo',
    rating: 10
  };

  const newVideogame = await createVideogame(videogame1);
  console.log("Videogame created:", newVideogame);

  const videogame2 = await getVideogameById(newVideogame._id!);
  console.log("Videogame fetched:", videogame2);

  const videogames = await listVideogames();
  console.log("Videogames listed:", videogames);

  const updatedVideogame = await updateVideogame(newVideogame._id!, { rating: 9 });
  console.log("Videogame updated:", updatedVideogame);

  const deletedVideogame = await deleteVideogame(newVideogame._id!);
  console.log("Videogame deleted:", deletedVideogame);

  const aggregatedVideogames = await aggregateVideogames();
  console.log("Videogames aggregated:", aggregatedVideogames);

  // CRUD para Shop
  const shop1: IShop = {
    name: 'Game Store',
    email: 'gamestore@example.com',
    direction: '123 Main St',
  };

  const newShop = await createShop(shop1);
  console.log("Shop created:", newShop);

  // Añadir un videojuego a la tienda
  if (newVideogame._id) {
    await ShopModel.findByIdAndUpdate(newShop._id, {
      $push: { videogames: newVideogame._id }
    });
    console.log('Videogame added to shop');
  } else {
    console.error('Videogame not created, missing ID');
  }

  const shopWithVideogames = await ShopModel.findById(newShop._id).populate('videogames');
  console.log('Shop with videogames:', shopWithVideogames);

  const shop2 = await getShopById(newShop._id!);
  console.log("Shop fetched:", shop2);

  const shops = await listShops();
  console.log("Shops listed:", shops);

  const updatedShop = await updateShop(newShop._id!, { direction: '456 Elm St' });
  console.log("Shop updated:", updatedShop);

  const deletedShop = await deleteShop(newShop._id!);
  console.log("Shop deleted:", deletedShop);

  const aggregatedShops = await aggregateShops();
  console.log("Shops aggregated:", aggregatedShops);
}

main();