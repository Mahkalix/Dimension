import { PrldSessionClient } from "@prelude.so/js-sdk";
const domain = process.env.REACT_APP_PRELUDE_DOMAIN?.trim();
// Public configuration only: never include a Management API key in the bundle.
export const preludeClient = domain ? new PrldSessionClient({ domain }) : null;
