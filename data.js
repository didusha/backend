import { dbService } from '../backend/services/db.service.js'

function getRandomCoordInRio() {
  const latCenter = -22.9068
  const lngCenter = -43.1729

  // מוסיפים סטייה קטנה אקראית (עד ~10 ק"מ)
  const latOffset = (Math.random() - 0.5) * 0.2
  const lngOffset = (Math.random() - 0.5) * 0.2

  return {
    lat: latCenter + latOffset,
    lng: lngCenter + lngOffset,
  }
}

async function updateRioLocations() {
  try {
    const collection = await dbService.getCollection('stay')

    // שים לב לרגקס מתוקן עם השם הנכון
    const docs = await collection.find({ 'loc.city': /rio.*janeiro/i }).toArray()

    let updatedCount = 0

    for (const doc of docs) {
      const { lat, lng } = getRandomCoordInRio()

      await collection.updateOne(
        { _id: doc._id },
        { $set: { 'loc.lat': lat, 'loc.lng': lng } }
      )

      updatedCount++
    }

    console.log(`✅ Updated ${updatedCount} stays with Rio de Janeiro locations.`)
  } catch (err) {
    console.error("❌ Error updating Rio locations:", err)
  }
}

updateRioLocations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))




// import { dbService } from '../backend/services/db.service.js'
// import { ObjectId } from 'mongodb'

// function getRandomDateBetween(startYear, endYear) {
//   const start = new Date(`${startYear}-01-01`).getTime()
//   const end = new Date(`${endYear}-12-31`).getTime()
//   const randomTimestamp = start + Math.random() * (end - start)
//   return new Date(randomTimestamp)
// }

// async function randomizeOrderIds() {
//   try {
//     const collection = await dbService.getCollection('order')
//     const orders = await collection.find({}).toArray()

//     let updatedCount = 0

//     for (const order of orders) {
//       const randomDate = getRandomDateBetween(2016, 2025)
//       const seconds = Math.floor(randomDate.getTime() / 1000)

//       // בונים ObjectId חדש עם timestamp חדש
//       const newId = new ObjectId(
//         seconds.toString(16).padStart(8, '0') + // 4 bytes timestamp
//         order._id.toHexString().substring(8)    // שומרים את שאר ה־bytes מה־id הישן
//       )

//       // עדכון ה־_id (צריך למחוק את הישן ולהכניס עם ה־id החדש)
//       await collection.deleteOne({ _id: order._id })
//       await collection.insertOne({ ...order, _id: newId })

//       updatedCount++
//     }

//     console.log(`✅ Updated ${updatedCount} order IDs successfully.`)
//   } catch (err) {
//     console.error("❌ Error updating orders:", err)
//   }
// }

// randomizeOrderIds()
//   .then(() => process.exit(0))
//   .catch(() => process.exit(1))














// import { dbService } from '../backend/services/db.service.js'

// async function updateStayLocations() {
//   try {
//     const collection = await dbService.getCollection('stay')
//     const stays = await collection.find({}).toArray()

//     let updatedCount = 0

//     for (const stay of stays) {
//       const city = stay.loc?.city?.toLowerCase()

//       if (!city) continue

//       let updateFields = null

//       if (city === 'maui') {
//         updateFields = {
//           'loc.city': 'Tel Aviv',
//           'loc.country': 'Israel',
//           'loc.countryCode': 'IS'
//         }
//       } else if (city === 'montreal') {
//         updateFields = {
//           'loc.city': 'Paris',
//           'loc.country': 'France',
//           'loc.countryCode': 'FR'
//         }
//       } else if (city === 'hong kong') {
//         updateFields = {
//           'loc.city': 'Bangkok',
//           'loc.country': 'Thailand',
//           'loc.countryCode': 'TH'
//         }
//       }

//       if (updateFields) {
//         await collection.updateOne(
//           { _id: stay._id },
//           { $set: updateFields }
//         )
//         updatedCount++
//       }
//     }

//     console.log(`✅ Updated ${updatedCount} stays successfully.`)
//   } catch (err) {
//     console.error("❌ Error updating stay locations:", err)
//   }
// }

// updateStayLocations()
//   .then(() => process.exit(0))
//   .catch(() => process.exit(1))


//   async function updateReviewImages() {
//   try {
//     const collection = await dbService.getCollection('stay')
//     const stays = await collection.find({}).toArray()

