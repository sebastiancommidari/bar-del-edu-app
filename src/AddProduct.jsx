import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Input, Select, FormErrorMessage, FormControl, FormLabel, useToast, Text, HStack } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function AddProduct({ goBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) || []);
  const [providers, setProviders] = useState(JSON.parse(localStorage.getItem('providers')) || []);
  const [newCategory, setNewCategory] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingProvider, setAddingProvider] = useState(false);
  const toast = useToast();

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
    const cachedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const cachedProviders = JSON.parse(localStorage.getItem('providers')) || [];

    if (!cachedCategories.length || !cachedProviders.length) {
      fetchCategories();
      fetchProviders();
    } else {
      setCategories(cachedCategories);
      setProviders(cachedProviders);
      fetchCategories(); // Always fetch and update in the background for latest data
      fetchProviders();  // Always fetch and update in the background for latest data
    }
  };

  useEffect(() => {
    verifyAndUpdateData();
  }, []);

  const addCategory = async () => {
    try {
      await addDoc(collection(db, 'categories'), { name: newCategory });
      toast({
        title: "Categoría agregada.",
        description: "La nueva categoría ha sido agregada con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setNewCategory('');
      setAddingCategory(false);
      const querySnapshot = await getDocs(collection(db, 'categories'));
      setCategories(querySnapshot.docs.map(doc => doc.data().name));
      localStorage.setItem('categories', JSON.stringify(querySnapshot.docs.map(doc => doc.data().name)));
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al agregar la categoría: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addProvider = async () => {
    try {
      await addDoc(collection(db, 'providers'), { name: newProvider });
      toast({
        title: "Proveedor agregado.",
        description: "El nuevo proveedor ha sido agregado con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setNewProvider('');
      setAddingProvider(false);
      const querySnapshot = await getDocs(collection(db, 'providers'));
      setProviders(querySnapshot.docs.map(doc => doc.data().name));
      localStorage.setItem('providers', JSON.stringify(querySnapshot.docs.map(doc => doc.data().name)));
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al agregar el proveedor: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, 'products'), data);
      toast({
        title: "Producto agregado.",
        description: "El producto se ha agregado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      goBack();
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al agregar el producto: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel>Nombre del producto</FormLabel>
          <Input
            type="text"
            {...register('name', { required: 'Este campo es obligatorio' })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.category} mt={4}>
          <FormLabel>Categoría</FormLabel>
          <Select
            {...register('category', { required: 'Este campo es obligatorio' })}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.price} mt={4}>
          <FormLabel>Precio</FormLabel>
          <Input
            type="number"
            {...register('price', { required: 'Este campo es obligatorio' })}
          />
          <FormErrorMessage>
            {errors.price && errors.price.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.provider} mt={4}>
          <FormLabel>Proveedor</FormLabel>
          <Select
            {...register('provider', { required: 'Este campo es obligatorio' })}
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.provider && errors.provider.message}
          </FormErrorMessage>
        </FormControl>
        <HStack spacing={4} mt={4}>
          <Button type="submit" colorScheme="green">+ Agregar Producto</Button>
          <Button colorScheme="gray" onClick={goBack}>Volver Atrás</Button>
        </HStack>
      </form>
      <Box mt={4}>
        <Text fontWeight="bold">Gestionar Categorías</Text>
        {addingCategory ? (
          <Box mt={2}>
            <Input
              placeholder="Nueva Categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              mb={2}
            />
            <Button colorScheme="teal" onClick={addCategory}>Agregar Categoría</Button>
            <Button ml={2} colorScheme="gray" onClick={() => setAddingCategory(false)}>Cancelar</Button>
          </Box>
        ) : (
          <Button colorScheme="blue" onClick={() => setAddingCategory(true)}>Agregar Nueva Categoría</Button>
        )}
      </Box>
      <Box mt={4}>
        <Text fontWeight="bold">Gestionar Proveedores</Text>
        {addingProvider ? (
          <Box mt={2}>
            <Input
              placeholder="Nuevo Proveedor"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              mb={2}
            />
            <Button colorScheme="teal" onClick={addProvider}>Agregar Proveedor</Button>
            <Button ml={2} colorScheme="gray" onClick={() => setAddingProvider(false)}>Cancelar</Button>
          </Box>
        ) : (
          <Button colorScheme="blue" onClick={() => setAddingProvider(true)}>Agregar Nuevo Proveedor</Button>
        )}
      </Box>
    </Box>
  );
}

export default AddProduct;
