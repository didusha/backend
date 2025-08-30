import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import { ObjectId } from 'mongodb'

const PAGE_SIZE = 3

export const stayService = {
	remove,
	query,
	getById,
	add,
	update,
	// addStayMsg,
	// removeStayMsg,
}

async function query(filterBy = { txt: '', capacity: 1 }, sortBy) {
	try {
		const criteria = _buildCriteria(filterBy)
		const sort = _buildSort(sortBy)
		console.log("🚀 ~ query ~ sort:", sort)

		const collection = await dbService.getCollection('stay')
		var stayCursor = await collection.find(criteria, {sort})

		// if (filterBy.pageIdx !== undefined) {
		// 	stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		// }

		const stays = stayCursor.toArray()
		return stays
	} catch (err) {
		logger.error('cannot find stays', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {
		name: { $regex: filterBy.txt, $options: 'i' },
		capacity: { $gte: filterBy.capacity },
	}

	if (filterBy.hostId && filterBy.hostId !== '') {
	   criteria['host._id'] = ObjectId.createFromHexString(filterBy.hostId)
   }
	return criteria
}

function _buildSort(sortBy) {
    // console.log("🚀 ~ _buildSort ~ sortBy:", sortBy)
    if (!sortBy.type) return {}
    let type = sortBy.type   
    // console.log("🚀 ~ _buildSort ~ type:", type)

  const dir = +sortBy.dir 
  return { [type]: dir }
}

async function getById(stayId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stayId) }

		const collection = await dbService.getCollection('stay')
		const stay = await collection.findOne(criteria)

		stay.createdAt = stay._id.getTimestamp()
		return stay
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err)
		throw err
	}
}

async function remove(stayId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(stayId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('stay')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your stay')
		return stayId
	} catch (err) {
		logger.error(`cannot remove stay ${stayId}`, err)
		throw err
	}
}

async function add(stay) {
	try {
		const collection = await dbService.getCollection('stay')
		await collection.insertOne(stay)

		return stay
	} catch (err) {
		logger.error('cannot insert stay', err)
		throw err
	}
}

async function update(stay) {
	const stayToSave = {
		name: stay.name,
		type: stay.type,
		imgUrls: stay.imgUrls,
		price: stay.price,
		summary: stay.summary,
		capacity: stay.capacity,
		amenities: stay.amenities,
		bathrooms: stay.bathrooms,
		bedrooms: stay.bedrooms,
		roomType: stay.roomType,
		loc: stay.loc,
		host: stay.host,
		reviews: stay.reviews,
		likedByUsers: stay.likedByUsers,
	}

	try {
		const criteria = { _id: ObjectId.createFromHexString(stay._id) }
		// console.log("🚀 ~ update ~ criteria:", criteria)

		const collection = await dbService.getCollection('stay')
		await collection.updateOne(criteria, { $set: stayToSave })

		return stay
	} catch (err) {
		logger.error(`cannot update stay ${stay._id}`, err)
		throw err
	}
}


// async function addStayMsg(stayId, msg) {
// 	try {
// 		const criteria = { _id: ObjectId.createFromHexString(stayId) }
// 		msg.id = makeId()

// 		const collection = await dbService.getCollection('stay')
// 		await collection.updateOne(criteria, { $push: { msgs: msg } })

// 		return msg
// 	} catch (err) {
// 		logger.error(`cannot add stay msg ${stayId}`, err)
// 		throw err
// 	}
// }

// async function removeStayMsg(stayId, msgId) {
// 	try {
// 		const criteria = { _id: ObjectId.createFromHexString(stayId) }

// 		const collection = await dbService.getCollection('stay')
// 		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

// 		return msgId
// 	} catch (err) {
// 		logger.error(`cannot remove stay msg ${stayId}`, err)
// 		throw err
// 	}
// }


// function _buildSort(filterBy) {
// 	if (!filterBy.sortField) return {}
// 	return { [filterBy.sortField]: filterBy.sortDir }
// }