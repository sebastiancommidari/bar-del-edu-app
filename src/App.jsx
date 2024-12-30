import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Flex, useToast } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Cart from './Cart';
import PurchaseHistory from './PurchaseHistory';
import ProductList from './ProductList';
import Container from './Container';
import PageHeader from './PageHeader';
import { collection, getDocs } from 'firebase/firestore'; // Importación correcta

function useCachedData(key, fetchData) {
  const [data, setData] = useState(() => {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  });

  useEffect(() => {
    if (!data) {
      fetchData().then(fetchedData => {
        setData(fetchedData);
        localStorage.setItem(key, JSON.stringify(fetchedData));
      });
    }
  }, [data, key, fetchData]);

  return data;
}

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const toast = useToast();

  const titles = {
    home: 'Inicio',
    cart: 'Carrito',
    history: 'Historial de Compras',
    manage: 'Gestionar Productos'
  };

  const goHome = () => setView('home');
  const goCart = () => setView('cart');
  const goHistory = () => setView('history');
  const goManage = () => setView('manage');

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => doc.data().name);
  };

  const fetchProviders = async () => {
    const querySnapshot = await getDocs(collection(db, 'providers'));
    return querySnapshot.docs.map(doc => doc.data().name);
  };

  const categories = useCachedData('categories', fetchCategories);
  const providers = useCachedData('providers', fetchProviders);

  const addToCart = (product) => {
    const productWithQuantity = { ...product, quantity: product.quantity || 1 };
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
      const newCart = [...cart];
      newCart[existingProductIndex].quantity += productWithQuantity.quantity;
      setCart(newCart);
    } else {
      setCart([...cart, productWithQuantity]);
    }
    toast({
      title: "Producto agregado.",
      description: `Has agregado ${productWithQuantity.name} (${productWithQuantity.quantity}) al carrito.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
      <Header />
      <Flex>
        <Footer goHome={goHome} goCart={goCart} goHistory={goHistory} goManage={goManage} />
        <Box flex="1" pt={4} pb={20} ml={{ base: 0, md: 20 }} pl={{ base: 0, md: 6 }} pr={{ base: 0, md: 6 }}>
          <Container>
            <PageHeader title={titles[view]} />
            {view === 'home' && <Home addToCart={addToCart} />}
            {view === 'cart' && <Cart cart={cart} setCart={setCart} goHome={goHome} />}
            {view === 'history' && <PurchaseHistory goHome={goHome} />} {/* Pasar función goHome */}
            {view === 'manage' && <ProductList goHome={goHome} categories={categories} providers={providers} />} {/* Pasar función goHome */}
          </Container>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
