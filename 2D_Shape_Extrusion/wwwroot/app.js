document.addEventListener("DOMContentLoaded", function ()
{
    // Access the 2D canvas and its context
    const canvas2D = document.getElementById("drawCanvas2D");
    const ctx = canvas2D.getContext("2d");

    // Array to store points of the 2D shape
    const points = [];

    // Flag to enable/disable drawing
    let drawingEnabled = false; 

    // Holds the 3D extruded mesh
    let extrudedMesh = null; 

    // Tracks visibility state of movement buttons
    let moveButtonsVisible = false; 

    // Adjust canvas context to center the origin and invert Y-axis for drawing
    ctx.translate(canvas2D.width / 2, canvas2D.height / 2);
    ctx.scale(1, -1);

    // Event listener for left-click to add points
    canvas2D.addEventListener("mousedown", function (e)
    {
        if (drawingEnabled && e.button === 0)
        {
            // Left-click and drawing enabled
            const rect = canvas2D.getBoundingClientRect();

            // Normalize X
            const x = e.clientX - rect.left - canvas2D.width / 2;

            // Normalize and Invert Y to match 3D canvas
            const y = -(e.clientY - rect.top - canvas2D.height / 2); 

            points.push({ x, y });

            // Draw the point on the canvas
            drawPoint(x, y); 
        }
    });

    // Event listener for right-click to close the shape
    canvas2D.addEventListener("contextmenu", function (e)
    {
        // Prevent default context menu
        e.preventDefault(); 

        if (points.length > 2)
        {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            // Draw lines connecting each point in sequence
            points.forEach(point => ctx.lineTo(point.x, point.y));

            ctx.closePath();

            // Draw the closed shape
            ctx.stroke(); 
        }
    });

    // Function to draw individual points as circles
    function drawPoint(x, y)
    {
        ctx.fillStyle = "black";
        ctx.beginPath();

        // Draw small circles representing the point
        ctx.arc(x, y, 5, 0, Math.PI * 2); 
        ctx.fill();
    }

    // Function to check if points are in clockwise order
    function isClockwise(points)
    {
        let sum = 0;
        for (let i = 0; i < points.length; i++)
        {

            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            sum += (p2.x - p1.x) * (p2.y + p1.y);
        }

        // Return true if sum is positive (clockwise)
        return sum > 0; 
    }

    // Function to show or hide movement buttons
    function setMoveButtonsVisible(visible)
    {
        document.getElementById("moveXPositive").style.display = visible ? "inline" : "none";
        document.getElementById("moveXNegative").style.display = visible ? "inline" : "none";
        document.getElementById("moveYPositive").style.display = visible ? "inline" : "none";
        document.getElementById("moveYNegative").style.display = visible ? "inline" : "none";
        moveButtonsVisible = visible;
    }

    // Reset button to clear the canvas and hide the 3D mesh and move buttons
    document.getElementById("resetButton").addEventListener("click", function ()
    {
        // Clear stored points
        points.length = 0; 

        // Clear the canvas
        ctx.clearRect(-canvas2D.width / 2, -canvas2D.height / 2, canvas2D.width, canvas2D.height); 

        // Disable drawing
        drawingEnabled = false; 

        if (extrudedMesh) {

            // Dispose of the 3D mesh
            extrudedMesh.dispose(); 
            extrudedMesh = null;

        }

        // Hide move buttons
        setMoveButtonsVisible(false); 
    });

    // Draw button to enable drawing mode
    document.getElementById("drawButton").addEventListener("click", function ()
    {
        drawingEnabled = true;
    });

    // Extrude button to create 3D shape from 2D points
    document.getElementById("extrudeButton").addEventListener("click", function ()
    {
        if (points.length > 2)
        {
            let shape = points.map(p =>
            ({
                x: p.x / (canvas2D.width / 2),
                y: p.y / (canvas2D.height / 2)
            }));

            if (isClockwise(shape))
            {
                // Reverse points if clockwise
                shape.reverse(); 
            }

            shape = shape.map(p => new BABYLON.Vector2(p.x, p.y));

            // Create 3D mesh
            extrudeShape(shape); 
        }
    });

    // Initialize Babylon.js engine and scene
    const canvas3D = document.getElementById("renderCanvas3D");
    const engine = new BABYLON.Engine(canvas3D, true);
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas3D, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Function to extrude the 2D shape into a 3D mesh
    function extrudeShape(shape)
    {
        const path = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1)];
        const polygonBuilder = new BABYLON.PolygonMeshBuilder("extrudedShape", shape, scene);

        // Create 3D mesh with 1 unit extrusion
        extrudedMesh = polygonBuilder.build(false, 1); 

        // Scale height for better visibility
        extrudedMesh.scaling.z = 3; 

        extrudedMesh.position = new BABYLON.Vector3(0, 0, 0);
        camera.position = new BABYLON.Vector3(0, 5, -10);
        camera.setTarget(extrudedMesh.position);
        camera.lowerRadiusLimit = 2;

        scene.meshes.forEach(mesh =>
        {
            if (mesh !== extrudedMesh)
            {
                // Dispose previous meshes
                mesh.dispose(); 
            }
        });

        // Render loop
        engine.runRenderLoop(() => scene.render()); 
    }

    // Function to move the 3D mesh by a given offset
    function moveExtrudedMesh(x, y)
    {
        if (extrudedMesh)
        {
            extrudedMesh.position.addInPlace(new BABYLON.Vector3(x, y, 0));
        }
    }

    // Toggle visibility of movement buttons
    document.getElementById("moveButton").addEventListener("click", function ()
    {
        setMoveButtonsVisible(!moveButtonsVisible);
    });

    // Movement button event listeners
    document.getElementById("moveXPositive").addEventListener("click", () => moveExtrudedMesh(1, 0));
    document.getElementById("moveXNegative").addEventListener("click", () => moveExtrudedMesh(-1, 0));
    document.getElementById("moveYPositive").addEventListener("click", () => moveExtrudedMesh(0, 1));
    document.getElementById("moveYNegative").addEventListener("click", () => moveExtrudedMesh(0, -1));

    // Adjust canvas size on window resize
    window.addEventListener("resize", function ()
    {
        engine.resize();
    });
});