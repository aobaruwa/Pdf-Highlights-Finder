# PDF Highlights Finder

A modern React application built with Vite and Tailwind CSS designed to help users quickly identify and extract highlighted content from PDF and Word documents.

## Features

- **Document Support**:
    - **PDF**: View full documents with high-fidelity rendering.
    - **Word (.docx)**: Convert and view Word documents as HTML, preserving highlighting.
- **Highlight Detection**: Automatically scans uploaded PDFs to find pages containing highlights.
- **Smart Filtering**: Toggle between viewing the entire document or **only the pages with highlights**.
- **Export Functionality**: Create and download a new PDF file containing *only* the highlighted pages.
- **Viewing Controls**:
    - **Zoom**: Zoom in and out for better readability.
    - **Rotate**: Rotate pages 90 degrees clockwise.
    - **View Modes**: Switch between a standard vertical list view and a grid view for easier navigation.
- **Responsive Design**:
    - Fully responsive layout that works on desktops, tablets, and mobile devices.
    - Collapsible sidebar for better screen real estate management on smaller screens.
- **User Experience**:
    - Shimmer loading effects for a smooth visual experience.
    - Clear error handling for unsupported files or corrupted documents.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd Pdf-Highlights-Finder
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Building for Production

To build the application for production deployment:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Technologies Used

- **[React](https://react.dev/)**: Frontend library for building the user interface.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for fast builds.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for styling.
- **[React-PDF](https://github.com/wojtekmaj/react-pdf)**: For rendering PDF documents in the browser.
- **[pdf-lib](https://pdf-lib.js.org/)**: For creating and modifying PDF documents (used for the export feature).
- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)**: For converting .docx files to HTML.
- **[Lucide React](https://lucide.dev/)**: For beautiful, consistent icons.

## License

[MIT](LICENSE)
