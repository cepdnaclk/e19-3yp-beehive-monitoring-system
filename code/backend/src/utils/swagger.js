export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beehive Monitoring System API",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://github.com/cepdnaclk/e19-3yp-beehive-monitoring-system/blob/main/LICENSE",
        email: "",
      },
      contact: {
        name: "Beehive Monitoring System",
        url: "https://github.com/cepdnaclk/e19-3yp-beehive-monitoring-system",
        email: "",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],

    // paths: {
    //   "/api/user": {
    //     get: {
    //       summary: "Get all users",
    //       responses: {
    //         200: {
    //           description: "OK",
    //         },
    //       },
    //     },
    //   },
    // },
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["username", "password", "email"],
          properties: {
            username: {
              type: "string",
              description: "Username of the user",
              example: "user1",
            },
            password: {
              type: "string",
              description: "Password of the user",
              example: "password",
            },
            email: {
              type: "string",
              description: "Email of the user",
              example: "bimbara@gmail.com",
            },
          },
        },
        
      },
      responses: {
        400: {
          description: "Bad Request",
          content: {
            "application/json": {},
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {},
          },
        },
        404: {
          description: "Not Found",
          content: {
            "application/json": {},
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {},
          },
        },
        200: {
          description: "OK",
          content: {
            "application/json": {},
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};
