// --- This service replaces ALL of your Firebase initialization and direct access logic ---

// 1. Configuration: Define the single point of contact for your backend.
// You MUST update this URL to point to your running custom server's API endpoint.
const API_BASE_URL = 'https://api.your-ecommerce-server.com/v1'; 
// For local testing, you might use: 'http://localhost:3000/v1'

/**
 * Core utility function for all API Requests (GET, POST, PUT, DELETE).
 * Handles headers, JSON serialization, and error checking automatically.
 * @param {string} endpoint - The path after the base URL (e.g., '/products').
 * @param {string} [method='GET'] - The HTTP method to use.
 * @param {object|null} [data=null] - The request body data for POST/PUT/PATCH.
 * @returns {Promise<object|null>} The parsed JSON response, or null if no content.
 */
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers for sending JSON data
    const headers = {
        'Content-Type': 'application/json',
        // If your custom backend uses Authorization, you would add the token here.
        // For example: 'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
    };

    const config = {
        method,
        headers,
        // Only include the body for methods that send data
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Attempt to parse the server's error message if available
            const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
            throw new Error(errorData.message || `API Error: ${response.status} calling ${url}`);
        }

        // Return null for successful deletion (204 No Content), otherwise parse JSON
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error(`Error during API call to ${url}:`, error);
        // Re-throw the error so the component (e.g., ProductList) can catch it
        throw error; 
    }
};

// =========================================================================
// FRONTEND FUNCTIONS THAT REPLACE YOUR FIREBASE FUNCTIONS
// =========================================================================

// 1. GET (Read Data) - Replaces your getProducts()
/**
 * Fetches all publicly available products from the server endpoint.
 * Corresponds to: GET /v1/products
 */
export const getProducts = async () => {
    // The server handles the database query and security check.
    return apiCall('/products', 'GET');
};

// 2. POST (Create Data) - Example: Adding an item to the cart
/**
 * Adds a new item to the user's cart on the server.
 * Corresponds to: POST /v1/cart/add
 * @param {object} item - The product item and quantity to add.
 */
export const addToCart = async (item) => {
    // This will replace the Firestore 'addDoc' or 'setDoc' logic.
    return apiCall('/cart/add', 'POST', item);
};

// 3. PUT/PATCH (Update Data) - Example: Updating an item's quantity in the cart
/**
 * Updates a specific resource, like the quantity of an item in the cart.
 * Corresponds to: PUT /v1/cart/update
 * @param {object} updateData - The data to update (e.g., {itemId: '123', quantity: 3}).
 */
export const updateCartItem = async (updateData) => {
    return apiCall('/cart/update', 'PUT', updateData);
};

// 4. DELETE (Delete Data) - Example: Removing an item from the cart
/**
 * Removes an item from the cart.
 * Corresponds to: DELETE /v1/cart/items/{itemId}
 * @param {string} itemId - The ID of the item to remove.
 */
export const removeFromCart = async (itemId) => {
    // The itemId is passed as a URL parameter here.
    return apiCall(`/cart/items/${itemId}`, 'DELETE');
};