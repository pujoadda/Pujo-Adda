# Kolkata Durga Puja Parikrama 2026 (Pujo Adda) - Expo React Native App

This application is powered by **Expo** and **React Native**, supporting **Expo Go**, **Android APK**, **iOS**, and **Web**.

---

## 📱 How to Run on Mobile via Expo Go (Instant Testing)

1. Install the **Expo Go** app on your phone:
   - 🤖 [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - 🍏 [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Connect your phone and computer to the **same Wi-Fi network**.
3. In your terminal (`e:\PujoAdda`), run:
   ```bash
   npx expo start
   ```
4. **Scan the QR Code**:
   - **Android**: Open **Expo Go** app $\rightarrow$ tap **"Scan QR code"**.
   - **iPhone**: Open camera app $\rightarrow$ scan the terminal QR code.

The full app will load instantly on your phone with native maps, touch gestures, turn-by-turn route navigation, and audio dhak beats!

---

## 📦 How to Build the Android APK using Expo EAS (Cloud Build)

You don't need local Gradle or Android Studio to generate an `.apk` when using Expo. Expo EAS builds the APK in the cloud for you:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Build Android APK:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
3. Expo will give you a direct download link for your **`app-debug.apk`**!

---

## 💻 How to Run Locally on Web / Metro Server

- Start Metro / Expo Web:
  ```bash
  npx expo start --web
  ```
- Or run local Vite dev server:
  ```bash
  npm run dev
  ```
  Access at `http://localhost:5173` or `http://192.168.1.101:5173`.

---

## ✨ Features Included
- **North, South & Middle Kolkata Durga Pujas**: 26+ iconic pandals (Bagbazar, Sovabazar, Ekdalia, Suruchi Sangha, Santosh Mitra Sq, etc.).
- **Interactive Google Maps Interface**: Custom region pins, satellite mode, dark map mode, user location pin.
- **Turn-by-Turn Route Navigation**: Distance in km, Metro route guidance, travel duration, and step-by-step instructions.
- **Festive Dhak Sound Ambiance**: Synthesized Web Audio API beat player.
