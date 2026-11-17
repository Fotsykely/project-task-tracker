namespace TaskTracker.Api.Entities;

// Nommée ProjectTask et non Task pour ne pas entrer en conflit avec System.Threading.Tasks.Task.
public class ProjectTask
{
    public const int TitleMaxLength = 200;

    public int Id { get; set; }
    public required string Title { get; set; }
    public ProjectTaskStatus Status { get; set; } = ProjectTaskStatus.Todo;

    // DateOnly : une échéance est un jour, pas un instant (pas de fuseau horaire à gérer).
    public DateOnly? DueDate { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}
