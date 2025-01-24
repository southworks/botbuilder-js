$json = gh issue list --search "in:body *id:outdated-packages*" --repo southworks/botbuilder-js --app github-actions --state closed --json id,number,body | ConvertFrom-Json

if($json.body -eq $null) {
    Write-Output "No issues found"
    exit 0
}

# $json.body

# $str = "

# asd

# <!--
#   id:outdated-packages
#   hash:123
# -->

#  issues remaining
# "

# $start = $str.IndexOf("<!--");
# $end = $str.IndexOf("-->") + 3;
# $header = $str.Substring($start, $end - $start)
# $hash = $header.Split("hash:")[1].Split("`n")[0].Trim();
