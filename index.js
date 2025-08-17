// src/createProject.js
import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function createProject(options) {
  const { name, framework, packages, components } = options;

  console.log(`🚀 Setting up ${framework} project: ${name}...`);

  try {
    if (framework === "expo") {
      execSync(`npx create-expo-app ${name}`, { stdio: "inherit" });
    } else if (framework === "cli") {
      await runReactNativeInit(name);
    }

    process.chdir(name);

    // Install additional packages
    if (packages.length > 0) {
      console.log(`📦 Installing extra packages: ${packages.join(", ")}...`);
      execSync(`npm install ${packages.join(" ")}`, { stdio: "inherit" });
    }

    // Add folder structure
    setupFolders();

    // Add useful components
    addComponents(components);

    console.log(`✅ Project ${name} setup complete!`);
    console.log(`👉 cd ${name} && npx expo start (or react-native run-android/ios)`);
  } catch (error) {
    console.error("❌ Error setting up project:", error.message);
  }
}

function runReactNativeInit(name) {
  return new Promise((resolve, reject) => {
    console.log("📂 Running React Native CLI init... (this may take a few mins)");

    const child = spawn("npx", ["react-native", "init", name], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`react-native init failed with code ${code}`));
    });
  });
}

function setupFolders() {
  const dirs = ["src/components", "src/screens", "src/hooks", "src/utils"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function addComponents(components) {
  if (components.includes("button")) {
    fs.writeFileSync(
      "src/components/CustomButton.js",
      `
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  text: { color: "#fff", fontWeight: "bold" }
});
`
    );
  }
}
