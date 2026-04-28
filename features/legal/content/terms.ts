import { siteConfig } from "@/config/site";

export function getTermsOfService() {
  const { name, email, url } = siteConfig;
  const { companyName, country, effectiveDate } = siteConfig.legal;

  return {
    title: `Terms of Service - ${name}`,
    effectiveDate,
    sections: [
      {
        heading: "1. Service Description",
        content: `${name} is a software-as-a-service platform operated by ${companyName}. By accessing or using ${name} at ${url}, you agree to be bound by these Terms of Service.`,
      },
      {
        heading: "2. Usage Conditions",
        content: `You must be at least 13 years old to use ${name}. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree not to use the service for any unlawful purpose or in violation of these terms.`,
      },
      {
        heading: "3. Intellectual Property",
        content: `All content, features, and functionality of ${name} are owned by ${companyName} and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of any content you create using the service.`,
      },
      {
        heading: "4. Payment and Refund",
        content: `Certain features of ${name} may require a paid subscription. Payments are processed through Paddle, our merchant of record. Subscription fees are billed in advance on a recurring basis. Refund requests should be directed to ${email} and will be evaluated on a case-by-case basis.`,
      },
      {
        heading: "5. Service Changes and Termination",
        content: `We reserve the right to modify, suspend, or discontinue ${name} at any time, with or without notice. We may terminate or suspend your account if you violate these terms. Upon termination, your right to use the service will immediately cease.`,
      },
      {
        heading: "6. Disclaimer",
        content: `${name} is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.`,
      },
      {
        heading: "7. Limitation of Liability",
        content: `To the maximum extent permitted by law, ${companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of ${name}.`,
      },
      {
        heading: "8. Governing Law",
        content: `These Terms shall be governed by and construed in accordance with the laws of ${country}, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the courts of ${country}.`,
      },
      {
        heading: "9. Contact Us",
        content: `If you have any questions about these Terms of Service, please contact us at ${email}. ${companyName}, ${country}. Service URL: ${url}`,
      },
    ],
  };
}
