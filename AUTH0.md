# Auth0 configuration

The app reads the Auth0 tenant from:

- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`

Current Dimension tenant:

```env
REACT_APP_AUTH0_DOMAIN=dev-s4cqy56nmufsd1nf.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=wu1hMC3jEzhtP8te5ChZ08FpuCfV8C17
```

Auth0 Application settings must include the exact origins used by the app in:

- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins

The React app uses `window.location.origin` for both login callbacks and logout return URLs.
