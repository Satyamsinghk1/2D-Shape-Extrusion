var builder = WebApplication.CreateBuilder(args);

// Build the app
var app = builder.Build();

// Enable serving default and static files
app.UseDefaultFiles(); // Serve index.html by default
app.UseStaticFiles(); // Serve static files like JS, CSS, images, etc.

// Run the app
app.Run();