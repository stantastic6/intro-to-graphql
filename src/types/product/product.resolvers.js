import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, args) => args.id

const products = () => Product.find({}).exec()

const newProduct = (_, args, ctx) =>
  Product.create({ ...args.input, createdBy: ctx.user._id })

const updateProduct = (_, args) =>
  Product.findByIdAndUpdate(args.id, args.input, { new: true })
    .lean() // Convert to JSON rather than Mongo document
    .exec()

const removeProduct = (_, args) =>
  Product.findByIdAndRemove(args.id)
    .lean()
    .exec()

// const createdBy = ({ createdBy }) => createdBy

export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
