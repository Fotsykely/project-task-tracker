namespace TaskTracker.Api.Entities;

// Named ProjectTask rather than Task to avoid a clash with System.Threading.Tasks.Task.
public class ProjectTask
{
    public const int TitleMaxLength = 200;

    public int Id { get; set; }
    public required string Title { get; set; }
    public ProjectTaskStatus Status { get; set; } = ProjectTaskStatus.Todo;
    public ProjectTaskPriority Priority { get; set; } = ProjectTaskPriority.Normal;

    // DateOnly: a due date is a day, not an instant (no time zone to deal with).
    public DateOnly? DueDate { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}
