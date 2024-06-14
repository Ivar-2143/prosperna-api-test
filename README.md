# React API Test

## Objective:
Create a simple API using ExpressJS over Node.js with JWT (JSON Web Token) authentication to manage users and products.

## Instructions:

### General Requirements:
- Implement JWT authentication to secure the API.
- Ensure all endpoints require a valid JWT token for protected actions.
- Include unit tests for each endpoint ensuring reliability and expected behavior.
- Validate inputs to prevent invalid data types or formats.
- Provide clear and informative success/error messages.
- Document each function and endpoint with comments to explain the purpose and logic.

### Create User Endpoints:

1. **Post:** `/users/register` - Registers a new user.
   - Parameters: `email` (string), `password` (hash), `password_confirmation` (hash).
   - Validates that the `password` and `password_confirmation` match and that the email is unique.
   
2. **Get:** `/users` - Retrieves a list of users.
   - Requires admin privileges.
   
3. **Get:** `/users/:id` - Retrieves a specific user by ID.
   - User can fetch their own information after logging in.
   
4. **Delete:** `/users/:id` - Deletes a user by ID.
   - Requires admin privileges or that the user is deleting their own account.
   
5. **Update:** `/users/:id` - Updates user information.
   - Parameters: `email` (string), `password` (hash), `password_confirmation` (hash).
   - User can update their own information after logging in.

### Create Product Endpoints:

1. **Post:** `/products` - Creates a new product.
   - Parameters: `product_name` (string), `product_description` (text), `product_price` (decimal), `product_tag` (array).
   - Requires user authentication.
   
2. **Get:** `/products` - Retrieves a list of products.
   - Public access.
   
3. **Get:** `/products/:id` - Retrieves a specific product by ID.
   - Public access.
   
4. **Delete:** `/products/:id` - Deletes a product by ID.
   - Requires that the user is logged in and owns the product.
   
5. **Update:** `/products/:id` - Updates product information.
   - Parameters: `product_name` (string), `product_description` (text), `product_price` (decimal), `product_tag` (array).
   - Requires that the user is logged in and owns the product.

### Output Requirements:
- Provide the GitHub repository link containing the source code.
- Include unit tests demonstrating the API's functionality and validation.
- Ensure proper validation and meaningful messages for each endpoint.
- Document the codebase with comments to describe the functionality of each part of the application.

### Notes:
- Focus on clean, readable, and maintainable code.
- Consider security best practices, especially in handling passwords and authentication tokens.
- Ensure the API's scalability for future additions or changes.
