# Pixel Alchemy Portfolio

A modern, dynamic photography portfolio website featuring a masonry layout, advanced filtering, and a premium dark aesthetic.

## Features

-   **Dynamic Gallery**: Images are loaded dynamically from a remote JSON source, allowing for easy updates without modifying HTML.
-   **Masonry Layout**: Automatically adjusts to different image aspect ratios (horizontal/vertical) for a seamless grid.
-   **Advanced Filtering**:
    -   **Orientation**: Filter by Horizontal or Vertical images.
    -   **Location**: Filter by specific locations (dynamically populated).
    -   **Year**: Filter by the year the photo was taken (dynamically populated).
    -   **Apply Button**: Select multiple filters and apply them all at once for precise control.
-   **Responsive Design**: Fully responsive layout that adapts to desktop, tablet, and mobile screens.
-   **Custom Controls**:
    -   **Column Slider**: Adjust the number of gallery columns on the fly.
    -   **Minimalist Dropdowns**: Custom-styled, clean dropdowns for filtering.
-   **Lightbox**: Full-screen image viewer with smooth zoom and close functionality.
-   **Dynamic Hero**: The hero section background changes randomly on every page load, showcasing different images from the collection.
-   **Image Protection**: Right-click and drag-and-drop are disabled to discourage unauthorized downloading.

## Technologies Used

-   **HTML5**: Semantic structure.
-   **CSS3**: Custom styling, CSS Grid/Flexbox, and variables for theming.
-   **JavaScript (ES6+)**: Dynamic content loading, filtering logic, and interactive UI components.
-   **Bootstrap 5**: Responsive grid system and basic component structure (customized).

## Setup & Usage

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/PixelAlchemy-Portfolio.git
    ```
2.  **Open `index.html`**: Simply open the file in any modern web browser. No build step or server is required for local viewing.

## Data Source

Images and metadata are fetched from a JSON file hosted on GitHub Gist. The structure supports:
-   Years
-   Locations
-   Image details (Link, Season, Camera)

## Customization

To use your own images:
1.  Update the `JSON_URL` constant in `script.js` to point to your own JSON data source.
2.  Ensure your JSON follows the expected structure:
    ```json
    {
      "2024": {
        "Location Name": [
          {
            "imageLink": "url_to_image",
            "season": "Season",
            "shotOn": "Camera Model"
          }
        ]
      }
    }
    ```

## License

[MIT License](LICENSE)