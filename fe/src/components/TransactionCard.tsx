import { Card, CardBody, Flex, Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { formatAmount } from "../utils";

export type transactionType = {
  balanceAfter: number;
  amount: number;
  _id: string;
  reference: string;
  status: string;
  type: string;
  category: string;
  createdAt: string;
};

const getTitle = (category: string) => {
  switch (category) {
    case "rider_delivery_payment":
      return "Received delivery payment";
    case "user_delivery_payment":
      return "Made delivery payment";
    case "fund_wallet":
      return "Funded wallet";
    default:
      return "Made external transfer";
  }
};

export default function TransactionCard({
  transaction,
}: {
  transaction: transactionType;
}) {
  const title = getTitle(transaction.category);

  return (
    <Card mt={"10px"} variant={"outline"}>
      <CardBody>
        <Flex justifyContent="space-between">
          <Box>
            <Text>{title}</Text>
          </Box>
          <Box>
            <Text color={transaction.type === "credit" ? "teal" : "red"}>
              {transaction.type === "credit" ? "+" : "-"}
              {transaction.amount ? formatAmount(transaction.amount) : 1000}
            </Text>
          </Box>
        </Flex>
        <Flex gap="0.5em" justifyContent="space-between">
          <Text fontWeight="light" fontSize="sm">
            {format(transaction.createdAt, "h:mma, EEEE, MMMM d, yyyy")}
          </Text>
          <Text fontWeight="light" fontSize="sm">
            {formatAmount(transaction.balanceAfter)}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
}
