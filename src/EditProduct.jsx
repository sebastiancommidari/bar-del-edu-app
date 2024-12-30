import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Input, Select, FormErrorMessage, FormControl, FormLabel, useToast, Text, HStack } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { doc, updateDoc, getDocs, collection, addDoc } from 'firebase/firestore';

function EditProduct({ product, setEditingProduct }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: product });
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingProvider, setAddingProvider] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      setCategories(querySnapshot.docs.map(doc => doc.data().name));
    };

    const fetchProviders = async () => {
      const querySnapshot = await getDocs(collection(db, 'providers'));
      setProviders(querySnapshot.docs.map(doc => doc.data().name));
    };

    fetchCategories();
    fetchProviders();
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
      await updateDoc(doc(db, 'products', product.id), data);
      toast({
        title: "Producto actualizado.",
        description: "El producto se ha actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al actualizar el producto: ${error.message}`,
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
          <Button type="submit" colorScheme="teal">Actualizar Producto</Button>
          <Button colorScheme="gray" onClick={() => setEditingProduct(null)}>Volver Atrás</Button>
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

export default EditProduct;
