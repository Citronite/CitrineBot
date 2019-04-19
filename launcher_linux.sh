# At the moment, this file will simply start the launcher.
# But eventually, it will also check if the correct version
# of nodejs is installed.

clear
echo -ne "\033]0;Citrine Launcher\007"
echo Starting launcher...
node ./launcher/main.js
read -n1 -r -p "Press any key to continue..."
