Enum Keys {
    Package;
    Current;
    Wanted;
    Latest;
    Workspace;
    PackageType;
    URL;
}


function GetVersionColorLegend($From, $To) {
    $fromMayor, $fromMinor, $fromPatch = $From.Split("."); 
    $toMayor, $toMinor, $toPatch = $To.Split("."); 
    
    if ($fromMayor -ne $toMayor) {
        return "🟥";
    }
    if ($fromMinor -ne $toMinor) {
        return "🟨";
    }
    if ($fromPatch -ne $toPatch) {
        return "🟩";
    }
    return "";
}

function GetNpmPackageInfo($Name, $Version) {
    $content = Invoke-RestMethod -Uri "https://registry.npmjs.org/$($Name)/$($Version)";
    return $content;
}

function WorkspacesMarkdown($Packages, $Separator) {
    return $Packages | ForEach-Object {
        $Workspace = $_[[Keys]::Workspace];
        if (!$Workspace) {
            return "[botbuilder-js](https://github.com/microsoft/botbuilder-js/blob/main/package.json)"
        }
        $Location = $WorkspacesInfo."$($Workspace)".location ? "$($WorkspacesInfo."$($Workspace)".location)/package.json": "package.json"
        return "[$($Workspace)](https://github.com/microsoft/botbuilder-js/blob/main/$($Location))"
    } | Join-String -Separator $Separator
}

function CleanupVersions($Versions) {
    if (!$Versions) {
        return "";
    }

    $result = $Versions.Split("||") | ForEach-Object {
        $result = $_.Trim();
        $major, $minor, $patch = $result.Split(".");
        if ($patch -ne "0") {
            return $result;
        }
        $result = $result.Replace(".$($patch)", "");
        if ($minor -ne "0") {
            return $result;
        }
        $result = $result.Replace(".$($minor)", "");

        return $result
    } | Join-String -Separator "\|"
    return " ``node($($result))``"
}


function ConsolidateTableItem($PackageVersions) {
    # Group packages by version and sort by number and suffix. 
    $GroupByCurrentVersion = @($PackageVersions | Group-Object { $_[[Keys]::Current] } | Sort-Object { ($_.Name -replace '-.+$') -as [version] }, { $_ });

    if ($GroupByCurrentVersion.Count -le 1) {
        return "";
    }

    $PackageItem = PackageItem -Package $PackageVersions[0][[Keys]::Package];

    $From = $GroupByCurrentVersion | ForEach-Object {
        $WorkspacesMarkdown = WorkspacesMarkdown -Packages $_.Group -Separator ', '
        return "``$($_.Name)`` $($WorkspacesMarkdown)"
    } | Join-String -Separator '<br>';

    $LowestCurrentVersion = $GroupByCurrentVersion[0].Name
    $HighestCurrentVersion = $GroupByCurrentVersion[-1].Name
    $Color = GetVersionColorLegend -From $LowestCurrentVersion -To $HighestCurrentVersion;
    $ToConsolidate = "$($Color) ``$($HighestCurrentVersion)``"

    return "| $($PackageItem) | $($From) | $($ToConsolidate) |";
}

function VersionTableItem ($Package, $Version, $Current = "", $ShowColor = $false) {
    if ($Current -eq $Version) {
        return "";
    }

    $Color = "";
    if ($ShowColor -eq $true) {
        $Color = (GetVersionColorLegend -From $Current -To $Version) + " ";
    }
    $PackageInfo = GetNpmPackageInfo -Name $Package -Version $Version;
    $NodeSupportedVersions = CleanupVersions -Versions $PackageInfo.engines.node;
    return "$($Color)``$($Version)``$($NodeSupportedVersions)"
}

function PackageItem ($Package) {
    return "[$($Package)](https://www.npmjs.com/package/$($Package))";
}

# Main functionality

$OutdatedPackages = ((yarn outdated --json)[1] | ConvertFrom-Json).data.body;
$WorkspacesInfo = (yarn workspaces --json info | ConvertFrom-Json).data | ConvertFrom-Json

$ConsolidateTable = @();
$UpdatesTable = @();
$OutdatedPackages | Group-Object { $_[[Keys]::Package] } | ForEach-Object {
    $Fields = $_.Group[0];
    $Package = $Fields[[Keys]::Package];
    $Current = $Fields[[Keys]::Current];
    $Wanted = $Fields[[Keys]::Wanted];
    $Latest = $Fields[[Keys]::Latest];
    $PackageVersions = $_.Group;

    if ($Wanted -eq "exotic") {
        # Ignore packages that can't be resolved from npm.
        return;
    }

    $PackageItem = PackageItem -Package $Package;

    $ConsolidateTableItem = ConsolidateTableItem -PackageVersions $PackageVersions
    if ($ConsolidateTableItem) {
        $ConsolidateTable += $ConsolidateTableItem
    }

    $FromItem = VersionTableItem -Package $Package -Version $Current

    $ToItem = @($Wanted, $Latest) | 
    Get-Unique | 
    ForEach-Object { VersionTableItem -Package $Package -Version $_ -Current $Current -ShowColor $true } | 
    Join-String -Separator '<br>';

    $WorkspacesItem = WorkspacesMarkdown -Packages $PackageVersions -Separator '<br>'

    $UpdatesTable += "| $($PackageItem) | $($FromItem) | $($ToItem) | $($WorkspacesItem) |";
}

