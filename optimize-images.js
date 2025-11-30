const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    // Create dist/images directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist', 'images');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    try {
        // Use dynamic imports for imagemin v8+ (ES modules)
        const imageminModule = await import('imagemin');
        const imagemin = imageminModule.default || imageminModule;
        
        const mozjpegModule = await import('imagemin-mozjpeg');
        // Handle both default export and named export
        const imageminMozjpeg = mozjpegModule.default || mozjpegModule;
        
        const pngquantModule = await import('imagemin-pngquant');
        // Handle both default export and named export
        const imageminPngquant = pngquantModule.default || pngquantModule;
        
        const files = await imagemin(['images/*.{jpg,jpeg,png}'], {
            destination: distDir,
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                }),
                imageminPngquant({
                    quality: [0.6, 0.8],
                    speed: 4
                })
            ]
        });

        console.log(`✅ Optimized ${files.length} images`);
        console.log(`📁 Output directory: ${distDir}`);
    } catch (error) {
        console.error('❌ Error optimizing images:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

optimizeImages();

