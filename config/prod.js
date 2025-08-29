export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://adi:adi@rarebnb.gygesfs.mongodb.net/?retryWrites=true&w=majority&appName=rarebnb',
  dbName : process.env.DB_NAME || 'stayDB'
}
