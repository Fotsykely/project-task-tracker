using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.Dtos;
using TaskTracker.Api.Entities;

namespace TaskTracker.Api.Controllers;

// Listing and creating go through the project (/api/projects/{id}/tasks);
// reading, updating and deleting a task go through its own id (/api/tasks/{id}).
[ApiController]
[Route("api")]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet("projects/{projectId:int}/tasks")]
    public async Task<ActionResult<List<TaskDto>>> GetByProject(int projectId, CancellationToken cancellationToken)
    {
        if (!await ProjectExists(projectId, cancellationToken))
            return NotFound();

        var tasks = await db.Tasks
            .Where(t => t.ProjectId == projectId)
            .OrderBy(t => t.Id)
            .ToListAsync(cancellationToken);

        return tasks.ConvertAll(ToDto);
    }

    [HttpPost("projects/{projectId:int}/tasks")]
    public async Task<ActionResult<TaskDto>> Create(int projectId, TaskRequestDto request, CancellationToken cancellationToken)
    {
        if (!await ProjectExists(projectId, cancellationToken))
            return NotFound();

        var task = new ProjectTask
        {
            Title = request.Title!,
            Status = request.Status,
            DueDate = request.DueDate,
            ProjectId = projectId,
        };
        db.Tasks.Add(task);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, ToDto(task));
    }

    [HttpGet("tasks/{id:int}")]
    public async Task<ActionResult<TaskDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.FindAsync([id], cancellationToken);
        return task is null ? NotFound() : ToDto(task);
    }

    [HttpPut("tasks/{id:int}")]
    public async Task<ActionResult<TaskDto>> Update(int id, TaskRequestDto request, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.FindAsync([id], cancellationToken);
        if (task is null)
            return NotFound();

        task.Title = request.Title!;
        task.Status = request.Status;
        task.DueDate = request.DueDate;
        await db.SaveChangesAsync(cancellationToken);

        return ToDto(task);
    }

    [HttpDelete("tasks/{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deletedRows = await db.Tasks.Where(t => t.Id == id).ExecuteDeleteAsync(cancellationToken);
        return deletedRows == 0 ? NotFound() : NoContent();
    }

    private Task<bool> ProjectExists(int projectId, CancellationToken cancellationToken) =>
        db.Projects.AnyAsync(p => p.Id == projectId, cancellationToken);

    private static TaskDto ToDto(ProjectTask task) =>
        new(task.Id, task.Title, task.Status, task.DueDate, task.ProjectId);
}
