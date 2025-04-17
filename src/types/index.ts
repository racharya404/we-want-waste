
export type Step = 'postcode' | 'wasteType' | 'skipSize' | 'permitCheck' | 'chooseDate' | 'payment';

export type WasteType = 'household' | 'construction' | 'garden' | 'commercial';

export type SkipSize = '4' | '6' | '8' | '10' | '12' | '14';

export type SkipLocation = 'private' | 'public';

export interface Skip {
  size: SkipSize;
  price: number;
  period: string;
  imageUrl: string;
  warning?: string;
}

export interface OrderDetails {
  postcode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  wasteTypes?: WasteType[];
  skipSize?: SkipSize;
  skipPrice?: number;
  skipLocation?: SkipLocation;
  placementPhoto?: string;
  deliveryDate?: Date;
  collectionDate?: Date;
}
