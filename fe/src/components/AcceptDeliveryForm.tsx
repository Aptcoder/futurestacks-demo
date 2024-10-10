import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useFormik, Formik, Form as FormikForm, FormikProps } from "formik";
import * as Yup from "yup";
import { ErrorResponseFormat } from "../utils/types";
import axiosInstance from "../utils/axios";

const initialValues = {};

export default function AcceptDeliveryForm({
  deliveryId,
  onClose,
}: {
  onClose: () => void;
  deliveryId: string;
}) {
  const toast = useToast();
  return (
    <Formik
      initialValues={{
        riderPaymentMethod: "",
      }}
      validationSchema={Yup.object({
        // riderPaymentMethod: Yup.string().required(),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log("submitted values", values);
          setSubmitting(true);
          const response = await axiosInstance.patch(
            `/deliveries/${deliveryId}/accept`,
            {
              riderPaymentMethod: values.riderPaymentMethod,
            }
          );

          toast({
            title: "Delivery accepted",
            description: "Customer will be expecting their package",
            status: "success",
          });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2500);
        } catch (error) {
          const typedError = error as AxiosError<ErrorResponseFormat>;
          toast({
            title: "Accepting delivery failed",
            description:
              typedError.response?.data?.message ||
              "An error occurred during login.",
            status: "error",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(
        props: FormikProps<{
          riderPaymentMethod: string;
        }>
      ) => (
        <FormikForm onSubmit={props.handleSubmit}>
          <Flex
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Container>
              <Text fontSize={"x-large"} marginBottom={10}>
                Select a preferred payment method
              </Text>

              <RadioGroup
                // {...props.getFieldProps("riderPaymentMethod")}
                value={props.values.riderPaymentMethod}
                onChange={(value) =>
                  props.setFieldValue("riderPaymentMethod", value)
                }
                colorScheme="teal"
                defaultValue={"wallet"}
                mt={8}
                // value={props.values.riderPaymentMethod}
              >
                <Stack spacing={[1, 5]} direction={"row"}>
                  <Radio value="wallet">Wallet</Radio>
                  <Tooltip>
                    <Radio value="disburse">Direct Payment</Radio>
                  </Tooltip>
                </Stack>
              </RadioGroup>
              {props.errors.riderPaymentMethod &&
                props.touched.riderPaymentMethod && (
                  <Text color="red.500" mt={2}>
                    {props.errors.riderPaymentMethod}
                  </Text>
                )}
              <Alert mt={"2vh"} fontSize={"sm"} size={"sm"} status="success">
                <AlertIcon />
                Payment for direct payment deliveries happens at settlement time
                next day
              </Alert>
              <Flex justifyContent={"center"}>
                <Button
                  mt={8}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  onClick={() => props.handleSubmit}
                  type="submit"
                  width={"lg"}
                >
                  Submit
                </Button>
              </Flex>
            </Container>
          </Flex>
        </FormikForm>
      )}
    </Formik>
  );
}
