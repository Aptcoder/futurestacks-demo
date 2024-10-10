import {
  Box,
  Flex,
  Link,
  Button,
  Stack,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="white"
      width={"100vw"}
      px={4}
      boxShadow="sm"
      borderWidth="1px"
      position="sticky"
      top="0"
      zIndex="1000"
      borderColor={"teal"}
      mx={"auto"}
    >
      <Flex
        width="80%"
        mx={"auto"}
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Logo or Brand */}
        <Box>
          <Link as={RouterLink} to="/home" fontWeight="bold" fontSize="lg">
            Quick Deliveries
          </Link>
        </Box>

        {/* Desktop Links */}
        <Flex alignItems="center">
          <Stack
            direction="row"
            spacing={4}
            display={{ base: "none", md: "flex" }}
          >
            <Link as={RouterLink} to="/home">
              Home
            </Link>
            <Link as={RouterLink} to="/deliveries">
              Deliveries
            </Link>
            <Link as={RouterLink} to="/transactions">
              Transactions
            </Link>
          </Stack>

          {/* Mobile Hamburger Icon */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Navigation"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            bg="teal"
            color={"white"}
            _hover={{ bg: "teal.400" }}
          />
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <Link as={RouterLink} to="/home" onClick={onClose}>
              Home
            </Link>
            <Link as={RouterLink} to="/deliveries" onClick={onClose}>
              Deliveries
            </Link>
            <Link as={RouterLink} to="/transactions" onClick={onClose}>
              Transactions
            </Link>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
