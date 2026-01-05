# YouTube Transcript Translator

A full-stack web application that fetches transcripts from YouTube videos and translates them into different languages using OpenAI's GPT models.

## Table of Contents
1.  [Prerequisites](#prerequisites)
2.  [Setup & Installation](#setup--installation)
3.  [Dependencies & Packages](#dependencies--packages)
4.  [Project Structure & File Purposes](#project-structure--file-purposes)
5.  [API Documentation](#api-documentation)
6.  [How to Run](#how-to-run)
7.  [Usage Guide](#usage-guide)

---

## Prerequisites

*   **Node.js** (v18+ recommended)
*   **OpenAI API Key** (Required for real translations)

---

## Setup & Installation

1.  **Navigate to project folder:**
    ```bash
    cd c:\Users\jayas\Desktop\Testapp\Testapp
    ```
2.  **Install all required packages:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a `.env` file in the root and add your OpenAI key:
    ```env
    OPENAI_API_KEY=sk-your_actual_key_here
    ```

---

## Dependencies & Packages

These are the main libraries used in the project and their purposes:

| Package | Type | Purpose |
| :--- | :--- | :--- |
| **express** | Backend | The web server framework handling API requests. |
| **youtubei.js** | Backend | Wraps YouTube's internal API to fetch video metadata and captions/transcripts. |
| **openai** | Backend | Official client library to communicate with OpenAI's GPT models for translation. |
| **cors** | Backend | Middleware to allow the Frontend (port 5173) to talk to the Backend (port 3000). |
| **dotenv** | Backend | Loads sensitive configuration (API Keys) from the `.env` file into `process.env`. |
| **react** | Frontend | JavaScript library for building the user interface. |
| **vite** | Tooling | Fast build tool and development server for modern web projects. |

---

## Project Structure & File Purposes

### Backend Files
*   **`server.js`**
    *   **Purpose:** The main entry point for the backend application.
    *   **Functionality:**
        *   Initializes the Express app.
        *   Configures `youtubei.js` client.
        *   Defines API endpoints (`/transcript`, `/translate`).
        *   Implements the fallback logic for fetching transcripts if the standard method fails.
*   **`reproduce_issue.js`**
    *   **Purpose:** A standalone script for debugging and reproducing issues related to fetching YouTube transcripts.
    *   **Functionality:**
        *   Initializes `youtubei.js` independently of the server.
        *   Fetches metadata for a specific test video ID to verify connectivity.
        *   Manually downloads and parses caption tracks to verify data structures and transcript availability outside the main application flow.
*   **`debug_lib.js`**
    *   **Purpose:** A test script utilizing the `youtube-transcript` library (an alternative to `youtubei.js`).
    *   **Functionality:**
        *   Fetches transcripts for specific hardcoded video IDs.
        *   Verifies if the `youtube-transcript` package can successfully retrieve captions when other methods might fail.
*   **`.env`**
    *   **Purpose:** Stores sensitive environment variables.
    *   **Content:** Contains `OPENAI_API_KEY`. **Never commit this file to version control (git).**

### Frontend Files
*   **`src/App.jsx`**
    *   **Purpose:** The main React component rendering the UI.
    *   **Functionality:**
        *   Manages state (URL input, loading status, results).
        *   Sends requests to the backend API.
        *   Displays the original transcript and the translated text side-by-side.
*   **`vite.config.js`**
    *   **Purpose:** Configuration file for Vite.
    *   **Functionality:** Sets up the React plugin and server options.

### Other
*   **`package.json`**
    *   **Purpose:** The project manifest.
    *   **Content:** Lists project metadata, scripts (`npm run dev`, `npm run server`), and dependencies.

---

## API Documentation

The backend (`server.js`) runs on `http://localhost:3000` and provides these endpoints:

### 1. GET `/transcript`
**Purpose:** Fetches the transcript for a given YouTube video.
*   **Query Parameters:**
    *   `videoId` (required): The 11-character YouTube video ID.
*   **Response:**
    *   `200 OK`: JSON object containing an array of transcript segments (`items`) and the full concatenated text (`fullText`).
    *   `404 Not Found`: If the video has no captions.
    *   `500 Error`: If fetching fails.

### 2. POST `/translate`
**Purpose:** Translates text using OpenAI (or Mock mode).
*   **Body (JSON):**
    ```json
    {
      "text": "The full text to translate...",
      "targetLanguage": "Spanish",
      "useMock": false
    }
    ```
*   **Response:**
    *   `200 OK`: JSON `{ "translatedText": "..." }`
    *   `429 Too Many Requests`: If OpenAI quota is exceeded.

### 3. GET `/languages` (Utility)
**Purpose:** Lists available caption languages for a video.
*   **Query Parameters:**
    *   `videoId` (required)
*   **Response:** Array of available caption track objects.

---

## How to Run

1.  **Start Backend:**
    ```bash
    npm run server
    ```
    *(Runs `node server.js` on port 3000)*

2.  **Start Frontend:**
    ```bash
    npm run dev
    ```
    *(Runs `vite` dev server, usually on port 5173)*

---

## Usage Guide

1.  Open the App in your browser (link provided by `npm run dev`).
2.  Paste a **YouTube URL**.
3.  Enter a **Target Language**.
4.  **Mock Mode:** Check "Use Mock Translation" to test the system without using real money/credits.
5.  Click **"Get Transcript & Translate"**.
# TESTAPP