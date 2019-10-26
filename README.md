# Getting Started

To start the application, just run `yarn serve`

NOTE, it requires that the following auth0 environment variables are provided:

- AUTH0_CLIENT_ID,
- AUTH0_CLIENT_SECRET,
- AUTH0_CLIENT_AUDIENCE

These can be found under the "Applications" section of Auth0, and are used to make a Machine-To-Machine call to grab the Management API token.