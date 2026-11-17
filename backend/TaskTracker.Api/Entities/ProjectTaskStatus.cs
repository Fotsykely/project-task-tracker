using System.Text.Json.Serialization;

namespace TaskTracker.Api.Entities;

// En JSON, le statut circule en texte ("InProgress") et non en nombre,
// aussi bien dans les requêtes que dans la documentation OpenAPI.
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectTaskStatus
{
    Todo,
    InProgress,
    Done,
}
