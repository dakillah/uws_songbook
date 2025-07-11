#!/bin/bash

# Set the directory and output file paths
directory="songs"
output_html="songlist.html"

# Clear the output files if they exist
> "$output_html"

# Write the header to the HTML file
echo "<html><body><h1>Song List</h1><ul>" > "$output_html"


# Loop through the files in the directory
for file in "$directory"/*; do
    # Check if it's a file (not a directory)
    if [ -f "$file" ]; then
        # Extract the filename without the extension
        filename=$(basename "$file")
        filename_without_extension="${filename%.*}"
                
        # Write an HTML <li> tag with just the filename without the file extension
        echo "<li>$filename_without_extension</li>" >> "$output_html"
        
    fi
done

# Close the HTML tags
echo "</ul></body></html>" >> "$output_html"

echo "File listing completed."
