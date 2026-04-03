import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import type { Role, StudentStop } from "../types/transport";

interface Props {
  role: Role | null;
  students: StudentStop[];
  onBack: () => void;
}

export function ProfileScreen({ role, students, onBack }: Props) {
  const orderedStudents = [...students].sort((a, b) => a.ordem - b.ordem);

  const userName = role === "driver" ? "Carlos Motorista" : "Maria souza";
  const roleLabel = role === "driver" ? "Motorista" : "Responsável";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{userName[0]}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.roleLabel}>{roleLabel} VansMind</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da rota</Text>
          <Text style={styles.cardItem}>
            • Alunos na rota: <Text style={styles.cardHighlight}>{students.length}</Text>
          </Text>
          <Text style={styles.cardItem}>
            • Embarcados:{" "}
            <Text style={styles.cardHighlight}>
              {students.filter((s) => s.status === "embarcado").length}
            </Text>
          </Text>
          <Text style={styles.cardItem}>
            • Ausentes:{" "}
            <Text style={styles.cardHighlight}>
              {students.filter((s) => s.status === "ausente").length}
            </Text>
          </Text>
        </View>

        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Alunos da rota</Text>
          <Text style={styles.listHeaderSubtitle}>Status em tempo real</Text>
        </View>

        <FlatList
          data={orderedStudents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.studentList}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <View>
                <Text style={styles.studentName}>{item.nome}</Text>
                <Text style={styles.studentSub}>{`Parada ${item.ordem}`}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.status === "embarcado" && styles.badgeSuccess,
                  item.status === "ausente" && styles.badgeDanger,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.status === "a_buscar" && "A buscar"}
                  {item.status === "embarcado" && "Embarcado"}
                  {item.status === "chegou" && "Chegou"}
                  {item.status === "ausente" && "Ausente"}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050509",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#E5E7EB",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  avatarInitials: {
    color: "#FACC15",
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 12,
  },
  roleLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0B1120",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 20,
  },
  cardTitle: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardItem: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  cardHighlight: {
    color: "#FACC15",
    fontWeight: "600",
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listHeaderTitle: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "600",
  },
  listHeaderSubtitle: {
    color: "#6B7280",
    fontSize: 12,
  },
  studentList: {
    paddingBottom: 24,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1F2937",
  },
  studentName: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "500",
  },
  studentSub: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  badgeSuccess: {
    backgroundColor: "#16A34A33",
  },
  badgeDanger: {
    backgroundColor: "#DC262633",
  },
  badgeText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
});

