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

function GetOutdatedPackages() {
    $OutdatedPackages = ((yarn outdated --json)[1] | ConvertFrom-Json).data.body;
    return  $OutdatedPackages | Group-Object { $_[[Keys]::Package] } | ForEach-Object {
        $Fields = $_.Group[0];
        $Name = $Fields[[Keys]::Package];
        $Current = $Fields[[Keys]::Current];
        $Wanted = $Fields[[Keys]::Wanted];
        $Latest = $Fields[[Keys]::Latest];
        return @{
            Name    = $Name;
            Current = $Current;
            Wanted  = $Wanted;
            Latest  = $Latest;
        }
    } | Where-Object { 
        # Ignore packages that can't be resolved from npm.
        return $_.Wanted -ne "exotic";
    }
}

function FormatVersion ($Package, $Version, $Current = "", $ShowColor = $false) {
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

function CreateTable($packages) {
    $result = @(
        "| Package | From | To | Workspace |",
        "|---|---|---|---|"
    );
    foreach ($package in $packages) {
        $Package = "[$($package.Name)](https://www.npmjs.com/package/$($package.Name))";
        $FromItem = $package.Current;

        $result += "| $($Package) | $($package.Current) | $($package.Wanted) | $($package.Latest) |";


        $ToItem = @($Wanted, $Latest) | 
        Get-Unique | 
        ForEach-Object { VersionTableItem -Package $Package -Version $_ -Current $Current -ShowColor $true } | 
        Join-String -Separator '<br>';

        $WorkspacesItem = WorkspacesMarkdown -Packages $PackageVersions -Separator '<br>'

        $UpdatesTable += "| $($PackageItem) | $($FromItem) | $($ToItem) | $($WorkspacesItem) |";
    }

    return $result | Out-String;
}

$packages = GetOutdatedPackages;
$table = CreateTable $packages


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



Set-Content .\update-detector\updates.md $Content
