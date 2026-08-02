Add-Type -AssemblyName System.Drawing

$srcDir = Join-Path $PSScriptRoot "images\gallery"
$thumbDir = Join-Path $srcDir "thumb"
$maxWidth = 400
$quality = 75

if (!(Test-Path $thumbDir)) {
    New-Item -ItemType Directory -Path $thumbDir -Force | Out-Null
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$quality
)

Get-ChildItem -Path $srcDir -Filter "*.jpg" -File | ForEach-Object {
    $thumbPath = Join-Path $thumbDir $_.Name

    # Skip tiny/placeholder files
    if ($_.Length -le 10) {
        Copy-Item $_.FullName $thumbPath -Force
        Write-Host "SKIP (tiny): $($_.Name)"
        return
    }

    try {
        $img = [System.Drawing.Image]::FromFile($_.FullName)
        
        if ($img.Width -le $maxWidth) {
            $newW = $img.Width
            $newH = $img.Height
        } else {
            $ratio = $maxWidth / $img.Width
            $newW = $maxWidth
            $newH = [int]($img.Height * $ratio)
        }

        $thumb = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($thumb)
        $g.InterpolationMode = 'HighQualityBicubic'
        $g.SmoothingMode = 'HighQuality'
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()

        $thumb.Save($thumbPath, $jpegCodec, $encoderParams)
        $thumb.Dispose()
        $img.Dispose()

        Write-Host "OK: $($_.Name) -> ${newW}x${newH}"
    } catch {
        Write-Host "ERROR: $($_.Name) - $($_.Exception.Message)"
    }
}

Write-Host "`nDONE - Thumbnails saved to: $thumbDir"
