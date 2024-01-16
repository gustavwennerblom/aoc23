#! /bin/bash
# prompt for day number
echo "Name solution folder (e.g. dec-1)"
read -r folder_name
# create folder
mkdir "./scripts/$folder_name"
# init source files
cp "./scripts/_template/dec-x-boilerplate.ts" "./scripts/$folder_name/solve.ts"
touch "./scripts/$folder_name/test.txt"
touch "./scripts/$folder_name/input.txt"

# rewrite start command
start_command="nodemon ./$folder_name/solve.ts"
jq --arg start_command "$start_command" '.scripts.start = $start_command' ./scripts/package.json >./scripts/package.json.temp
mv ./scripts/package.json.temp ./scripts/package.json

# confirm actions
echo "Created folder: $folder_name with boilerplate files"
