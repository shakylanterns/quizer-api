# Quizer Backend

This is a simple program for reviewing study materials. Users makes new card
that contain (short) questions and answers, than add them to collections. Each
time the user will review a collection of cards.

Here it is the backend (API) for the program. Any kind of frontend can
use it if they can make network requests.

## Technology Stack

It uses NestJS (Express, TypeScript, TypeORM, Jest...).

## Development

1. Clone the repository.
2. Install all the required dependencies with

```
npm install
```

3. Fill the environment variables

Create `.env.test` for environment variables during tests, `.env.development`
for development, and `.env.production` for production. An example dot env file
is in `.env.sample`.

4. Run the program with

```
npm start
```

5. Test the program with

```
npm run test:e2e
npm run test
```

The first one is for integration tests and the second one is unit tests. The
tests I have written here is mostly integration tests since the components are
too simple. I ended up mocking most of the functions out when I am testing the
controllers.

## An Explanation of the Routes

### GET /user/me

Protected. Returns the current logged in user

### POST /user/register

Registers a new user. The body is a json object which contains:

- `name`: the username (1 - 35 characters)
- `password`: the password (1 - 35 characters)

After registering, the user will have his cookies filled (automatic login).

### POST /user/login

Login a user in. The body is a json object which contains:

- `name`: the username (1 - 35 characters)
- `password`: the password (1 - 35 characters)

After logging in, the user will have his cookie filled.

### POST /user/logout

Deletes the cookie.

### DELETE /user/:id

Deletes a user. This one should only be used by administrators, but this
functionality is not the program yet. It is here just to show the four CRUD
operations.

Returns the deleted user

### PATCH /user/:id

Updates a user. Receives the following json body:

- `name`?: new name
- `pasword`?: new password

Returns the new user

### GET /card/:id

Protected. Gets a new card. The card must belong to that user or else he will
get a 404 not found response.

### POST /card

Protected. Creates a new card. The card will belong to the currently logged in
user. Receives the following body:

- `question`: non-empty string.
- `answer`: the answer to the question above. Non-empty string.

### PATCH /card/:id

Protected. Updates a card, receives the following body:

- `question`?: new question.
- `answer`?: new answer

The user cannot modify cards made by other people.

### DELETE /card/:id

Protected. Removes a card if it belongso the currently logged in user.

### GET /collection/:id

Protected. Gets a collection. The collection objects will not fetch any of the
cards belong to the collection, instead it will include a list of ids of those
cards. Those cards can be fetched by `/card/:id`. This is an old problem of REST
apis...

### POST /collection

Protected. Adds a new collection with the following json body:

- `name`: name of the collection

### PATCH /collection/:id

Protected. Updates a new collection with new name. Its body is:

- `name`: name of the collection

### DELETE /collection/:id

Protected. Deletes a collection if it belongs to that user. The collection must
belong to that user for the deletion to be successful.

### POST /collection/add/:id/:cardId

Adds a card to a collection. Both collection and card must belong to that user,
or else it is unsuccessful.

### DELETE /collection/remove/:id/:cardId

Removes a card from a collection. Both collection and card must belong to that
user, and the card is already in the collection, or else it is unsuccessful.
