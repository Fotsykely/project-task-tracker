using System.Text.Json.Serialization;

namespace TaskTracker.Api.Entities;

// In JSON, the status travels as text ("InProgress") rather than a number,
// both in request/response bodies and in the OpenAPI documentation.
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectTaskStatus
{
    Todo,
    InProgress,
    Done,
}
