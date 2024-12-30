import React, { useState, useEffect } from 'react';
import { Box, Input, Select, SimpleGrid, Text, useToast, HStack, IconButton, Button, Center, Spinner, Flex, VStack } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { db } from './firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [quantity, setQuantity] = useState({});
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const fetchProducts = async () => {
    setLoading(true);
    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    localStorage.setItem('products', JSON.stringify(productsList));
    setProducts(productsList);
    setFilteredProducts(productsList);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name);
    localStorage.setItem('categories', JSON.stringify(fetchedCategories));
    setCategories(fetchedCategories);
  };

  const fetchProviders = async () => {
    const querySnapshot = await getDocs(collection(db, 'providers'));
    const fetchedProviders = querySnapshot.docs.map(doc => doc.data().name);
    localStorage.setItem('providers', JSON.stringify(fetchedProviders));
    setProviders(fetchedProviders);
  };

  const verifyAndUpdateData = () => {
    const cachedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const cachedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const cachedProviders = JSON.parse(localStorage.getItem('providers')) || [];

    if (!cachedProducts.length || !cachedCategories.length || !cachedProviders.length) {
      fetchProducts();
      fetchCategories();
      fetchProviders();
    } else {
      setProducts(cachedProducts);
      setFilteredProducts(cachedProducts);
      setCategories(cachedCategories);
      setProviders(cachedProviders);
      fetchProducts(); // Always fetch and update in the background for latest data
    }
  };

  useEffect(() => {
    verifyAndUpdateData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      return (
        normalizeText(product.name).includes(normalizeText(searchTerm)) &&
        (!categoryFilter || product.category === categoryFilter) &&
        (!providerFilter || product.provider === providerFilter)
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, providerFilter, products]);

  const handleQuantityChange = (productId, change) => {
    setQuantity((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 1;
      const newQuantity = currentQuantity + change;
      return { ...prevQuantities, [productId]: Math.max(newQuantity, 1) };
    });
  };

  return (
    <Box p={4}>
      <Input
        placeholder="Buscar productos"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Select
        placeholder="Todas las Categorías"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        mb={4}
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>
      <Select
        placeholder="Todos los Proveedores"
        value={providerFilter}
        onChange={(e) => setProviderFilter(e.target.value)}
        mb={4}
      >
        {providers.map(provider => (
          <option key={provider} value={provider}>{provider}</option>
        ))}
      </Select>
      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredProducts.map((product) => (
            <Box key={product.id} p={4} borderWidth="1px" borderRadius="lg">
              <Flex justify="space-between" align="flex-start">
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="22px">{product.name}</Text>
                  <Text fontSize="19px">Precio: <strong>${product.price}</strong></Text>
                </VStack>
                <VStack align="flex-end">
                  <Center>
                    <HStack>
                      <IconButton icon={<MinusIcon />} onClick={() => handleQuantityChange(product.id, -1)} />
                      <Text fontSize="18px">{quantity[product.id] || 1}</Text>
                      <IconButton icon={<AddIcon />} onClick={() => handleQuantityChange(product.id, 1)} />
                    </HStack>
                  </Center>
                  <Button mt={2} colorScheme="teal" onClick={() => addToCart({ ...product, quantity: quantity[product.id] || 1 })}>Agregar al Carrito</Button>
                </VStack>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default Home;
