import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Role } from "../types/transport";
import { Image } from "react-native";

interface Props {
  onSelectRole: (role: Role) => void;
}
export function RoleSelectionScreen({ onSelectRole }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.roleContainer}>
        
        <View style={styles.logoRow}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.logo}>VansMind</Text>
        </View>

        <Text style={styles.subtitle}>
          Gestão segura e moderna do transporte escolar.
        </Text>

        <View style={styles.roleButtonsRow}>
          <TouchableOpacity
            style={[styles.roleButton, styles.roleButtonPrimary]}
            onPress={() => onSelectRole("driver")}
          >
            <Text style={styles.roleButtonLabel}>Sou motorista</Text>
            <Text style={styles.roleButtonHint}>Rotas, alunos e confirmações</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, styles.roleButtonSecondary]}
            onPress={() => onSelectRole("parent")}
          >
            <Text style={styles.roleButtonLabel}>Sou responsável</Text>
            <Text style={styles.roleButtonHint}>Acompanhar rota e avisar faltas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050509",
  },
  roleContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    fontSize: 36,
    color: "#FFC857",
    fontWeight: "700",
    marginLeft: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 10
  },
  subtitle: {
    color: "#C0C4D0",
    fontSize: 16,
    marginBottom: 32,
  },
  roleButtonsRow: {
    gap: 16,
  },
  roleButton: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  roleButtonPrimary: {
    backgroundColor: "#101018",
  },
  roleButtonSecondary: {
    backgroundColor: "#050509",
  },
  roleButtonLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  roleButtonHint: {
    color: "#9CA3AF",
    marginTop: 4,
    fontSize: 13,
  },
});

