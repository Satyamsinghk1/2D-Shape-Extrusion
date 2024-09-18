2D Shape Drawing and Extrusion with Manipulation

Overview

This project allows users to draw 2D shapes on a canvas and extrude them into 3D objects
using Babylon.js. It is a simple web application that helps visualize and manipulate 2D and
3D objects, providing basic functionality to draw, extrude, move, and reset objects. The
project is built using a combination of JavaScript, HTML5, Babylon.js (for 3D rendering),
and a backend using C# with ASP.NET Core to serve the static files.

---

Project Structure

/root
├── Program.cs # ASP.NET Core backend code to serve static files
├── wwwroot
│ ├── index.html # HTML structure and layout for the web interface
│ └── app.js # JavaScript that manages 2D drawing, extrusion, and interactions
├── README.md # Project documentation

Features

1. Drawing 2D Shapes

Activation: The drawing feature is activated by clicking the "Draw" button.

Interaction:

Left-click on the 2D canvas to place points.

Right-click to close the shape after placing at least 3 points.

Canvas Manipulation:

The canvas has its origin set at the center for a natural Cartesian coordinate experience.

Positive Y-axis is inverted to maintain the traditional 2D Cartesian plane setup.

Logic:

Left-click adds a point on the canvas based on the user's mouse coordinates. These points
are stored in an array.

Right-click completes the shape by connecting the last point to the first, closing the
polygon.

Each point is represented visually with a small circle (arc), and lines are drawn between
points to outline the shape.

2. Extruding Shapes into 3D

Activation: Click the "Extrude" button after drawing and closing the 2D shape.

Interaction: The shape is extruded vertically, creating a 3D object.

Babylon.js Rendering:

A 3D scene is created with a camera and lighting to visualize the extruded object.

The object is scaled and positioned for better viewing.

Logic:

The system first checks if the drawn points form a closed polygon and ensures that the
shape is counterclockwise (a requirement for Babylon.js to correctly render the polygon).

The BABYLON.PolygonMeshBuilder is used to extrude the 2D shape along the Z-axis by a
unit length.

The shape is extruded into a 3D mesh and rendered in the 3D canvas, allowing users to
view the object from multiple angles.

3. Moving the 3D Object

Activation: Clicking the "Move" button reveals directional controls (+X, -X, +Y, -Y).

Interaction:

Once visible, these buttons allow you to move the extruded object along the X and Y axes.

Clicking the "Move" button again hides the movement controls, preventing further
movement until reactivated.

Logic:

When the "Move" button is clicked for the first time, directional buttons are made visible
(+X, -X, +Y, -Y).

These buttons update the 3D mesh’s position along the corresponding axis when clicked.

A second click on the "Move" button hides the directional controls.

4. Resetting the Canvas and 3D Scene

Activation: Clicking the "Reset" button clears both the 2D canvas and the 3D rendered
object.

Interaction: All points are removed, the 2D shape is cleared, and the 3D object is disposed
of.

Logic:

The canvas is cleared, the points array is emptied, and the drawing mode is disabled.

If a 3D mesh has been extruded, it is disposed of to free up resources, and the scene is
reset for a new drawing.

---

Functionality Breakdown

1. Draw Button

Enables the drawing mode: Allows users to place points on the 2D canvas. This is the initial
step before extrusion.

Thought Process: Separating drawing mode from shape manipulation and extrusion
ensures that the user can focus on drawing shapes without accidentally interacting with
the 3D object or resetting the canvas.

2. Reset Button

Clears everything: Empties the point array, clears the 2D canvas, and deletes the 3D object
(if any). The user is required to click "Draw" again to start a new shape.

Thought Process: Reset functionality allows users to start fresh without any leftover state
from previous drawings or extrusions, ensuring clean state management.

3. Extrude Button

Converts 2D to 3D: Extrudes the drawn shape vertically into a 3D object, using Babylon.js
for rendering.

Thought Process: The extrusion function transforms the 2D representation into 3D, aligning
with the core goal of the project: turning user-drawn shapes into manipulable 3D objects.

4. Move Button

Shows/hides directional buttons: The "Move" button toggles the visibility of additional
buttons (+X, -X, +Y, -Y) which allow users to move the extruded shape along the X or Y axis.

Thought Process: Instead of cluttering the UI with too many buttons, the "Move" button
simplifies the interface by revealing movement controls only when necessary, improving
user experience.

---

Backend (ASP.NET Core)

Program.cs

Purpose: Serves the static files (HTML, CSS, JavaScript) to the browser.

Thought Process: Since this is a simple web application, the backend does not perform
complex logic. Instead, its role is limited to serving the frontend files required for the
application to function.

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Enable serving default files like index.html
app.UseDefaultFiles();

// Serve static files from wwwroot folder (CSS, JavaScript, images)
app.UseStaticFiles();

app.Run();

---

How to Run the Project

Prerequisites

.NET 6 SDK or higher: To run the ASP.NET Core backend.

Modern web browser: To view and interact with the web application.

Steps to Run

1. Clone the Repository: Download the code to your local machine.

2. Navigate to the Project Folder: Open the folder containing the project files.

3. Run the Application:

Use the terminal or Visual Studio to build and run the ASP.NET Core application.

The application should run on http://localhost:5000.

4. Interact with the App:

Start drawing shapes and extruding them into 3D objects directly in your browser!

---

APIs Used

Babylon.js: A powerful 3D engine used for rendering the 3D extruded object. This API
provides tools for setting up the camera, lights, and mesh extrusion.

ArcRotateCamera: Allows users to rotate around the 3D object for better viewing.

PolygonMeshBuilder: The core function that extrudes 2D shapes into 3D meshes.

ASP.NET Core: A lightweight framework to serve the static frontend files.

---

Future Improvements


Mouse Interaction: Add mouse drag option for the movement of the extruded object

Vertex Edit: Add vertex edit functionality to freely move the the vertices in 3D space.

Rotation and Scaling: Adding features to rotate and scale the 3D object.

