import { useMemo } from 'react'
import { SWRHook } from '@vercel/commerce/utils/types'
import useCart, { UseCart } from '@vercel/commerce/cart/use-cart'
import { Cart } from '@vercel/commerce/types/cart';


export default useCart as UseCart<typeof handler>


export const emptyCart: Cart = {
  id: '',
  createdAt: '',
  currency: { code: '' },
  taxesIncluded: false,
  lineItems: [],
  lineItemsSubtotalPrice: 0,
  subtotalPrice: 0,
  totalPrice: 0,
};

export const handler: SWRHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher() {
    return emptyCart
  },
  useHook:
    ({ useData }) =>
    (input) => {
      const response = useData();
      //const data = response.data;
      const isClientSide = typeof window !== 'undefined';
      console.log('isClientSide', isClientSide);
      if (isClientSide) {
        const data = localStorage.getItem('cart');
        console.log('ls', data === null ? 0 : JSON.parse(data!).lineItems.length);
      }
      const data = (isClientSide && localStorage.getItem('cart')) || null;

      let cart: Cart;
      if (data === null) {
        cart = emptyCart;
        isClientSide && localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        cart = JSON.parse(data)
      }

      return useMemo(
        () =>
          Object.create(
            {},
            {
              data: {
                get() {
                  return cart;
                }
              },
              isEmpty: {
                get() {
                  return cart === undefined || cart.lineItems.length === 0;
                },
                enumerable: true,
              },
            }
          ),
        []
      )
    },
}
