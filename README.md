# AI-Generated Custom Phone Case Backend

This project is a backend for an AI-powered phone case customization feature, integrating **OpenAI** for image generation and **Printify** for product creation and purchasing. The backend provides API routes to generate phone case designs based on user prompts and to create and publish custom products in Printify.

## Features

- Generates custom phone case designs using **OpenAI's DALL-E**.
- Publishes and creates products in **Printify** for user purchase.
- Manages API calls between the frontend (Wix) and external services (OpenAI & Printify).

## Technologies Used

- Node.js
- Express
- OpenAI API
- Printify API
- Axios (for making API requests)
- Cors (for cross-origin requests)
- Dotenv (for environment variable management)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14.x or later)
- [Git](https://git-scm.com/)
- An account with [OpenAI](https://platform.openai.com/) for API access.
- An account with [Printify](https://printify.com) for product creation.

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/phone-case-backend.git
    cd phone-case-backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory of your project and add the following environment variables:
    ```bash
    OPENAI_API_KEY=your-openai-api-key
    PRINTIFY_API_KEY=your-printify-api-key
    PORT=5000
    ```

4. Start the server:
    ```bash
    npm start
    ```

   The server will run at `http://localhost:5000` by default. You can change the port in the `.env` file.

## API Endpoints

The backend exposes the following API endpoints:

### 1. Generate Image (OpenAI)
**Endpoint:** `POST /generate-image`

**Description:** Generates a custom image using the OpenAI DALL-E model based on a provided prompt.

**Request Body:**
```json
{
  "prompt": "Your design prompt"
}
