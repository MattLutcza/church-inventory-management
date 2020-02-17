export class InventoryItem {
    id: number;
    name: string;
    //description: string;
    category: string;
    subcategory: string;
    supplier: string;
    donated: string;
    purchaseDate: Date;
    purchasePrice: number;
    taxAndShippingPrice: number;
    sellDate?: Date | string;
    sellPrice: number;
    sellMethod?: string;
}
