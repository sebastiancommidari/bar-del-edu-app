import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Input, FormErrorMessage, FormControl, FormLabel, useToast, HStack } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

function EditProduct({ product, setEditingProduct }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: product });
  const toast = useToast();

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
    <Box pt={2} pb={6}>
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
        <HStack spacing={4} mt={4} width="100%">
          <Button type="submit" colorScheme="green" width="50%">Actualizar Producto</Button>
          <Button colorScheme="gray" onClick={() => setEditingProduct(null)} width="50%">Volver Atrás</Button>
        </HStack>
      </form>
    </Box>
  );
}

export default EditProduct;
