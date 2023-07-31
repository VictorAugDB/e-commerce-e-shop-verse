import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

import { getCoupons } from '@/lib/http';

export type Product = {
  id: string;
  image: string;
  price: number;
  quantity: number;
  name: string;
};

export type Coupon = {
  name: string;
  minVal: number;
  percentage: number;
  limit: number;
  quantity: number;
};

interface ProductsContextType {
  handleApplyCoupon: (
    couponRef: RefObject<HTMLInputElement>
  ) => Promise<void | undefined>;
  products: Product[];
  handleChangeQuantity: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
  shipping: number;
  calculateShipping: () => void;
  subtotal: number;
  discounts: number;
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

type ProductsContextProps = {
  children: ReactNode;
};

export const ProductsContext = createContext({} as ProductsContextType);

export function ProductsProvider({ children }: ProductsContextProps) {
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  // TODO add set state shipping when create the shipping calc
  const [shipping, setShipping] = useState(0);

  const subtotal = useMemo(() => {
    return products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }, [products]);

  const discounts = useMemo(() => {
    if (currentCoupon) {
      return Math.min(
        currentCoupon.limit,
        (subtotal * currentCoupon.percentage) / 100
      );
    } else {
      return 0;
    }
  }, [currentCoupon, subtotal]);

  function calculateShipping(): void {
    // get user cep and call the API of the shipping service
    setShipping(0);
  }

  function handleChangeQuantity(
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    const quantity = Number(event.target.value);

    if (quantity <= 0) {
      // message the user that if he is sure that the want to remove the product
    }

    const updatedProducts =
      quantity > 0
        ? products.map((p) => (p.id === id ? { ...p, quantity } : p))
        : products.filter((p) => p.id !== id);

    setProducts(updatedProducts);
  }

  async function handleApplyCoupon(couponRef: RefObject<HTMLInputElement>) {
    if (!couponRef.current) {
      return;
    }

    const coupon = couponRef.current.value;
    // call the api to check the coupons
    const availableCoupons = await getCoupons();

    const couponInfo = availableCoupons.find(
      (ac) => ac.name.toLowerCase() === coupon
    );

    if (!couponInfo) {
      // add message saying that the coupon not exists
      return;
    } else {
      if (couponInfo.quantity === 0) {
        // add message saying that the coupon ended
        return;
      }

      if (subtotal < couponInfo.minVal) {
        // add message saying that the subtotal is not enough to apply the coupon
        return;
      }

      // The coupon will be passed to the checkout there when the user pay the quantity will be decreased
      setCurrentCoupon(couponInfo);
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        handleApplyCoupon,
        handleChangeQuantity,
        calculateShipping,
        products,
        shipping,
        setProducts,
        subtotal,
        discounts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
