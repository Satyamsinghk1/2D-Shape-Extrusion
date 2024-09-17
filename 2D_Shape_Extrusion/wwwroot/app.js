document.addEventListener("DOMContentLoaded", function ()
{
    const canvas2D = document.getElementById("drawCanvas2D");
    const ctx = canvas2D.getContext("2d");
    const points = []; // Array to store 2D points
    let drawingEnabled = false; // Flag to control drawing


    // ------------------- Event Listeners for 2D Drawing -------------------


    //Draw button to enable drawing
    document.getElementById("drawButton").addEventListener("click", function ()
    {
        // Enable drawing when Draw button is clicked
        drawingEnabled = true;   
    });


    // Left-click to add points
    canvas2D.addEventListener("mousedown", function (e)
    {
        if (drawingEnabled && e.button === 0)
        {
            // Detect left-click
            const rect = canvas2D.getBoundingClientRect();

            // Adjust for canvas position
            const y = e.clientY - rect.top;
            const x = e.clientX - rect.left; 

            // Store the point in the array
            points.push({ x, y });

            // Draw the point on the canvas
            drawPoint(x, y);
        }
    });


    // Right-click to close the shape
    canvas2D.addEventListener("contextmenu", function (e)
    {
        // Prevent default context menu
        e.preventDefault(); 

        // Ensure we have enough points for a shape
        if (points.length > 2)
        {
            // Draw lines between points
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++)
            {
                ctx.lineTo(points[i].x, points[i].y);
            }

            // Connect last point to the first
            ctx.closePath(); 
            ctx.stroke();
        }
    });


    // Draw a single point on the 2D canvas
    function drawPoint(x, y)
    {
        ctx.fillStyle = "black";
        ctx.beginPath();

        // Draw a circle to represent a point
        ctx.arc(x, y, 5, 0, Math.PI * 2); 
        ctx.fill();
    }


    // Function to determine if points are in a clockwise order
    function isClockwise(points)
    {
        let sum = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            sum += (p2.x - p1.x) * (p2.y + p1.y);
        }

        // Returns true if the points are clockwise
        return sum > 0; 
    }


    // ------------------- Buttons for Reset and Extrusion -------------------

    // Reset the canvas and points array
    document.getElementById("resetButton").addEventListener("click", function ()
    {
        // Clear points array
        points.length = 0; 

        // Clear the canvas
        ctx.clearRect(0, 0, canvas2D.width, canvas2D.height); 

        // Enable drawing when the Draw button iws clicked
        drawingEnabled = false; 
    });


    // Extrude the shape into 3D using Babylon.js
    document.getElementById("extrudeButton").addEventListener("click", function ()
    {
        if (points.length > 2)
        {
            let shape = points.map(p =>
            {
                const x = (p.x - canvas2D.width / 2) / (canvas2D.width / 2);
                const y = (p.y - canvas2D.height / 2) / (canvas2D.height / 2);
                return { x, y };
            });

            // Reverse the points if they are in clockwise order
            if (isClockwise(shape))
            {
                shape.reverse();
            }

            // Map points to Babylon.Vector2 and extrude
            shape = shape.map(p => new BABYLON.Vector2(p.x, p.y));
            extrudeShape(shape);
        }
    });


    // Move button to move the extruded object
    document.getElementById("moveButton").addEventListener("click", function ()
    {
        if (extrudedMesh)
        {
            // Move the extruded object by 1 unit along the x-axis
            extrudedMesh.position.x += 1
        }
    });


    // ------------------- Babylon.js 3D Rendering -------------------

    const canvas3D = document.getElementById("renderCanvas3D");
    const engine = new BABYLON.Engine(canvas3D, true);
    const scene = new BABYLON.Scene(engine);

    // Set up a rotating camera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10,
                                                 new BABYLON.Vector3(0, 0, 0), scene);


    // Allow user controls
    camera.attachControl(canvas3D, true); 


    // Add a light source
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0),
                                                scene);


    // Function to extrude the 2D shape into 3D
    function extrudeShape(shape)
    {
        // Path for extrusion
        const path = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1)]; 

        // Create a 3D mesh from the 2D shape using PolygonMeshBuilder
        const polygonBuilder = new BABYLON.PolygonMeshBuilder("extrudedShape", shape, scene);

        // 1 unit height extrusion
        const extrudedMesh = polygonBuilder.build(false, 1); 

        // Increase height for visibility
        extrudedMesh.scaling.z = 3; 

        // Adjust position and clear old meshes
        extrudedMesh.position = new BABYLON.Vector3(0, 0, 0);
        scene.meshes.forEach(mesh =>
        {
            if (mesh !== extrudedMesh) mesh.dispose();
        });

        // Run the render loop
        engine.runRenderLoop(function ()
        {
            scene.render();
        });


        // Adjust camera for better view

        // Set camera position to view from an angle
        camera.position = new BABYLON.Vector3(0, 5, -10);
        
        // Focus the camera on the extruded mesh
        camera.setTarget(extrudedMesh.position); 

        // Optional: Prevent the camera from zooming in too
        camera.lowerRadiusLimit = 2; 
        close
    }


    // Resize the engine when the window is resized
    window.addEventListener("resize", function ()
    {
        engine.resize();
    });
});