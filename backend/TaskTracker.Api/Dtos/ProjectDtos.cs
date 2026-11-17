using System.ComponentModel.DataAnnotations;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Dtos;

// Request body for POST and PUT. The validation attributes are picked up automatically
// by [ApiController]: invalid input returns a 400 with one message list per field.
public class ProjectRequestDto
{
    private string? _name;
    private string? _description;

    [Required(ErrorMessage = "Le nom est obligatoire.")]
    [StringLength(Project.NameMaxLength, MinimumLength = Project.NameMinLength,
        ErrorMessage = "Le nom doit contenir entre {2} et {1} caractères.")]
    public string? Name
    {
        get => _name;
        set => _name = value?.Trim(); // " ab " counts as 2 characters, not 4
    }

    [StringLength(Project.DescriptionMaxLength,
        ErrorMessage = "La description ne peut pas dépasser {1} caractères.")]
    public string? Description
    {
        get => _description;
        set => _description = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}

// Response for the home page: a project and its number of tasks.
public record ProjectSummaryDto(int Id, string Name, string? Description, DateTime CreatedAt, int TaskCount);

// Response for a single project.
public record ProjectDto(int Id, string Name, string? Description, DateTime CreatedAt);
