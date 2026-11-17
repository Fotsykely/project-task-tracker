namespace TaskTracker.Api.Entities;

public class Project
{
    // Ces limites servent à la fois au schéma de la base et à la validation des requêtes.
    public const int NameMinLength = 3;
    public const int NameMaxLength = 80;
    public const int DescriptionMaxLength = 1000;

    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Rempli par la base de données (now()) à l'insertion : voir AppDbContext.
    public DateTime CreatedAt { get; set; }

    public List<ProjectTask> Tasks { get; set; } = [];
}
