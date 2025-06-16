<div align="center">
  <img src="./docs/icon-black.png" style="height: 100px" />
</div>

<p align="center">
    <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg"
         alt="GitHub last commit" />
    </a>
    <a href="https://github.com/ImNotDarren/CRCWeb/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/ImNotDarren/CRCWeb"
         alt="GitHub issues" />
    </a>
    <a href="./docs/VERSIONS.md">
      <img src="https://img.shields.io/static/v1?label=version&message=beta%200.0.1&color=blue" alt="version">
    </a>
</p>

> **CRCWeb** is a modern, responsive mobile framework designed to provide online multimedia educational content to users.

---

## 🚀 Table of Contents

- [🚀 Table of Contents](#-table-of-contents)
- [📖 About](#-about)
- [✨ Features](#-features)
- [🚅 Coming Soon](#-coming-soon)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [💻 Usage](#-usage)
- [🤖 Build Android](#-build-android)
    - [Create Android bundle (AAB)](#create-android-bundle-aab)
- [🧑‍💻 Build Web ](#-build-web-)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Reference](#-reference)
- [📬 Contact](#-contact)

---

## 📖 About

CRCWeb provides a **React Native** front-end for multimedia educational content distribution.

## ✨ Features

- **Multimedia Educational Content Rendering**: Each module contains Lectures, Content, Activities, Resources, and Quizzes.
- **Realtime Content Update**: Update any content using an Admin account anytime.
- **Fitbit Data Tracking**: Fitbit API Integrated to track each user's wearable data from Fitbit band.

## 🚅 Coming Soon

- Typescript support

## 🛠 Tech Stack

- **Frontend**: React Native
- **Backend**: Node.js, Express
- **Database**: SQLite

> [!NOTE]
> Backend will be open-source in the future. We're actively working on it.

## 🚀 Getting Started

Follow these steps to get CRCWeb up and running locally.

### Prerequisites

- Node version: `v18.18.2`

- NPM version: `10.2.0`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ImNotDarren/CRCWeb.git
   cd CRCWeb
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

Copy the example environment file and update the variables:

```bash
cp .env.example .env
# Edit .env with your preferred editor
```

Set the following variables:

- `SERVER_URL` - URL for your backend server
- `FITBIT_OAUTH_REDIRECT_URL`, `FITBIT_CLIENT_ID`, `FITBIT_CODE_VERIFIER` - Fitbit API keys
- `GITHUB_BUCKET` - For PDF rendering

---

## 💻 Usage

**Run the app**

```bash
npx expo run:ios --device
# or
npx expo run:android --device
```

## 🤖 Build Android

```bash
cd android
```

```bash
./gradlew assembleRelease
```

> [!NOTE]
> APK file: `android/app/build/outputs/apk/release/app-release.apk`

#### Create Android bundle (AAB)

```bash
npx react-native build-android --mode=release
```

> [!NOTE]
> AAB file: `android/app/build/outputs/bundle/release/app-release.aab`

## 🧑‍💻 Build Web [![Docs](https://img.shields.io/static/v1?label=Web&message=Expo%20Docs&color=blue&style=flat-square)](https://docs.expo.dev/distribution/publishing-websites/#creating-a-build)


Make sure netlify-cli is installed:

```bash
npm install -g netlify-cli
```

Then export web to `/dist` folder:

```bash
npx expo export -p web
```

You can serve locally to test it by running:

```bash
npx serve dist --single
```

Then, push to netlify and follow the commands in your terminal:

```bash
netlify deploy --dir dist
```

```bash
netlify deploy --prod
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`.
3. Make your changes and commit: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/YourFeatureName`.
5. Open a Pull Request describing your changes.

<!-- Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines. -->

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🔗 Reference

Please reference these papers [[1]](https://cancer.jmir.org/2025/1/e68516/) [[2]](https://cancer.jmir.org/2025/1/e67914) if you used this tool in your research:

```
Liu D, Lin Y, Yan R, Wang Z, Bold D, Hu X
Leveraging Artificial Intelligence for Digital Symptom Management in Oncology: The Development of CRCWeb
JMIR Cancer 2025;11:e68516
doi: 10.2196/68516
PMID: 40324958
```

```
Liu D, Hu X, Xiao C, Bai J, Barandouzi ZA, Lee S, Webster C, Brock LU, Lee L, Bold D, Lin Y
Evaluation of Large Language Models in Tailoring Educational Content for Cancer Survivors and Their Caregivers: Quality Analysis
JMIR Cancer 2025;11:e67914
doi: 10.2196/67914
PMID: 40192716
PMCID: 11995809
```

---

## 📬 Contact

- **Maintainer**: Darren Liu ([@ImNotDarren](https://github.com/ImNotDarren))
- **Email**: darren.liu@emory.edu
- **Project Link**: [https://github.com/ImNotDarren/CRCWeb](https://github.com/ImNotDarren/CRCWeb)