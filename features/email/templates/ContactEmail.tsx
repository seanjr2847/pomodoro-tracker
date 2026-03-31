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

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact: {subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>New Contact Message</Heading>
          <Section style={infoBox}>
            <Text style={infoRow}><strong>From:</strong> {name} ({email})</Text>
            <Text style={infoRow}><strong>Subject:</strong> {subject}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={text}>{message}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Sent via {siteConfig.name} contact form
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  whiteSpace: "pre-wrap" as const,
};

const infoBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
};

const infoRow = { ...text, margin: "0 0 4px", fontSize: "14px" };
const hr = { borderColor: "#e6e6e6", margin: "20px 0" };
const footer = { fontSize: "12px", color: "#999999", margin: "0" };
