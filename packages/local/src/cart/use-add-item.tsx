import useAddItem, { UseAddItem } from '@vercel/commerce/cart/use-add-item'
import { LineItem } from '@vercel/commerce/types/cart';
import {Product, ProductVariant } from '@vercel/commerce/types/product';
import { MutationHook } from '@vercel/commerce/utils/types'
import {emptyCart} from "./use-cart";

export default useAddItem as UseAddItem<typeof handler>
export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/products',
    method: 'GET',
  },
  async fetcher({ input, options, fetch }) {
    return await fetch({
      ...options,
    })
  },
  useHook:
    ({  }) =>
    () => {
      return async function addItem(data: {
            productId: string;
            variantId: string;
      }) {
        const products: Product[] = await fetch('/api/products',)
          .then((response) => response.json());

        const product = products.find((p) => p.id === data.productId)!;
        console.log('product to add', product);
        const lineItem: LineItem = product as unknown as LineItem;

        const selectedVariant: ProductVariant = product!.variants.find((v) => v.id === data.variantId)!;
        lineItem.variant = {
          id: selectedVariant.id as string,
          sku: product.sku as string,
          name: product.name,
          requiresShipping: false,
          price: product.price.value,
          listPrice: product.price.value,
          image: {
            url: product.images[0].url,
          },
          isInStock: true,
        };
        lineItem.options = product.options.map(o => {
          const valueEl = o.values[0];
          let value;
          if (valueEl.hasOwnProperty('hexColors')) {
            value = valueEl!.hexColors![0] as unknown as string;
          } else {
            value = valueEl.label;
          }

          return {
            id: o.id,
              name: o.displayName,
            value: value,
          }
        })
        lineItem.quantity = 1;

        const cart = localStorage.getItem('cart');
        if (cart) {
          const cartObj = JSON.parse(cart) as {lineItems: any[]};
          localStorage.setItem(
            'cart',
            JSON.stringify(
              {
                ...cartObj,
                lineItems: [
                  ...cartObj.lineItems,
                  lineItem,
                ]
              }
            ))
        }
        localStorage.setItem('cart',
          JSON.stringify(
            {
              ...emptyCart as Object,
              lineItems: [
                lineItem
              ]
            }
          ));

        return product;
      }
    },
}
