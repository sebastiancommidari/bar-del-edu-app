import React, { useState, useEffect } from 'react';
import { Box, Button, SimpleGrid, Text, Input, Select, useToast, IconButton, Center, VStack, Flex } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query } from 'firebase/firestore';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';

function ProductList({ goHome }) {
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) || []);
  const [providers, setProviders] = useState(JSON.parse(localStorage.getItem('providers')) || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const toast = useToast();

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem('products', JSON.stringify(productsList));
    setAllProducts(productsList);
    setProducts(productsList);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name).sort();
    localStorage.setItem('categories', JSON.stringify(fetchedCategories));
    setCategories(fetchedCategories);
  };

  const fetchProviders = async () => {
    const querySnapshot = await getDocs(collection(db, 'providers'));
    const fetchedProviders = querySnapshot.docs.map(doc => doc.data().name).sort();
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
      setAllProducts(cachedProducts.sort((a, b) => a.name.localeCompare(b.name)));
      setProducts(cachedProducts.sort((a, b) => a.name.localeCompare(b.name)));
      setCategories(cachedCategories.sort());
      setProviders(cachedProviders.sort());
      fetchProducts(); // Always fetch and update in the background for latest data
    }
  };

  useEffect(() => {
    verifyAndUpdateData();
  }, []);

  useEffect(() => {
    const filteredProducts = allProducts.filter(product => {
      return (
        normalizeText(product.name).includes(normalizeText(searchTerm)) &&
        (!categoryFilter || product.category === categoryFilter) &&
        (!providerFilter || product.provider === providerFilter)
      );
    });
    setProducts(filteredProducts);
  }, [searchTerm, categoryFilter, providerFilter, allProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Producto eliminado.",
        description: "El producto ha sido eliminado con éxito.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al eliminar el producto: ${error.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (editingProduct) {
    return <EditProduct product={editingProduct} setEditingProduct={setEditingProduct} />;
  }

  if (addingProduct) {
    return <AddProduct goBack={() => setAddingProduct(false)} />;
  }

  return (
    <Box minHeight="100vh" bg="white" pt={2} pb={6}>
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
      <Center mb={4}>
        <Button colorScheme="green" width="50%" onClick={() => setAddingProduct(true)}>+ Nuevo Producto</Button>
        <Button ml={2} colorScheme="gray" width="50%" onClick={goHome}>Volver a Inicio</Button>
      </Center>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {products.map((product) => (
          <Box key={product.id} p={4} borderWidth="1px" borderRadius="lg" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box width="80%">
              <Text fontWeight="bold">{product.name}</Text>
              <Text>Categoría: {product.category}</Text>
              <Text>Proveedor: {product.provider}</Text>
              <Text>Precio: ${product.price}</Text>
            </Box>
            <VStack width="20%" alignItems="center">
              <IconButton icon={<EditIcon />} colorScheme="teal" onClick={() => handleEdit(product)} />
              <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(product.id)} />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default ProductList;
