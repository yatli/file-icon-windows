Remove-Item *.png
Remove-Item ./artifacts/*.png
Move-Item *.ico ./artifacts/
$icons = Get-ChildItem ./artifacts
foreach($i in $icons){
    $j = $i.Name.Substring(5)
    $j = $j.Substring(0, $j.Length-8) + ".ico"
    #echo "./artifacts/$($i.Name) --> ./artifacts/$j"
    Move-Item ./artifacts/$($i.Name) ./artifacts/$j
}
