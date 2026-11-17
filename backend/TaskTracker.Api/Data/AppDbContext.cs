using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTask> Tasks => Set<ProjectTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>(project =>
        {
            project.Property(p => p.Name).HasMaxLength(Project.NameMaxLength);
            project.Property(p => p.Description).HasMaxLength(Project.DescriptionMaxLength);

            // La date de création est générée par PostgreSQL, pas par le code applicatif.
            project.Property(p => p.CreatedAt).HasDefaultValueSql("now()");
        });

        modelBuilder.Entity<ProjectTask>(task =>
        {
            task.Property(t => t.Title).HasMaxLength(ProjectTask.TitleMaxLength);

            // Le statut est stocké en texte ("Todo", "InProgress", "Done") : lisible directement en SQL.
            task.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);

            // Une tâche appartient à un seul projet ; supprimer le projet supprime ses tâches.
            task.HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
