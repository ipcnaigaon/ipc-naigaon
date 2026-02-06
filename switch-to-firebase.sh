#!/bin/bash

# Script to switch from mock services to Firebase services
# Usage: ./switch-to-firebase.sh

echo "======================================="
echo "Switching to Firebase Services"
echo "======================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Find all files that import services
echo "Finding files with service imports..."

# Create backup directory
mkdir -p .backup-$(date +%Y%m%d-%H%M%S)

# Function to update imports
update_imports() {
    local file=$1
    local service=$2
    
    if grep -q "from.*services/${service}'" "$file" || grep -q "from.*services/${service}\"" "$file"; then
        echo "  Updating: $file"
        # Backup original file
        cp "$file" ".backup-$(date +%Y%m%d-%H%M%S)/"
        
        # Update the import
        sed -i.bak "s|from '\(.*\)/services/${service}'|from '\1/services/${service}.firebase'|g" "$file"
        sed -i.bak "s|from \"\(.*\)/services/${service}\"|from \"\1/services/${service}.firebase\"|g" "$file"
        
        # Remove backup file created by sed
        rm -f "${file}.bak"
    fi
}

# Services to update
services=("memberService" "eventService" "donationService" "notificationService" "authService")

# Update all JavaScript/JSX files
echo ""
echo "Updating service imports..."
for service in "${services[@]}"; do
    echo ""
    echo "Processing $service..."
    
    # Find all JS/JSX files in src directory
    find src -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
        update_imports "$file" "$service"
    done
done

echo ""
echo "======================================="
echo "Migration Complete!"
echo "======================================="
echo ""
echo "Next steps:"
echo "1. Configure your .env file with Firebase credentials"
echo "2. Run: node src/scripts/migrateToFirebase.js"
echo "3. Start your app: npm start"
echo ""
echo "Note: Original files backed up in .backup-* directory"
echo ""
