import {
  Flex,
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik, FormikProps } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { AxiosError } from "axios";
import { ErrorResponseFormat } from "../utils/types";
import * as Yup from "yup";

export default function CreateDeliveryForm() {
  const toast = useToast({
    isClosable: true,
    position: "top-right",
  });
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        packageName: "",
        distance: "",
        price: "",
        pickupLocation: "",
        dropOffLocation: "",
      }}
      validationSchema={Yup.object({
        packageName: Yup.string().required("Package name is required"),
        dropOffLocation: Yup.string().required("Package name is required"),
        pickupLocation: Yup.string().required("Package name is required"),
        distance: Yup.number()
          .integer("Distance should be an integer")
          .required("Distance name is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const response = await axiosInstance.post("/deliveries", {
            packageName: values.packageName,
            distance: values.distance,
            price: 100000 * Number(values.distance),
            pickupLocation: values.pickupLocation,
            dropOffLocation: values.dropOffLocation,
          });

          toast({
            description: "Delivery created successfully",
            status: "success",
          });
          setTimeout(() => navigate("/deliveries"), 3000);
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
      }}
    >
      {(props) => (
        <Form>
          <Flex
            height={"100vh"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              maxW={"100vw"}
              width={"lg"}
              borderWidth="1px"
              borderRadius="lg"
              padding={10}
              borderColor={"teal"}
              overflow={"hidden"}
            >
              <Container>
                <Text fontSize={"x-large"} marginBottom={10}>
                  Create delivery
                </Text>
              </Container>
              <Container>
                <FormControl
                  isInvalid={
                    !!props.errors.packageName && props.touched.packageName
                  }
                  marginBottom={5}
                >
                  <FormLabel>
                    <Text fontSize={"sm"}>Package name</Text>
                  </FormLabel>
                  <Input
                    {...props.getFieldProps("packageName")}
                    type="text"
                    fontSize={"small"}
                  />
                  {props.errors.packageName && props.touched.packageName ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.packageName}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      A name that describes the package is good enough
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={
                    !!props.errors.pickupLocation &&
                    props.touched.pickupLocation
                  }
                  marginBottom={5}
                >
                  <FormLabel fontSize={"sm"}>Pickup location</FormLabel>
                  <Input
                    {...props.getFieldProps("pickupLocation")}
                    type="text"
                    fontSize={"small"}
                  />
                  {props.errors.pickupLocation &&
                  props.touched.pickupLocation ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.pickupLocation}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      No. 2, Tope Ajayi Street or something
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={
                    !!props.errors.dropOffLocation &&
                    props.touched.dropOffLocation
                  }
                  marginBottom={5}
                >
                  <FormLabel fontSize={"sm"}>Drop off location</FormLabel>
                  <Input
                    fontSize={"small"}
                    {...props.getFieldProps("dropOffLocation")}
                    type="text"
                  />
                  {props.errors.dropOffLocation &&
                  props.touched.dropOffLocation ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.dropOffLocation}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      No. 2, Tope Ajayi Street or something
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={!!props.errors.distance && props.touched.distance}
                >
                  <FormLabel fontSize={"sm"}>Distance</FormLabel>
                  <Input
                    fontSize={"small"}
                    {...props.getFieldProps("distance")}
                    type="number"
                  />
                  {props.errors.distance && props.touched.distance ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.distance}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Distance in kilometers
                    </FormHelperText>
                  )}
                </FormControl>

                <Flex justifyContent={"center"}>
                  <Button
                    mt={8}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                    width={"lg"}
                  >
                    Submit
                  </Button>
                </Flex>
              </Container>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
