#!/bin/bash

# Frontend Setup Script for MIS Web Backend
echo "🚀 Setting up frontend for MIS Web Backend..."

# Get the parent directory (where both backend and frontend will be)
PARENT_DIR=$(dirname "$(pwd)")
FRONTEND_DIR="$PARENT_DIR/mis-frontend"

echo "📁 Backend location: $(pwd)"
echo "📁 Frontend will be created at: $FRONTEND_DIR"

# Ask user for frontend framework
echo ""
echo "Choose your frontend framework:"
echo "1) React (Recommended)"
echo "2) Angular"
echo "3) Vue.js"
echo "4) Skip frontend creation"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "📦 Creating React frontend..."
        cd "$PARENT_DIR"
        npx create-react-app mis-frontend --yes
        cd mis-frontend
        npm install axios
        echo "✅ React frontend created successfully!"
        echo "📝 Next steps:"
        echo "   cd $FRONTEND_DIR"
        echo "   npm start"
        ;;
    2)
        echo "📦 Creating Angular frontend..."
        cd "$PARENT_DIR"
        npx @angular/cli@latest new mis-frontend --routing --style=css --skip-git --yes
        cd mis-frontend
        echo "✅ Angular frontend created successfully!"
        echo "📝 Next steps:"
        echo "   cd $FRONTEND_DIR"
        echo "   ng serve"
        ;;
    3)
        echo "📦 Creating Vue.js frontend..."
        cd "$PARENT_DIR"
        npm create vue@latest mis-frontend --yes
        cd mis-frontend
        npm install
        echo "✅ Vue.js frontend created successfully!"
        echo "📝 Next steps:"
        echo "   cd $FRONTEND_DIR"
        echo "   npm run dev"
        ;;
    4)
        echo "⏭️  Skipping frontend creation."
        echo "📝 You can create your frontend manually in a separate folder."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Backend is ready at: http://localhost:8080"
echo "📚 Check FRONTEND_INTEGRATION.md for detailed setup instructions"
echo "🧪 Test the API: curl http://localhost:8080/api/courses" 