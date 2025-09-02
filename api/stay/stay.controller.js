import { logger } from '../../services/logger.service.js'
import { stayService } from './stay.service.js'
import { ObjectId } from 'mongodb'

export async function getStays(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
			capacity: +req.query.capacity || 1,
			hostId: req.query.hostId || '',
			page: +req.query.page || 1,
			limit: +req.query.limit || 10
		}

		const sortBy = {
			type: req.query.type || '_id',
			dir: +req.query.dir ||1
		}

		// console.log("🚀 ~ getStays ~ req.query:", req.query)
		// {
		// 	bedrooms: +req.query.bedroom || null,
		// 	bathrooms: +req.query.bathrooms || null,
		// 	bathrooms: +req.query.bathrooms || null,
		// 	capacity: +req.query.capacity || null,
		// 	price: +req.query.price || null,
		// }
		const stays = await stayService.query(filterBy, sortBy)
		res.json(stays)
	} catch (err) {
		logger.error('Failed to get stays', err)
		res.status(400).send({ err: 'Failed to get stays' })
	}
}

export async function getStayById(req, res) {
	try {
		const stayId = req.params.id
		const stay = await stayService.getById(stayId)
		res.json(stay)
	} catch (err) {
		logger.error('Failed to get stay', err)
		res.status(400).send({ err: 'Failed to get stay' })
	}
}

export async function addStay(req, res) {
	const { loggedinUser, body } = req

	try {
		const stay = {
			name: body.name,
			type: body.type,
			imgUrls: body.imgUrls,
			price: body.price,
			summary: body.summary,
			capacity: body.capacity,
			amenities: body.amenities,
			bathrooms: body.bathrooms,
			bedrooms: body.bedrooms,
			roomType: body.roomType,
			loc: {
				country: body.loc?.country || '',
				city: body.loc?.city || '',
				address: body.loc?.address || '',
				lat: body.loc?.lat || 0,
				lng: body.loc?.lng || 0,
			},
			reviews: body.reviews || [],
			likedByUsers: body.likedByUsers || [],
			host: {
				_id: ObjectId.createFromHexString(loggedinUser._id),
				fullname: loggedinUser.fullname,
				location: body.host?.location || '',
				about: body.host?.about || '',
				responseTime: 'within an hour',
				pictureUrl: body.host?.pictureUrl || '',
				isHost: true,
			},
		}

		const addedStay = await stayService.add(stay)
		res.json(addedStay)
	} catch (err) {
		logger.error('Failed to add stay', err)
		res.status(400).send({ err: 'Failed to add stay' })
	}
}

export async function updateStay(req, res) {
	const { loggedinUser, body: stay } = req
	const { _id: userId, isAdmin } = loggedinUser

	if (!isAdmin && stay.host._id !== userId) {
		res.status(403).send('Not your stay...')
		return
	}

	try {
		const updatedStay = await stayService.update(stay)
		res.json(updatedStay)
	} catch (err) {
		logger.error('Failed to update stay', err)
		res.status(400).send({ err: 'Failed to update stay' })
	}
}

export async function removeStay(req, res) {
	try {
		const stayId = req.params.id
		const removedId = await stayService.remove(stayId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay', err)
		res.status(400).send({ err: 'Failed to remove stay' })
	}
}

export async function addStayMsg(req, res) {
	const { loggedinUser } = req

	try {
		const stayId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await stayService.addStayMsg(stayId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to add stay msg', err)
		res.status(400).send({ err: 'Failed to add stay msg' })
	}
}

export async function removeStayMsg(req, res) {
	try {
		const { id: stayId, msgId } = req.params

		const removedId = await stayService.removeStayMsg(stayId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay msg', err)
		res.status(400).send({ err: 'Failed to remove stay msg' })
	}
}
