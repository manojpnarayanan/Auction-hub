import mongoose, { Schema, Document } from "mongoose"


export interface IAuctionDocument extends Document {
    title: string;
    description: string;
    category: string;
    startingPrice: number;
    currentPrice: number;
    endDate: Date;
    sellerId: string;
    images: string[];
    status: 'active' | 'sold' | 'expired',
    type: 'live' | 'timed',
    startTime?: Date,
    winnerId?: string,
    bids: { bidderId: string; amount: number; time: Date }[],
    createdAt: Date,
    paymentStatus: 'pending' | 'completed' | 'pending',
    rejectionReason?: string,
    cancellationReason?: string;
    deliveryStatus?: 'pending_delivery' | 'delivered' | 'disputed'
}

const AuctionSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    endDate: { type: Date, required: true },
    sellerId: { type: String, required: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'sold', 'expired', 'pending', 'rejected', 'approved'], default: 'pending' },
    type: { type: String, enum: ['live', 'timed'], default: 'timed' },
    startTime: { type: Date },
    winnerId: { type: String, default: null },
    bids: [
        {
            bidderId: { type: String, required: true },
            amount: { type: Number, required: true },
            time: { type: Date, default: Date.now }
        }
    ],
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    rejectionReason: { type: String, default: null },
    cancellationReason: { type: String, default: null },
    deliveryStatus: { type: String, enum: ['pending_delivery', 'delivered', 'disputed'], default: 'pending_delivery' }
}, { timestamps: true });

export const AuctionModel = mongoose.model<IAuctionDocument>("Auction", AuctionSchema);