namespace TaskTracker.Api.Entities;

public class Project
{
    // These limits are shared by the database schema and the request validation.
    public const int NameMinLength = 3;
    public const int NameMaxLength = 80;
    public const int DescriptionMaxLength = 1000;

    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Filled in by the database (now()) on insert: see AppDbContext.
    public DateTime CreatedAt { get; set; }

    public List<ProjectTask> Tasks { get; set; } = [];
}
