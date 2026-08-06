$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    
    $filePath = Join-Path "C:\Users\Hari Sai Ganesh\.gemini\antigravity\scratch\lr-agrosense" $localPath.TrimStart('/')
    if ((Test-Path $filePath) -and (Get-Item $filePath).PSIsContainer) {
        $filePath = Join-Path $filePath "index.html"
    }
    
    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        if ($ext -eq ".html") { $response.ContentType = "text/html" }
        elseif ($ext -eq ".css") { $response.ContentType = "text/css" }
        elseif ($ext -eq ".js") { $response.ContentType = "application/javascript" }
        elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $response.ContentType = "image/jpeg" }
        elseif ($ext -eq ".png") { $response.ContentType = "image/png" }
        elseif ($ext -eq ".xml") { $response.ContentType = "text/xml" }
        
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
