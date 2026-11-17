using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.Dtos;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController(AppDbContext db) : ControllerBase
{
    // Page d'accueil : le nombre de tâches est calculé par la base dans la même requête SQL.
    [HttpGet]
    public async Task<ActionResult<List<ProjectSummaryDto>>> GetAll(CancellationToken cancellationToken)
    {
        return await db.Projects
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id)
            .Select(p => new ProjectSummaryDto(p.Id, p.Name, p.Description, p.CreatedAt, p.Tasks.Count))
            .ToListAsync(cancellationToken);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var project = await db.Projects.FindAsync([id], cancellationToken);
        return project is null ? NotFound() : ToDto(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create(ProjectRequestDto request, CancellationToken cancellationToken)
    {
        var project = new Project { Name = request.Name!, Description = request.Description };
        db.Projects.Add(project);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = project.Id }, ToDto(project));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProjectDto>> Update(int id, ProjectRequestDto request, CancellationToken cancellationToken)
    {
        var project = await db.Projects.FindAsync([id], cancellationToken);
        if (project is null)
            return NotFound();

        project.Name = request.Name!;
        project.Description = request.Description;
        await db.SaveChangesAsync(cancellationToken);

        return ToDto(project);
    }

    // Les tâches du projet sont supprimées par la base (clé étrangère en cascade).
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deletedRows = await db.Projects.Where(p => p.Id == id).ExecuteDeleteAsync(cancellationToken);
        return deletedRows == 0 ? NotFound() : NoContent();
    }

    private static ProjectDto ToDto(Project project) =>
        new(project.Id, project.Name, project.Description, project.CreatedAt);
}
