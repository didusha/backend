import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { type } from 'os'

export const orderService = { query, remove, add, update }

async function query(filterBy = {}) {

  try {
    const criteria = _buildCriteria(filterBy)
    const sort = _buildSort(filterBy)

    const collection = await dbService.getCollection('order')

    var orders = await collection.find(criteria, { sort }).toArray()
   
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
      host: {
        _id: ObjectId.createFromHexString(order.host._id),
        fullname: order.host.fullname,
        pictureUrl: order.host.pictureUrl,
      },
      guest: {
        _id: ObjectId.createFromHexString(order.guest._id),
        fullname: order.guest.fullname,
        imgUrl: order.guest.imgUrl
      },
      capacity: order.capacity,
      totalPrice: order.totalPrice,
      startDate: new Date(order.startDate),
      endDate: new Date(order.endDate),
      guests: {
        adults: order.guests.adults,
        children: order.guests.children,
        infants: order.guests.infants,
        pets: order.guests.pets,
      },
      stay: {
        _id: ObjectId.createFromHexString(order.stay._id),
        name: order.stay.name,
        price: order.stay.price,
        imgUrls: order.stay.imgUrls
      },
      msgs: order.msgs,
      status: order.status
    }

    const collection = await dbService.getCollection('order')
    await collection.insertOne(orderToAdd)

    return orderToAdd
  } catch (err) {
    logger.error('cannot add order', err)
    throw err
  }
}

async function update(order) {
  const orderToSave = {
    status: order.status,
  }

  try {
    const criteria = { _id: ObjectId.createFromHexString(order._id) }

    const collection = await dbService.getCollection('order')
    await collection.updateOne(criteria, { $set: orderToSave })

    const updatedOrder = await collection.findOne(criteria)
    return updatedOrder
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.hostId && filterBy.hostId !== 'undefined') {
    criteria['host._id'] = ObjectId.createFromHexString(filterBy.hostId)
  }

  if (filterBy.guestId && filterBy.guestId !== 'undefined') {
    criteria['guest._id'] = ObjectId.createFromHexString(filterBy.guestId)
  }
  return criteria
}

function _buildSort(filterBy) {
  if (!filterBy || !filterBy.type) return { _id: -1 }

  let type = filterBy.type

  if (type === 'name') {
    type = 'stay.name'
  }

  if (type === 'createdAt') {
    type = '_id'
  }

  const dir = +filterBy.dir
  return { [type]: dir }
}
