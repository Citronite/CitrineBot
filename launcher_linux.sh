# At the moment, this file will simply start the launcher.
# But eventually, it will also check if node is on path

clear
echo -ne "\033]0;Citrine Launcher\007"
node "$(dirname $BASH_SOURCE)/launcher/main.js"
read -n1 -r -p "Press any key to continue..."