//     const uniqueImages = [
//       "https://a0.muscache.com/im/pictures/user/fe2b4d8e-cf96-4aeb-a86b-f34d7a9783aa.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/User-571409646/original/ea5debfb-2394-444c-ae7a-e30e13363e59.jpeg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/92fd9418-f506-44e3-9c60-c76d4199e3e5.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/755aecb4-8a5e-4875-b63f-f9d62c75d38b.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/User-570074090/original/4a25a900-e452-4772-933a-d42f1f0ae551.jpeg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/a1e05883-caa7-4e05-85de-bcd480b7cebe.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/d13665bb-181f-4e83-b37a-4d5695582e4c.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/04a439ff-45c5-40d8-82b3-ff0536d646a8.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/fde4b9f1-a7f7-4058-bc3f-5c0559ec36bb.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/User-12914311/original/d54d9c5d-ea8f-480c-8d64-e39b1ebeb6b3.jpeg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/a3592f9b-dcc0-40eb-95cb-0603fe8e5de5.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/92cc4e8b-dd07-49ed-b296-eb518f29dadc.jpg?im_w=240",
//       "https://a0.muscache.com/im/pictures/user/ff445c1d-694f-4d41-b25a-2d1648978692.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/23273091/profile_pic/1414989137/original.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/6334250/profile_pic/1368287493/original.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/31635864/profile_pic/1429604852/original.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/pictures/user/cc623f2c-8ba2-46ec-b087-ec92ee1b5c93.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/12673423/profile_pic/1393616988/original.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/pictures/user/6bf03261-e7ac-4e0e-8121-3828612bbb6a.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/pictures/user/c0ef722d-0a22-4552-98f9-6b80788b6319.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/19354362/profile_pic/1427837616/original.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/pictures/user/3fceba9a-ce84-4841-88df-b699105119b4.jpg?aki_policy=profile_x_medium",
//       "https://a0.muscache.com/im/users/6107595/profile_pic/1442432675/original.jpg?",
//       "https://a0.muscache.com/im/users/50124/profile_pic/1443072360/original.jpg?aki_policy=profile_x_medium",
//       "https://img.freepik.com/free-photo/smiling-young-businessman-holding-takeaway-coffee-cup-hand_23-2148176167.jpg",
//       "https://img.freepik.com/free-photo/vertical-shot-pretty-female-with-pink-silk-dress-sitting-outdoor-cafe_181624-30906.jpg",
//       "https://img.freepik.com/free-photo/portrait-young-woman_23-2148574874.jpg",
//       "https://img.freepik.com/free-photo/portrait-young-man-street_641386-463.jpg",
//       "https://img.freepik.com/free-photo/front-view-man-with-dog-jetty_23-2150558036.jpg",
//       "https://img.freepik.com/free-photo/young-sports-man-bicycle-european-city-sports-urban-environments_72229-323.jpg",
//       "https://img.freepik.com/free-photo/guy-white-shirt-smiles_23-2148401388.jpg",
//       "https://img.freepik.com/free-photo/young-woman-cozy-wear-outdoors_624325-539.jpg",
//       "https://img.freepik.com/free-photo/handsome-confident-stylish-hipster-lambersexual-model_158538-18017.jpg",

//     ];

//     let totalUpdatedReviews = 0

//     for (const stay of stays) {
//       if (!stay.reviews || !Array.isArray(stay.reviews) || stay.reviews.length === 0) continue

//       // Shuffle uniqueImages to ensure no repeats per stay
//       const shuffledImages = [...uniqueImages].sort(() => 0.5 - Math.random())

//       const updatedReviews = stay.reviews.map((review, idx) => {
//         const newImg = shuffledImages[idx % shuffledImages.length]
//         return {
//           ...review,
//           by: {
//             ...review.by,
//             imgUrl: newImg
//           }
//         }
//       })

//       await collection.updateOne(
//         { _id: stay._id },
//         { $set: { reviews: updatedReviews } }
//       )

//       totalUpdatedReviews += updatedReviews.length
//       console.log(`✅ Updated ${updatedReviews.length} reviews for stay ${stay._id}`)
//     }

//     console.log(`\n🎉 Finished! Updated a total of ${totalUpdatedReviews} review images`)
//   } catch (err) {
//     console.error("Error updating review images:", err)
//   }
// }

// import { dbService } from '../backend/services/db.service.js'

// async function mapCities() {
//   try {
//     const collection = await dbService.getCollection('stay')
//     const stays = await collection.find({}).toArray()

//     const cityMap = stays.reduce((acc, stay) => {
//       const city = stay.loc?.city || 'Unknown'
//       acc[city] = (acc[city] || 0) + 1
//       return acc
//     }, {})

//     console.log('\n📊 City counts:')
//     console.log(cityMap)
//   } catch (err) {
//     console.error("Error building city map:", err)
//   }
// }

// mapCities()
//   .then(() => process.exit(0))
//   .catch(() => process.exit(1))
