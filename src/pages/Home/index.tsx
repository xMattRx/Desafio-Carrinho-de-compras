import React, { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';


interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}
interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();
  
  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount}
    newSumAmount[product.id] = product.amount

    return newSumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
     let productsApi = await (await api.get('/products')).data

    let productsApi2 = productsApi.map((element: ProductFormatted)=>{
        element.priceFormatted = formatPrice(element.price)
        return element
     })
     setProducts(productsApi2)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
   addProduct(id)
  }

  return (
    <ProductList>
      {products.map((product, i)=>{
        return ( 
        <li key={i}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
        )
      })
      }
    </ProductList>
  );
};

export default Home;
