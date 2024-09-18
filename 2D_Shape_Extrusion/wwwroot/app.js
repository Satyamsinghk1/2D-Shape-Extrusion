document.addEventListener("DOMContentLoaded", function () {
    const canvas2D = document.getElementById("drawCanvas2D");
    const ctx = canvas2D.getContext("2d");
    const points = []; // Array to store points
    let drawingEnabled = false; // Flag to control drawing
    let extrudedMesh = null;

    // Translate the 2D context to make the origin (0, 0) the center of the canvas
    ctx.translate(canvas2D.width / 2, canvas2D.height / 2);
    // Invert the Y-axis so that positive Y goes upward
    ctx.scale(1, -1);

    // Event listener for left-click to add points
    canvas2D.addEventListener("mousedown", function (e) {
        if (drawingEnabled && e.button === 0) { // Left-click and drawing enabled
            const rect = canvas2D.getBoundingClientRect();
            const x = e.clientX - rect.left - canvas2D.width / 2;
            const y = -(e.clientY - rect.top - canvas2D.height / 2); // Invert Y to match 3D

            // Store the point
            points.push({ x, y });

            // Draw the point on the canvas
            drawPoint(x, y);
        }
    });

    // Event listener for right-click to close the shape
    canvas2D.addEventListener("contextmenu", function (e) {
        e.preventDefault(); // Prevent context menu from appearing

        if (points.length > 2) {
            // Close the shape by connecting the last point to the first point
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath(); // Connect the last point to the first
            ctx.stroke();
        }
    });

    // Function to draw individual points
    function drawPoint(x, y) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2); // Draw small circles as points
        ctx.fill();
    }

    // Function to check if points are in clockwise or counterclockwise order
    function isClockwise(points) {

        let sum = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            sum += (p2.x - p1.x) * (p2.y + p1.y);
        }

        return sum > 0; // CW if the sum is positive
    }

    // Reset button to clear the canvas
    document.getElementById("resetButton").addEventListener("click", function () {
        points.length = 0; // Clear stored points
        ctx.clearRect(-canvas2D.width / 2, -canvas2D.height / 2, canvas2D.width,
            canvas2D.height); // Clear the canvas
        drawingEnabled = false; // Disable drawing after reset
    });

    // Draw button to enable drawing
    document.getElementById("drawButton").addEventListener("click", function () {
        drawingEnabled = true; // Enable drawing when the Draw button is clicked
    });

    // Extrude button to create 3D shape
    document.getElementById("extrudeButton").addEventListener("click", function () {
        if (points.length > 2) {

            // Convert 2D points to a format Babylon.js can understand (2D to 3D)
            let shape = points.map(p => {
                // Already centered at (0,0) with inverted Y, just normalize for Babylon.js
                const x = p.x / (canvas2D.width / 2);
                const y = p.y / (canvas2D.height / 2);
                return { x, y };
            });

            // Reverse the points if they are in clockwise order
            if (isClockwise(shape)) {
                shape.reverse();
            }

            // Map to Babylon.Vector2
            shape = shape.map(p => new BABYLON.Vector2(p.x, p.y));

            // Call the function to create a 3D mesh from the 2D points
            extrudeShape(shape);
        }
    });

    // Babylon.js initialization
    const canvas3D = document.getElementById("renderCanvas3D");
    const engine = new BABYLON.Engine(canvas3D, true);
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10,

        new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas3D, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0),
        scene);

    // Function to extrude the shape into 3D
    function extrudeShape(shape) {
        // Create a path for extrusion
        const path = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1)];

        // Use PolygonMeshBuilder to create an extruded mesh
        const polygonBuilder = new BABYLON.PolygonMeshBuilder("extrudedShape", shape,
            scene);
        extrudedMesh = polygonBuilder.build(false, 1); // 1 unit height extrusion
        extrudedMesh.scaling.z = 3; // Scale the height to make extrusion more visible

        // Center the mesh
        extrudedMesh.position = new BABYLON.Vector3(0, 0, 0);

        // Adjust camera position and target to fit the extruded shape
        camera.position = new BABYLON.Vector3(0, 5, -10); // Adjust camera position for better view
        camera.setTarget(extrudedMesh.position);
        camera.lowerRadiusLimit = 2; // Optional: prevent zooming too close

        // Clear previous meshes if any
        scene.meshes.forEach(mesh => {

            if (mesh !== extrudedMesh) {
                mesh.dispose();
            }
        });

        engine.runRenderLoop(function () {
            scene.render();
        });
    }

    // Resize the engine when the window is resized
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // Move object by a set amount
    document.getElementById("moveButton").addEventListener("click", function () {
        const moveAmount = 1; // Move by 1 unit per click
        extrudedMesh.position.addInPlace(new BABYLON.Vector3(moveAmount, 0, 0)); //Move along X - axis
    });

});