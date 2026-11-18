using System.ComponentModel.DataAnnotations;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Dtos;

// Fields shared by the POST and PUT bodies. Each endpoint has its own subclass, so that a rule
// which only applies to one of them (see DueDate) does not leak into the other.
public abstract class TaskRequestDto
{
    private string? _title;

    [Required(ErrorMessage = "Le titre est obligatoire.")]
    [StringLength(ProjectTask.TitleMaxLength, ErrorMessage = "Le titre ne peut pas dépasser {1} caractères.")]
    public string? Title
    {
        get => _title;
        set => _title = value?.Trim();
    }

    // Sent as text: "Todo", "InProgress" or "Done". Defaults to "Todo" when omitted.
    [EnumDataType(typeof(ProjectTaskStatus), ErrorMessage = "Le statut est invalide.")]
    public ProjectTaskStatus Status { get; set; } = ProjectTaskStatus.Todo;

    // Optional, formatted as "2026-12-31". Declared by each subclass because the rules differ.
    public abstract DateOnly? DueDate { get; set; }
}

// Request body for POST: a new task cannot be due in the past (today is accepted).
public class CreateTaskDto : TaskRequestDto
{
    [NotInThePast(ErrorMessage = "La date d'échéance ne peut pas être dans le passé.")]
    public override DateOnly? DueDate { get; set; }
}

// Request body for PUT: no date rule, so that an already overdue task can still be edited.
public class UpdateTaskDto : TaskRequestDto
{
    public override DateOnly? DueDate { get; set; }
}

// Rejects a date earlier than today. A missing value (null) is valid: the date is optional.
public sealed class NotInThePastAttribute : ValidationAttribute
{
    public override bool IsValid(object? value) =>
        value is not DateOnly date || date >= DateOnly.FromDateTime(DateTime.Today);
}

public record TaskDto(int Id, string Title, ProjectTaskStatus Status, DateOnly? DueDate, int ProjectId);
