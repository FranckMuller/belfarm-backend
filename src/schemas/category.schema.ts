import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
	@Prop()
	name: string

	@Prop()
	label: string

	@Prop()
	image: string
}

const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret, options) => {
		delete ret.__v
		ret.id = ret._id.toString()
		delete ret._id
	}
})

export { CategorySchema }
