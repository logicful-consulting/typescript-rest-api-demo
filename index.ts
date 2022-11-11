import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";

// Initialise fastify and tell it we are going to be using Typebox
const server = fastify({
  ajv: {
    customOptions: {
      allErrors: true,
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

// Create our type for our body using Typebox
const Body = Type.Object({
  bar: Type.Boolean(),
  baz: Type.Number(),
});

// Get the Typescript type of the request body
type IBody = Static<typeof Body>;

server.post<{
  Body: IBody;
}>(
  "/foo",
  {
    schema: {
      body: Body,
    },
  },
  (request, reply) => {
    // The request body is now fully typed
    const  { bar, baz } = request.body;

    return reply.status(200).send(`You sent a request which contained ${bar} ${baz}!`);
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