# TODO: generate a hash based on generated string, to later use to compare from issue to update. the hash will be saved as comment in the issue.
# TODO: parallel

function CreateHash($Content) {
    return new-object System.Security.Cryptography.SHA256Managed | 
    ForEach-Object { $_.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Content)) } | 
    ForEach-Object { $_.ToString("x2") } |
    Join-String -Separator ""
}

$Content = "
> [!IMPORTANT]  
> This issue was generated from '[Pipeline Name]' pipeline. Any changes made will be lost if a new package update requirement is detected.

## Notes
🟥: Major Update backward-incompatible updates
🟨: Minor Update backward-compatible features
🟩: Patch Update backward-compatible bug fixes

## Consolidate
| Package | From | To |
|---|---|---|
$(($ConsolidateTable | Out-String))

## Updates
| Package | From | To | Workspace |
|---|---|---|---|
$($UpdatesTable | Out-String)
"

$Hash = CreateHash -Content $Content

$Content = "
<!-- hash:$($Hash) -->

$($Content)
"

# $Issue = gh issue list --state "open" --search "hash$($Hash)" --limit 1 --json
# if($Issue){
#     gh issue edit $Issue.Number --body $Content;
# } else {
#     gh issue create --title "Update dependencies" --body $Content
# }



Set-Content .\update-detector\test.md $Content


# For Minor Mayor Patch use emotes https://github.com/github/markup/issues/1440#issuecomment-1739304044

# package > version a actualizar > donde actualizarlo


# el reporte puede ser un issue con toda la lista


# https://registry.npmjs.org/@azure/core-auth/1.7.2



# (">=18.0.0 || 10.0.0 || 12.0.0".Split("||") | ForEach-Object { "``node$($_.Trim())``" }) -join "<br>"
# "``node(" + ((">=18.0.0 || 10.0.0 || 12.0.1".Split("||") | ForEach-Object {
#             $result = $_.Trim();
#             $major, $minor, $patch = $result.Split(".");
#             if ($patch -ne "0") {
#                 return $result;
#             }
#             $result = $result.Replace(".$($patch)", "");
#             if ($minor -ne "0") {
#                 return $result;
#             }
#             $result = $result.Replace(".$($minor)", "");

#             return $result
#         }) -join "|") + ")``"
# # ">=18.0.0" -replace "``","|"



# $GroupByCurrentVersion = @($_.Group | Group-Object { $_[[Keys]::Current] } | Sort-Object { ($_.Name -replace '-.+$') -as [version] }, { $_ });
# if ($GroupByCurrentVersion.Count -gt 1) {
#     $FromConsolidate = $GroupByCurrentVersion | ForEach-Object {
#         $workspaces = @($_.Group | ForEach-Object { $_[[Keys]::Workspace] });
#         $Workspace = $workspaces | ForEach-Object {
#             if (!$_) {
#                 return "[package.json](https://github.com/microsoft/botbuilder-js/blob/main/package.json)"
#             }
#             return "[$($_)](https://github.com/microsoft/botbuilder-js/blob/main/$($WorkspacesInfo."$($_)".location)/package.json)"
#         } | Join-String -Separator ', '
#         return "``$($_.Name)`` $($Workspace)"
#     } | Join-String -Separator '<br>';
#     $LowestCurrentVersion = $GroupByCurrentVersion[0].Name
#     $HighestCurrentVersion = $GroupByCurrentVersion[-1].Name
#     $Color = GetVersionColorLegend -From $LowestCurrentVersion -To $HighestCurrentVersion;
#     $ToConsolidate = "$($Color) ``$($HighestCurrentVersion)``"
#     # $HighestCurrentVersion = $_.Group | Select-Object @{ n = "v"; e = { $_[[Keys]::Current] } } | Sort-Object -Property "v" -Descending -Top 1
#     # $HighestWantedVersion = $_.Group | Select-Object @{ n = "v"; e = { $_[[Keys]::Wanted] } } | Sort-Object -Property "v" -Descending -Top 1
#     # $HighestLatestVersion = $_.Group | Select-Object @{ n = "v"; e = { $_[[Keys]::Latest] } } | Sort-Object -Property "v" -Descending -Top 1
#     # $ToConsolidate = @($HighestCurrentVersion.v, $HighestWantedVersion.v, $HighestLatestVersion.v) | Get-Unique | ForEach-Object {
#     #     if ($LowestCurrentVersion -eq $_) {
#     #         # Ignore version.
#     #         return;
#     #     }

#     #     $Color = GetVersionColorLegend -From $LowestCurrentVersion -To $_;
#     #     $PackageInfo = $_ -eq $LowestCurrentVersion ? $PackageInfo : (GetNpmPackageInfo -Name $fields[[Keys]::Package] -Version $_);
#     #     # $NodeSupportedVersions = $PackageInfo.engines.node ? (" ``node$($PackageInfo.engines.node)``".Replace("|","\|")) : "";
#     #     $NodeSupportedVersions = $PackageInfo.engines.node ? ($PackageInfo.engines.node.Split("||") | ForEach-Object { " ``node$($_.Trim())``" }) -join "<br>" : "";
#     #     return "$($Color) ``$($_)``$($NodeSupportedVersions)"
#     # } | Join-String -Separator '<br>';

#     $consolidate += "| $($Package) | $($FromConsolidate) | $($ToConsolidate) |";
# }
