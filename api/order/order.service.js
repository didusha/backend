import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const orderService = { query, remove, add }

async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('order')
        
		// var orders = await collection.find(criteria).toArray()
		var orders = await collection.aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            {
                $unwind: '$byUser',
            },
            {
                $lookup: {
                    localField: 'aboutUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'aboutUser',
                },
            },
            {
                $unwind: '$aboutUser',
            },
            { 
                $project: {
                    'txt': true, 
                    'byUser._id': true, 'byUser.fullname': true,
                    'aboutUser._id': true, 'aboutUser.fullname': true,
                } 
            }
        ]).toArray()

		return orders
	} catch (err) {
		logger.error('cannot get orders', err)
		throw err
	}
}

async function remove(orderId) {
	try {
		const { loggedinUser } = asyncLocalStorage.getStore()
		const collection = await dbService.getCollection('order')

		const criteria = { _id: ObjectId.createFromHexString(orderId) }

        // remove only if user is owner/admin
		if (!loggedinUser.isAdmin) {
            criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        }

        const { deletedCount } = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		logger.error(`cannot remove order ${orderId}`, err)
		throw err
	}
}

async function add(order) {
    try {
        const orderToAdd = {
            byUserId: ObjectId.createFromHexString(order.byUserId),
			aboutUserId: ObjectId.createFromHexString(order.aboutUserId),
			txt: order.txt,
		}
		const collection = await dbService.getCollection('order')
		await collection.insertOne(orderToAdd)
        
		return orderToAdd
	} catch (err) {
		logger.error('cannot add order', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}

	if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
	return criteria
}