@del .\output\*.gadget
@del /S *.*~
"C:\Program Files\7-Zip\7z.exe" a -r .\output\magic-simple-widget.zip * -x!.git -x!*.iml -x!*.ipr -x!*.iws -x!out
@cd .\output
@rename *.zip *.gadget
@magic-simple-widget.gadget
@cd ..
