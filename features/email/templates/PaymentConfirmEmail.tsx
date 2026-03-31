import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { siteConfig } from "@/config/site";

interface PaymentConfirmEmailProps {
  name: string;
  plan: string;
  amount: string;
  date: string;
}

export function PaymentConfirmEmail({
  name,
  plan,
  amount,
  date,
}: PaymentConfirmEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Payment confirmed — {plan} plan on {siteConfig.name}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Payment Confirmed</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your payment has been processed successfully.
          </Text>
          <Section style={receipt}>
            <Text style={receiptRow}>
              <strong>Plan:</strong> {plan}
            </Text>
            <Text style={receiptRow}>
              <strong>Amount:</strong> {amount}
            </Text>
            <Text style={receiptRow}>
              <strong>Date:</strong> {date}
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600" as const,
  color: "#1a1a1a",
  margin: "0 0 16px",
};

const text = {
  fontSize: "16px",
  color: "#4a4a4a",
  lineHeight: "26px",
  margin: "0 0 12px",
};

const receipt = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
};

const receiptRow = {
  ...text,
  margin: "0 0 4px",
  fontSize: "14px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  margin: "0",
};
