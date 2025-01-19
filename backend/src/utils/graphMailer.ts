// src/utils/graphMailer.ts

import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Azure AD credential
const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID || "",
  process.env.AZURE_CLIENT_ID || "",
  process.env.AZURE_CLIENT_SECRET || ""
);

// Initialize the authentication provider
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ["https://graph.microsoft.com/.default"],
});

// Initialize the Microsoft Graph client with middleware
const graphClient = Client.initWithMiddleware({
  authProvider,
});

const fromAddress = process.env.GRAPH_FROM_ADDRESS || "support@storynook.be";

/**
 * Send an email via Microsoft Graph's /sendMail endpoint
 * 
 * @param toEmail   The recipient's email address
 * @param subject   The email subject
 * @param body      The email body text (or HTML if you prefer)
 */
export async function sendGraphMail(
  toEmail: string,
  subject: string,
  body: string
) {
  try {
    const message = {
      subject,
      body: {
        contentType: "HTML",
        content: body,
      },
      toRecipients: [
        {
          emailAddress: { address: toEmail },
        },
      ],
      from: {
        emailAddress: { address: fromAddress },
      },
    };

    // Correct API endpoint: include the user in the path
    await graphClient.api(`/users/${fromAddress}/sendMail`).post({
      message,
      saveToSentItems: "false",
    });

    console.log(`[Graph Mailer] Sent mail to ${toEmail} from ${fromAddress}`);
  } catch (error) {
    console.error("[Graph Mailer Error]", error);
    throw new Error("Failed to send mail via Graph");
  }
}
