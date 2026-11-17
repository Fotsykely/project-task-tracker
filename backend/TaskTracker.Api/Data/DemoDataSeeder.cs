using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Data;

public static class DemoDataSeeder
{
    // Inserts nothing when the database already has projects: restarting the API never creates duplicates.
    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Projects.AnyAsync(cancellationToken))
            return;

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        db.Projects.AddRange(
            new Project
            {
                Name = "Refonte du site vitrine",
                Description = "Nouveau site pour le client Maison Delorme.",
                Tasks =
                [
                    new() { Title = "Maquettes de la page d'accueil", Status = ProjectTaskStatus.Done },
                    new() { Title = "Intégration responsive", Status = ProjectTaskStatus.InProgress, DueDate = today.AddDays(7) },
                    new() { Title = "Rédaction des mentions légales", DueDate = today.AddDays(14) },
                ],
            },
            new Project
            {
                Name = "Campagne newsletter de printemps",
                Description = "Trois envois entre mars et mai.",
                Tasks =
                [
                    new() { Title = "Choisir les produits à mettre en avant", Status = ProjectTaskStatus.Done },
                    new() { Title = "Rédiger les textes", Status = ProjectTaskStatus.InProgress, DueDate = today.AddDays(3) },
                    new() { Title = "Programmer l'envoi", DueDate = today.AddDays(10) },
                ],
            },
            new Project
            {
                Name = "Identité visuelle Café Lumière",
                Tasks =
                [
                    new() { Title = "Proposer trois logos", DueDate = today.AddDays(5) },
                    new() { Title = "Valider la palette de couleurs" },
                ],
            });

        await db.SaveChangesAsync(cancellationToken);
    }
}
