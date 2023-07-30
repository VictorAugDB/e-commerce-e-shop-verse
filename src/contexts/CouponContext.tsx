import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useState,
} from 'react';

import { getCoupons } from '@/lib/http';

export type Coupon = {
  name: string;
  minVal: number;
  percentage: number;
  limit: number;
  quantity: number;
};

interface CouponContextType {
  discounts: number;
  currentCoupon: Coupon | null;
  handleApplyCoupon: (
    couponRef: RefObject<HTMLInputElement>,
    subtotal: number
  ) => Promise<void | undefined>;
  setDiscounts: Dispatch<SetStateAction<number>>;
}

type CouponProviderProps = {
  children: ReactNode;
};

export const CouponContext = createContext({} as CouponContextType);

export function CouponProvider({ children }: CouponProviderProps) {
  const [discounts, setDiscounts] = useState(0);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);

  async function handleApplyCoupon(
    couponRef: RefObject<HTMLInputElement>,
    subtotal: number
  ) {
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
      setDiscounts(
        Math.min(couponInfo.limit, (subtotal * couponInfo.percentage) / 100)
      );
    }
  }

  return (
    <CouponContext.Provider
      value={{ currentCoupon, discounts, handleApplyCoupon, setDiscounts }}
    >
      {children}
    </CouponContext.Provider>
  );
}
