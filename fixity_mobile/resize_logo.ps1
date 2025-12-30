Add-Type -AssemblyName System.Drawing
$source = "d:\PROJECT - CRI\fixity_mobile\assets\images\logo.png"
$dest = "d:\PROJECT - CRI\fixity_mobile\logo_192.png"

if (Test-Path $source) {
    try {
        $img = [System.Drawing.Image]::FromFile($source)
        $canvas = New-Object System.Drawing.Bitmap(192, 192)
        $graph = [System.Drawing.Graphics]::FromImage($canvas)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, 192, 192)
        $canvas.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Success: Resized to $dest"
    } catch {
        Write-Host "Error: $_"
        exit 1
    } finally {
        if ($img) { $img.Dispose() }
        if ($canvas) { $canvas.Dispose() }
        if ($graph) { $graph.Dispose() }
    }
} else {
    Write-Host "Source file not found"
    exit 1
}
