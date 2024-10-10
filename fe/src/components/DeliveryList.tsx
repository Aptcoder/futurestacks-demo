import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AcceptDeliveryForm from "./AcceptDeliveryForm";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import { AxiosError } from "axios";
import { ErrorResponseFormat } from "../utils/types";
import { formatAmount } from "../utils";

export type DeliveryType = {
  _id: string;
  packageName: string;
  distance: number;
  pickupLocation: string;
  dropOffLocation: string;
  price: number;
  status: string;
};

export default function DeliveryList({
  deliveries,
  isOpen,
  role,
}: {
  role: string;
  deliveries: DeliveryType[];
  isOpen: boolean;
}) {
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const toast = useToast();
  const [isSubmitting, setSubmitting] = useState(false);

  // Function to handle button click
  const handleOpenModal = (id: string) => {
    setDeliveryId(id);
    onOpen();
  };

  async function makeDeliveryPayment(deliveryId: string) {
    try {
      setSubmitting(true);
      const response = await axiosInstance.patch(
        `/deliveries/${deliveryId}/payment`
      );
      const paymentURL = response.data.data.paymentUrl;
      toast({
        description: "You'll be redirected to payment page",
        status: "success",
      });
      setTimeout(() => window.open(paymentURL, "_blank"), 3000);
    } catch (error) {
      const typedError = error as AxiosError<ErrorResponseFormat>;
      toast({
        description:
          typedError.response?.data?.message ||
          "An error occurred creating delivery.",
        status: "error",
      });
    } finally {
      setSubmitting(false); // Stop the loading state of the button
    }
  }

  return (
    <>
      {deliveries.map((d) => (
        <Container key={d._id}>
          <Card my={"15px"} variant={"outline"}>
            <CardBody>
              <Flex justifyContent="space-between">
                <Box>
                  <Text>
                    <b>Package:</b> {d.packageName}
                  </Text>
                </Box>
                <Box>
                  <Badge colorScheme={d.status === "closed" ? "red" : "teal"}>
                    {d.status}
                  </Badge>
                </Box>
              </Flex>
              <Flex gap="0.5em" justifyContent="space-between">
                <Box>
                  <b>Distance:</b> {d.distance}km
                </Box>
                <Box>
                  <b>Price: </b>
                  {"\u{20A6}"}
                  {formatAmount(d.price)}
                </Box>
              </Flex>
              {isOpen ? (
                <Button
                  onClick={() => handleOpenModal(d._id)}
                  colorScheme="teal"
                  size="sm"
                  mt="10px"
                >
                  Accept Delivery
                </Button>
              ) : (
                ""
              )}
              {role === "user" && d.status === "accepted" ? (
                <Button
                  onClick={() => makeDeliveryPayment(d._id)}
                  colorScheme="teal"
                  size="sm"
                  mt="10px"
                  isLoading={false}
                  disabled={isSubmitting}
                >
                  Make Payment
                </Button>
              ) : (
                ""
              )}
            </CardBody>
          </Card>
        </Container>
      ))}

      {/* Modal to render the form */}
      <Modal size={"lg"} isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Complete Payment</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <AcceptDeliveryForm
              onClose={onClose}
              deliveryId={deliveryId as string}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
