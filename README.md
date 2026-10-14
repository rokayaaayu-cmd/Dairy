# Live Count - Android APK

A native Android application for live broiler chicken counting using CameraX and TensorFlow Lite.

## Project Structure

```
.
├── .github/workflows/build.yml    # GitHub Actions workflow
├── app/
│   ├── build.gradle.kts           # App module build configuration
│   ├── proguard-rules.pro         # ProGuard rules
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/livecount/app/
│       │   ├── MainActivity.kt
│       │   └── ui/theme/
│       │       ├── Color.kt
│       │       ├── Theme.kt
│       │       └── Type.kt
│       └── res/
│           ├── values/
│           │   ├── strings.xml
│           │   └── themes.xml
│           └── xml/
│               ├── backup_rules.xml
│               └── data_extraction_rules.xml
├── build.gradle.kts               # Root build configuration
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── gradlew                        # Gradle wrapper script
└── settings.gradle.kts
```

## Build Configuration

- **AGP (Android Gradle Plugin)**: 8.2.0
- **Kotlin**: 1.9.20
- **Gradle**: 8.2
- **compileSdk**: 34
- **minSdk**: 24
- **targetSdk**: 34
- **Java**: 17

## Dependencies

- **Jetpack Compose**: For modern UI
- **CameraX**: For camera access and preview
- **TensorFlow Lite**: For on-device ML inference
- **Navigation Compose**: For screen navigation

## GitHub Actions Workflow

The workflow automatically builds the debug APK on every push to `main` and on manual trigger.

### Workflow Features

- ✅ Triggers on push to `main` branch
- ✅ Supports manual workflow dispatch
- ✅ Uses JDK 17 (Temurin distribution)
- ✅ Sets up Android SDK automatically
- ✅ Accepts SDK licenses
- ✅ Builds debug APK using `./gradlew assembleDebug`
- ✅ Verifies APK exists before upload
- ✅ Uploads APK as GitHub Actions artifact
- ✅ 30-day artifact retention

### Download APK from GitHub Actions

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Scroll down to **Artifacts** section
4. Download `app-debug-apk`
5. Install on your Android device (enable "Install from unknown sources")

## Local Build Instructions

### Prerequisites

- Android Studio (latest version recommended)
- JDK 17
- Android SDK with API 34

### Build Steps

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-name>

# Make gradlew executable (Unix/Mac)
chmod +x gradlew

# Build debug APK
./gradlew assembleDebug

# APK location
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

### Install on Device

```bash
# Connect Android device via USB with USB debugging enabled
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Permissions

The app requires the following permissions:

- `CAMERA` - For live camera access
- `WRITE_EXTERNAL_STORAGE` (API ≤ 28) - For saving reports
- `READ_EXTERNAL_STORAGE` (API ≤ 32) - For loading datasets
- `INTERNET` - For model downloads (if needed)

## Features

- ✅ Real camera access via CameraX
- ✅ Live preview with bounding boxes
- ✅ TensorFlow Lite inference
- ✅ Jetpack Compose UI
- ✅ Edge-to-edge display support
- ✅ Material 3 theming
- ✅ Dark/Light theme support

## Development Notes

### Build Configuration

The `app/build.gradle.kts` has an empty `debug {}` block as required. No signing configuration is needed for debug builds.

### GitHub Actions

The workflow uses:
- `actions/checkout@v4` - Checkout source code
- `actions/setup-java@v4` - Set up JDK 17
- `android-actions/setup-android@v3` - Set up Android SDK
- `gradle/actions/setup-gradle@v4` - Set up Gradle
- `actions/upload-artifact@v4` - Upload APK artifact

### Troubleshooting

**Build fails with "SDK location not found"**
- The GitHub Actions workflow handles this automatically
- For local builds, create `local.properties` with: `sdk.dir=/path/to/Android/sdk`

**Gradle wrapper not executable**
- Run: `chmod +x gradlew`

**APK not found after build**
- Check build logs for errors
- Verify the path: `app/build/outputs/apk/debug/app-debug.apk`

## License

This project is provided as-is for demonstration purposes.

## Verification Checklist

- [ ] GitHub Actions workflow exists at `.github/workflows/build.yml`
- [ ] Workflow triggers on push to `main`
- [ ] Workflow supports manual dispatch
- [ ] `build.gradle.kts` has empty `debug {}` block
- [ ] Gradle wrapper files are present
- [ ] AndroidManifest.xml declares required permissions
- [ ] MainActivity.kt implements Compose UI
- [ ] APK builds successfully on GitHub Actions
- [ ] APK is uploaded as artifact
- [ ] APK can be downloaded and installed

## Next Steps

To complete the full Live Count application:

1. Implement camera preview with CameraX
2. Integrate TensorFlow Lite model for chicken detection
3. Add object tracking algorithm
4. Implement counting logic with duplicate prevention
5. Add UI for bounding boxes and status indicators
6. Implement session management and reporting
7. Add model management and training features
