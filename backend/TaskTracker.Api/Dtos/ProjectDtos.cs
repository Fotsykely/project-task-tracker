using System.ComponentModel.DataAnnotations;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Dtos;

// Corps des requêtes POST et PUT. Les attributs de validation sont lus automatiquement
// par [ApiController] : une saisie invalide renvoie un 400 avec les messages par champ.
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
        set => _name = value?.Trim(); // " ab " compte pour 2 caractères, pas 4
    }

    [StringLength(Project.DescriptionMaxLength,
        ErrorMessage = "La description ne peut pas dépasser {1} caractères.")]
    public string? Description
    {
        get => _description;
        set => _description = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}

// Réponse pour la page d'accueil : un projet et son nombre de tâches.
public record ProjectSummaryDto(int Id, string Name, string? Description, DateTime CreatedAt, int TaskCount);

// Réponse pour un seul projet.
public record ProjectDto(int Id, string Name, string? Description, DateTime CreatedAt);
