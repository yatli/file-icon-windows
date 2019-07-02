Remove-Item *.png
Remove-Item ./artifacts/*
Move-Item *.ico ./artifacts/
$icons = Get-ChildItem ./artifacts
foreach($i in $icons){
    $j = $i.Name
    $j = $j.Substring(0, $j.Length-8) + ".ico"
    Write-Output "./artifacts/$($i.Name) --> ./artifacts/$j"
    Move-Item ./artifacts/$($i.Name) ./artifacts/$j
}

Copy-Item .\artifacts\.hpp.ico .\artifacts\.hh.ico
Copy-Item .\artifacts\.txt.ico .\artifacts\.log.ico
