export enum LocalStorage {
  CART = '@e-shop-verse-cart:products-state-1.0.0',
  WISHLIST = '@e-shop-verse-wishlist:products-state-1.0.0',
}

export type LSCart = {
  id: string
  quantity: number
}

export type LSWishlist = string
