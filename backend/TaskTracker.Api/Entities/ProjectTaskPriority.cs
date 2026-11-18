using System.Text.Json.Serialization;

namespace TaskTracker.Api.Entities;

// Like the status, the priority travels as text ("High") in JSON.
// Keep Low, Normal, High in this order: it is also the natural order of importance.
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectTaskPriority
{
    Low,
    Normal,
    High,
}
