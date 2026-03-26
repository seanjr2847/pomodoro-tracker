import { siteConfig } from "@/config/site";

export function getPrivacyPolicy() {
  const { name, email, url } = siteConfig;
  const { companyName, country, effectiveDate } = siteConfig.legal;

  return {
    title: `Privacy Policy - ${name}`,
    effectiveDate,
    sections: [
      {
        heading: "1. Information We Collect",
        content: `When you sign in to ${name} using Google OAuth, we collect the following information from your Google account: your email address, display name, and profile picture. We also collect usage data such as pages visited, features used, and timestamps.`,
      },
      {
        heading: "2. How We Use Your Information",
        content: `We use your information to: provide and maintain ${name}; authenticate your identity; personalize your experience; send important service notifications; and improve our services.`,
      },
      {
        heading: "3. Third-Party Services",
        content: `${name} uses the following third-party services: Google (authentication via OAuth), Neon (database hosting), Vercel (application hosting and deployment), and Paddle (payment processing, if applicable). Each service has its own privacy policy governing data handling.`,
      },
      {
        heading: "4. Cookies",
        content: `We use essential cookies to maintain your authentication session. These cookies are necessary for the service to function and cannot be disabled. We do not use advertising or tracking cookies.`,
      },
      {
        heading: "5. Data Retention and Deletion",
        content: `We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at ${email}. Upon account deletion, your personal data will be permanently removed within 30 days.`,
      },
      {
        heading: "6. Data Security",
        content: `We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS) and at rest. However, no method of electronic transmission or storage is 100% secure.`,
      },
      {
        heading: "7. Children's Privacy",
        content: `${name} is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.`,
      },
      {
        heading: "8. Changes to This Policy",
        content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective Date" above. Continued use of the service after changes constitutes acceptance of the updated policy.`,
      },
      {
        heading: "9. Contact Us",
        content: `If you have any questions about this Privacy Policy, please contact us at ${email}. ${companyName}, ${country}. Service URL: ${url}`,
      },
    ],
  };
}
