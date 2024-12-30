import React from 'react';
import { Box, Text, Button, useToast, IconButton, HStack } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { CloseIcon } from '@chakra-ui/icons'; // Importar ícono de Close

function Cart({ cart, setCart, goHome }) {
  const toast = useToast();
  
  // Asegurarse de que cart sea un array vacío por defecto
  const cartItems = cart || [];
  
  // Calcular el total del carrito
  const total = cartItems.reduce((acc, product) => acc + (Number(product.price) * product.quantity), 0);

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCart(newCart);
    toast({
      title: "Producto eliminado.",
      description: "El producto se ha eliminado del carrito.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const completePurchase = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío.",
        description: "No puedes completar la compra con el carrito vacío.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const purchaseData = {
        items: cartItems,
        total,
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'purchases'), purchaseData);
      setCart([]);
      toast({
        title: "Compra guardada.",
        description: "Tu compra se ha guardado con éxito.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      goHome();
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al registrar la compra: ${error.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrito limpio.",
      description: "El carrito ha sido vaciado.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box pb={6}>
      {cartItems.map((product, index) => (
        <Box key={index} p={4} borderWidth="1px" borderRadius="lg" mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight="bold">{product.name}</Text>
            <Text>${product.price} <strong>x {product.quantity} = ${product.price * product.quantity}</strong></Text>
          </Box>
          <IconButton colorScheme="red" icon={<CloseIcon />} onClick={() => removeFromCart(index)} /> {/* Botón de eliminar con ícono */}
        </Box>
      ))}
      <Text fontWeight="bold" fontSize="30px" mb={2} mt={4} ml={2}>Total: ${total}</Text>
      <HStack spacing={4} mt={4} width="100%">
        <Button colorScheme="red" onClick={clearCart} width="50%">Vaciar Carrito</Button>
        <Button colorScheme="green" onClick={completePurchase} width="50%" disabled={cartItems.length === 0}>Guardar Compra</Button>
      </HStack>
      <Button mt={4} colorScheme="gray" onClick={goHome} width="100%">Volver a Inicio</Button>
    </Box>
  );
}

export default Cart;
