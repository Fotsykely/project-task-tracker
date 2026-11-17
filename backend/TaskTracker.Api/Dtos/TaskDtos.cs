using System.ComponentModel.DataAnnotations;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Dtos;

// Corps des requêtes POST et PUT d'une tâche.
public class TaskRequestDto
{
    private string? _title;

    [Required(ErrorMessage = "Le titre est obligatoire.")]
    [StringLength(ProjectTask.TitleMaxLength, ErrorMessage = "Le titre ne peut pas dépasser {1} caractères.")]
    public string? Title
    {
        get => _title;
        set => _title = value?.Trim();
    }

    // Envoyé en texte : "Todo", "InProgress" ou "Done". Sans valeur, une nouvelle tâche est "Todo".
    [EnumDataType(typeof(ProjectTaskStatus), ErrorMessage = "Le statut est invalide.")]
    public ProjectTaskStatus Status { get; set; } = ProjectTaskStatus.Todo;

    // Facultative, au format "2026-12-31".
    public DateOnly? DueDate { get; set; }
}

public record TaskDto(int Id, string Title, ProjectTaskStatus Status, DateOnly? DueDate, int ProjectId);
