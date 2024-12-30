import React from 'react';
import { Box, Flex, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { FaHome, FaShoppingCart, FaHistory, FaEdit } from 'react-icons/fa';

function Footer({ goHome, goCart, goHistory, goManage }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    bg: 'teal.500',
    color: 'white',
    p: 4,
    zIndex: 1000,
    textAlign: 'center',
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100px', // Ajuste el ancho del sidebar
    bg: 'teal.500',
    color: 'white',
    p: 4,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centrar los botones verticalmente
    alignItems: 'center',
  };

  return (
    <Box as={isMobile ? 'footer' : 'aside'} {...(isMobile ? footerStyle : sidebarStyle)}>
      <Flex direction={isMobile ? 'row' : 'column'} justify={isMobile ? 'space-around' : 'center'} align="center">
        <IconButton aria-label="Home" icon={<FaHome fontSize="30px" />} onClick={goHome} m={2} />
        <IconButton aria-label="Cart" icon={<FaShoppingCart fontSize="30px" />} onClick={goCart} m={2} />
        <IconButton aria-label="History" icon={<FaHistory fontSize="30px" />} onClick={goHistory} m={2} />
        <IconButton aria-label="Manage" icon={<FaEdit fontSize="30px" />} onClick={goManage} m={2} />
      </Flex>
    </Box>
  );
}

export default Footer;
