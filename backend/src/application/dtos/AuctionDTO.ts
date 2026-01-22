

export interface CreateAuctionDTO {
    title: string,
    description: string,
    category: string,
    startingPrice: number,
    currentPrice: number,
    endDate: Date | string,
    sellerId: string,
    images?: string[]
}

export interface UpdateAuctionDTO {
    title?: string,
    description?: string,
    category?: string,
    startingPrice?: number,
    endDate?: Date | string,
    images?: string[]
}
export interface AuctionResponseDTO {
    id: string,
    title: string,
    description: string,
    category: string,
    startingPrice: number,
    currentPrice: number,
    endDate: Date | string,
    sellerId: string,
    images: string[],
    status: string
}