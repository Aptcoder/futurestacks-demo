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

export default function WithdrawForm({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  return (
    <Formik
      initialValues={{
        amount: 0,
      }}
      validationSchema={Yup.object({
        amount: Yup.number()
          .test(
            "is-decimal",
            "Amount must have at most 2 decimal places",
            (value) =>
              value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
          )
          .required(),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log("submitted values", values);
          setSubmitting(true);
          const response = await axiosInstance.post(`/users/me/withdrawal`, {
            amount: values.amount * 100,
          });

          toast({
            title: "Withdrawal created",
            description: "Your money is on its way",
            status: "success",
          });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2500);
        } catch (error) {
          const typedError = error as AxiosError<ErrorResponseFormat>;
          toast({
            title: "Creating withdrawal failed",
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
          amount: number;
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
                Withdraw from wallet
              </Text>
              <FormControl
                isInvalid={!!props.errors.amount && props.touched.amount}
              >
                <FormLabel fontSize={"sm"}>Amount</FormLabel>
                <Input
                  step="0.01"
                  fontSize={"small"}
                  {...props.getFieldProps("amount")}
                  type="number"
                />
                {props.errors.amount && props.touched.amount ? (
                  <FormErrorMessage fontSize={"x-small"}>
                    {props.errors.amount}
                  </FormErrorMessage>
                ) : (
                  <FormHelperText fontSize={"x-small"}>
                    Amount in naira
                  </FormHelperText>
                )}
              </FormControl>
              <Flex justifyContent={"center"}>
                <Button
                  mt={8}
                  mb={5}
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
