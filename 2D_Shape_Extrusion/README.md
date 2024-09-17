2D Shape Extrusion

Overview

This project allows users to draw 2D shapes on a canvas, extrude them into 3D objects
using Babylon.js. The project consists of a backend written in C# using ASP.NET Core, HTML for the user
interface, and JavaScript for handling 2D drawing and 3D rendering.

Features

2D Shape Drawing: Users can left-click on a 2D canvas to draw points and right-click to close the shape.

Extrusion to 3D: The drawn shape can be extruded into a 3D object with a click of the "Extrude" button.

Reset: Resets the canvas, clearing the points and the 3D object, and disables drawing until the "Draw" button is clicked again.

Project Structure

Backend: ASP.NET Core serving the web application.

Frontend: HTML for the interface, Babylon.js for 3D rendering, and JavaScript for managing drawing and interactions.

File Structure

/root
├── Program.cs # ASP.NET Core backend code
├── wwwroot
│ ├── index.html # Frontend HTML and Canvas elements
│ └── app.js # Main JavaScript for canvas drawing, extrusion, and manipulation
├── README.md # Project documentation

How to Run the Project

Prerequisites

.NET 6 SDK or higher

A web browser to view the application

Steps to Run

1. Navigate to the project folder.

2. Run the ASP.NET Core application.

4. Open your browser and go to:

http://localhost:5000

The 2D drawing canvas and 3D viewer should now be available.

How to Use the Application

1. Draw Shape:

Click the "Draw" button to activate drawing mode.

Left-click on the canvas to add points.

Right-click to close the shape once you have drawn at least 3 points.

2. Extrude Shape:

Once the shape is closed, click the "Extrude" button to convert the 2D shape into a 3D object.

3. Reset:

Click the "Reset" button to clear the canvas and the 3D object.

You will need to click "Draw" again to start a new shape.

Code Breakdown

index.html

The HTML file contains the structure of the web interface:

A 2D drawing canvas (drawCanvas2D).

A 3D rendering canvas (renderCanvas3D) using Babylon.js.

Buttons for user interaction: Draw, Reset, Extrude, and Move.

<button id="drawButton">Draw</button>
<button id="resetButton">Reset</button>
<button id="extrudeButton">Extrude</button>
<button id="moveButton">Move</button>
<canvas id="drawCanvas2D" width="500" height="500"></canvas>
<canvas id="renderCanvas3D"></canvas>

app.js

The JavaScript handles 2D drawing on the canvas, shape extrusion using Babylon.js, and
moving the 3D object.

Event Listeners:

Add points to the 2D canvas with left-click.

Close the shape with a right-click.

Extrude the shape into 3D when the Extrude button is clicked.

Reset the drawing and extrusion with the Reset button.

Program.cs

The backend serves the static files for the web application.

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Enable serving static files
app.UseDefaultFiles();

app.UseStaticFiles();

app.Run();

Dependencies

Babylon.js: Used for 3D rendering and extrusion.

ASP.NET Core: Backend for serving the web app.

Future Improvements

Add rotation and scaling options for the extruded object.

Add 3D object export functionality to download the model.

Implement snapping for point placement in the 2D canvas for precision.