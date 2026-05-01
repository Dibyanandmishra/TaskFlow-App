const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'Production-grade REST API with Authentication and Role-Based Access Control',
      contact: {
        name: 'TaskFlow Team',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'SecurePass1', minLength: 8 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'SecurePass1' },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },


        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6633a1b2c3d4e5f6a7b8c9d0' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Complete API documentation' },
            description: { type: 'string', example: 'Write Swagger docs for all endpoints' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdBy: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Build TaskFlow API', minLength: 3, maxLength: 150 },
            description: { type: 'string', example: 'Implement all endpoints' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errorCode: { type: 'string' },
            errors: {
              type: 'array',
              nullable: true,
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            totalDocs: { type: 'integer', example: 50 },
            totalPages: { type: 'integer', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & authorization' },
      { name: 'Tasks', description: 'Task CRUD operations' },
      { name: 'Users', description: 'User management (admin)' },
      { name: 'Health', description: 'Service health checks' },
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Service is healthy',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
            },
          },
        },
      },
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
          },
          responses: {
            201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            409: { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            422: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/v1/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } },
          },
          responses: {
            200: { description: 'Token refreshed' },
            401: { description: 'Invalid refresh token' },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Profile retrieved' },
            401: { description: 'Not authenticated' },
          },
        },
      },
      '/api/v1/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks (paginated, filtered, sorted)',
          security: [{ BearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 20, maximum: 100 } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'in_progress', 'completed'] } },
            { in: 'query', name: 'priority', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
            { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Full-text search on title & description' },
            { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate'], default: 'createdAt' } },
            { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          ],
          responses: {
            200: {
              description: 'Tasks retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                        },
                      },
                      meta: { $ref: '#/components/schemas/PaginationMeta' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTaskRequest' } } },
          },
          responses: {
            201: { description: 'Task created' },
            422: { description: 'Validation error' },
          },
        },
      },
      '/api/v1/tasks/stats': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task statistics',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Statistics retrieved' },
          },
        },
      },
      '/api/v1/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by ID',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task retrieved' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
        patch: {
          tags: ['Tasks'],
          summary: 'Update a task',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTaskRequest' } } },
          },
          responses: {
            200: { description: 'Task updated' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task deleted' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
      },
      '/api/v1/users': {
        get: {
          tags: ['Users'],
          summary: 'List all users (admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'role', schema: { type: 'string', enum: ['user', 'admin'] } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Users retrieved' },
            403: { description: 'Forbidden — admin only' },
          },
        },
      },
      '/api/v1/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID (admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'User retrieved' },
            404: { description: 'Not found' },
          },
        },
      },
      '/api/v1/users/{id}/role': {
        patch: {
          tags: ['Users'],
          summary: 'Update user role (admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role'],
                  properties: { role: { type: 'string', enum: ['user', 'admin'] } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Role updated' },
          },
        },
      },
      '/api/v1/users/{id}/status': {
        patch: {
          tags: ['Users'],
          summary: 'Toggle user active status (admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['isActive'],
                  properties: { isActive: { type: 'boolean' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status toggled' },
          },
        },
      },
    },
  },
  apis: [], // We define paths inline above
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
