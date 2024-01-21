export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beehive Monitoring System API",
      version: "1.0.0",
      description: "Swagger Documentation for the Beehive Monitoring System",
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
              example: "beehive@gmail.com",
            },
          },
        },
        Beehive: {
          type: "object",
          required: ["name", "location" ],
          properties: {
            name: {
              type: "string",
              description: "Name of the beehive",
              example: "beehive1",
            },
            location: {
              type: "string",
              description: "Location of the beehive",
              example: "location1",
            },
            CO2: {
              type: "string",
              description: "CO2 level of the beehive",
              example: "CO2",
            },
            Temperature: {
              type: "string",
              description: "Temperature of the beehive",
              example: "Temperature",
            },
            Humidity: {
              type: "string",
              description: "Humidity of the beehive",
              example: "Humidity",
            },
            Weight: {
              type: "string",
              description: "Weight of the beehive",
              example: "Weight",
            },
            Battery_level: {  
              type: "string",
              description: "Battery level of the beehive",
              example: "Battery_level",
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
