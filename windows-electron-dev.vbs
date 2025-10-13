Set objShell = CreateObject("WScript.Shell")
Set objExec = objShell.Exec("cmd /c \"" & Replace(WScript.ScriptFullName, ".vbs", ".bat") & "\"")
Do While objExec.Status = 0
  WScript.Sleep 100
Loop


