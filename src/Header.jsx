import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

function Header() {
  return (
    <Box as="header" width="100%" bg="teal.500" color="white" p={4}>
      <Flex justifyContent="center">
        <img src="https://svgsilh.com/svg/2023997.svg" width={55} alt="" />
        <Text fontSize="34px" fontWeight="bold" marginLeft={5} marginRight={5}>
          El Bar del Edu
        </Text>
        <img src="https://svgsilh.com/svg/2023997.svg" width={55} alt="" />
      </Flex>
    </Box>
  );
}

export default Header;
