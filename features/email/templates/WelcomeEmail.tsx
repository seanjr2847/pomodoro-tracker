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

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {siteConfig.name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thanks for signing up for {siteConfig.name}. We&apos;re excited to
            have you on board.
          </Text>
          <Hr style={hr} />
          <Section>
            <Text style={text}>Here&apos;s what you can do next:</Text>
            <Text style={listItem}>1. Explore the dashboard</Text>
            <Text style={listItem}>2. Set up your API keys</Text>
            <Text style={listItem}>3. Check out the documentation</Text>
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

const listItem = {
  ...text,
  paddingLeft: "8px",
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
