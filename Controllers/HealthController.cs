using Microsoft.AspNetCore.Mvc;

namespace SignalRChat.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{

    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult HealthCheck()
    {
        _logger.LogInformation("Healthy");
        return Ok("Healthy");
    }
}
