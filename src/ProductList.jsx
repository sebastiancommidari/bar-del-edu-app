import React, { useState, useEffect } from 'react';
import { Box, Button, SimpleGrid, Text, Input, Select, useToast, IconButton, Center } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query } from 'firebase/firestore';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';

function ProductList({ goHome }) {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const toast = useToast();

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllProducts(productsList);
      setProducts(productsList);
    };

    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      setCategories(querySnapshot.docs.map(doc => doc.data().name));
    };

    const fetchProviders = async () => {
      const querySnapshot = await getDocs(collection(db, 'providers'));
      setProviders(querySnapshot.docs.map(doc => doc.data().name));
    };

    fetchProducts();
    fetchCategories();
    fetchProviders();
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
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al eliminar el producto: ${error.message}`,
        status: "error",
        duration: 5000,
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
    <Box minHeight="100vh" bg="white" marginTop={6}>
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
        <Button colorScheme="green" onClick={() => setAddingProduct(true)}>+ Nuevo Producto</Button>
        <Button ml={2} colorScheme="gray" onClick={goHome}>Volver a Inicio</Button>
      </Center>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {products.map((product) => (
          <Box key={product.id} p={4} borderWidth="1px" borderRadius="lg" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box>
              <Text fontWeight="bold">{product.name}</Text>
              <Text>Categoría: {product.category}</Text>
              <Text>Proveedor: {product.provider}</Text>
              <Text>Precio: ${product.price}</Text>
            </Box>
            <Box>
              <IconButton icon={<EditIcon />} colorScheme="teal" onClick={() => handleEdit(product)} />
              <IconButton icon={<DeleteIcon />} colorScheme="red" ml={2} onClick={() => handleDelete(product.id)} />
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default ProductList;