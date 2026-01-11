import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    subtotal: number;
    discount: number;
    total: number;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    stripeSessionId?: string;
    paymentIntentId?: string;
    licenseKey?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        orderId: { type: String, required: true, unique: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        items: [
            {
                productId: { type: String, required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        stripeSessionId: { type: String },
        paymentIntentId: { type: String },
        licenseKey: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
