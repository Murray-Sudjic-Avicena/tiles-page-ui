import type { Configuration, PopupRequest } from '@azure/msal-browser';

// Azure AD (Microsoft Entra ID) app registration settings.
// redirectUri must be registered as a "Single-page application" redirect URI
// on this app registration in the Azure portal, or login will fail.
export const msalConfig: Configuration = {
  auth: {
    clientId: '4596d6b9-cfe4-4f47-af7d-3dd212a67381',
    authority: 'https://login.microsoftonline.com/3fd562ae-fd50-4ade-8e76-f4e1a60fefb6',
    redirectUri: 'http://localhost:5173',
  },
};

// Scopes requested for the access token used against the avitrack API.
export const loginRequest: PopupRequest = {
  scopes: ['api://4596d6b9-cfe4-4f47-af7d-3dd212a67381/avitrack.read'],
};
