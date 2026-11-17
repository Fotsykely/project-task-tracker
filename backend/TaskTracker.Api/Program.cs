using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using TaskTracker.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// La chaîne de connexion n'est jamais dans le code : elle vient des user-secrets (développement)
// ou de la variable d'environnement ConnectionStrings__Default. Voir le README.
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException(
        "Chaîne de connexion manquante : définir ConnectionStrings:Default (voir le README).");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Au démarrage : crée ou met à jour le schéma (migrations), puis charge les données de démo si la base est vide.
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DemoDataSeeder.SeedAsync(db);
}

app.MapControllers();

// Documentation interactive de l'API pour la tester depuis le navigateur : http://localhost:5080/scalar
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.Run();
