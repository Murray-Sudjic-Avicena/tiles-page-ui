import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './authConfig';

// A single shared MSAL instance for the whole app.
const msalInstance = new PublicClientApplication(msalConfig);

// Call once at startup, before rendering the app. Initializes MSAL, processes
// any response from a returning login redirect, and ensures the user is signed
// in — redirecting the whole tab to Microsoft if they aren't. Uses redirect
// (not popup) flow so it works reliably across Safari and Chrome.
export async function initializeAuth(): Promise<void> {
  await msalInstance.initialize();

  // If we're returning from a login redirect, this resolves with the account.
  const redirectResponse = await msalInstance.handleRedirectPromise();
  if (redirectResponse?.account) {
    msalInstance.setActiveAccount(redirectResponse.account);
    return;
  }

  const existing = msalInstance.getAllAccounts()[0];
  if (existing) {
    msalInstance.setActiveAccount(existing);
    return;
  }

  // No session and not returning from a redirect — start the login redirect.
  // The tab navigates away here; this promise never resolves.
  await msalInstance.loginRedirect(loginRequest);
}

// Returns a valid access token for the signed-in user. Assumes initializeAuth()
// already ran, so an account exists. If the token can't be refreshed silently,
// redirects to Microsoft to re-authenticate.
export async function getAccessToken(): Promise<string> {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];

  try {
    const result = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    return result.accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      // Token expired / consent needed — navigates away and comes back.
      await msalInstance.acquireTokenRedirect(loginRequest);
      throw new Error('Redirecting for authentication…');
    }
    throw err;
  }
}
