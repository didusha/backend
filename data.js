import { dbService } from '../backend/services/db.service.js'

async function cleanHostFields() {
  try {
    const collection = await dbService.getCollection('stay')
    const stays = await collection.find({}).toArray()


  } catch (err) {
    console.error("Error:", err)
  }
}

cleanHostFields()
  .then(() => {
    console.log("Update finished")
    process.exit(0)
  })
  .catch(err => {
    console.error("Error during update:", err)
    process.exit(1)
  })
