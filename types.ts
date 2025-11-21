export interface PartData {
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  compatibility: string[];
  specifications: {
    weight: string;
    dimensions: string;
    material: string;
  };
}

export enum SearchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}