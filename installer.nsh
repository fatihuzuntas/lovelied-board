; Lovelied Board NSIS Installer Script
; Windows Runtime Dependencies Kontrol ve Kurulum

!macro customInit
  ; Visual C++ Redistributable kontrolü
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Version"
  ${If} $0 == ""
    MessageBox MB_YESNO "Lovelied Board'un çalışması için Microsoft Visual C++ 2015-2022 Redistributable gerekli.$\n$\nOtomatik olarak indirilip kurulsun mu?" IDYES InstallVC
    Goto SkipVC
    InstallVC:
      DetailPrint "Visual C++ Redistributable indiriliyor..."
      ; VC++ Redistributable yüklü değilse kullanıcıya bilgi ver
      MessageBox MB_OK "Kurulum tamamlandıktan sonra, lütfen şu adresten Visual C++ Redistributable'ı indirin ve kurun:$\n$\nhttps://aka.ms/vs/17/release/vc_redist.x64.exe"
    SkipVC:
  ${EndIf}
!macroend

!macro customInstall
  ; Masaüstü kısayolu için özel ayarlar
  CreateShortCut "$DESKTOP\Lovelied Board.lnk" "$INSTDIR\${APP_FILENAME}.exe" "" "$INSTDIR\${APP_FILENAME}.exe" 0 SW_SHOWNORMAL "" "Modern Dijital Okul Panosu Sistemi"
  
  ; Başlat menüsü kısayolu
  CreateDirectory "$SMPROGRAMS\Lovelied Board"
  CreateShortCut "$SMPROGRAMS\Lovelied Board\Lovelied Board.lnk" "$INSTDIR\${APP_FILENAME}.exe" "" "$INSTDIR\${APP_FILENAME}.exe" 0 SW_SHOWNORMAL "" "Modern Dijital Okul Panosu Sistemi"
  CreateShortCut "$SMPROGRAMS\Lovelied Board\Kaldır.lnk" "$INSTDIR\Uninstall ${APP_FILENAME}.exe"
  
  ; Kurulum başarılı mesajı
  DetailPrint "Lovelied Board başarıyla kuruldu!"
!macroend

!macro customUnInstall
  ; Masaüstü kısayolunu kaldır
  Delete "$DESKTOP\Lovelied Board.lnk"
  
  ; Başlat menüsü kısayollarını kaldır
  RMDir /r "$SMPROGRAMS\Lovelied Board"
  
  ; Kullanıcı verilerini korumak için app data'yı silme
  ; RMDir /r "$APPDATA\lovelied-board"
!macroend

