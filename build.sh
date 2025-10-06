#!/bin/bash
set -e

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        PLATFORM="linux/amd64"
        ;;
    aarch64|arm64)
        PLATFORM="linux/arm64"
        ;;
    armv7l)
        PLATFORM="linux/arm/v7"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

echo "Building for platform: $PLATFORM"

# Build with specific platform using buildx
docker buildx build --platform $PLATFORM -t stockpilot:latest .

echo "Build completed successfully!"
echo "To run: docker run -p 3000:3000 stockpilot:latest"
