using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using TaskTracker.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// The connection string is never in the source code: it comes from user secrets (development)
// or from the ConnectionStrings__Default environment variable. See the README.
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException(
        "Missing connection string: set ConnectionStrings:Default (see the README).");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// On startup: create or update the schema (migrations), then load the demo data if the database is empty.
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DemoDataSeeder.SeedAsync(db);
}

app.MapControllers();

// Interactive API documentation to try the endpoints from the browser: http://localhost:5080/scalar
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.Run();
