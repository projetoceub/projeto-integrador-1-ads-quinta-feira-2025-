import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from "react-native";
import type { StudentStop } from "../types/transport";

interface Props {
  students: StudentStop[];
  currentStudent: StudentStop | undefined;
  vanPosition: { latitude: number; longitude: number };
  onConfirmEmbarque: () => void;
  etaMinutes: number;
  onBack: () => void;
  onOpenProfile: () => void;
}

export function DriverScreen({
  students,
  currentStudent,
  vanPosition,
  onConfirmEmbarque,
  etaMinutes,
  onBack,
  onOpenProfile,
}: Props) {
  const orderedStudents = [...students].sort((a, b) => a.ordem - b.ordem);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Rota manhã - Escola Central</Text>
          <Text style={styles.headerSubtitle}>
            {students.length} alunos · rota otimizada
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenProfile} style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapWindowContainer}>
        <ImageBackground
          source={require("../../assets/map.png")}
          resizeMode="cover"
          style={styles.mapBackground}
        >
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayTitle}>VansMind</Text>
            <Text style={styles.mapOverlaySubtitle}>Em Navegação</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.driverBottomSheet}>
        <Text style={styles.sectionTitle}>Próxima parada</Text>
        {currentStudent ? (
          <>
            <Text style={styles.currentStudentName}>{currentStudent.nome}</Text>
            <Text style={styles.currentStudentInfo}>
              Aproximadamente {etaMinutes} min · Parada {currentStudent.ordem}
            </Text>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={onConfirmEmbarque}
            >
              <Text style={styles.primaryActionLabel}>
                Deslize / toque para confirmar embarque
              </Text>
            </TouchableOpacity>

            <FlatList
              horizontal
              data={orderedStudents}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              style={styles.studentList}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.studentChip,
                    item.id === currentStudent.id && styles.studentChipCurrent,
                  ]}
                >
                  <Text style={styles.studentChipName}>{item.nome}</Text>
                  <Text style={styles.studentChipStatus}>
                    {item.status === "a_buscar" && "A buscar"}
                    {item.status === "embarcado" && "Embarcado"}
                    {item.status === "chegou" && "Chegou"}
                    {item.status === "ausente" && "Ausente"}
                  </Text>
                </View>
              )}
            />
          </>
        ) : (
          <Text style={styles.emptyText}>Rota concluída.</Text>
        )}
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
    paddingBottom: 16,
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
  headerTextWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },
  profileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
  },
  profileButtonText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  mapWindowContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  mapBackground: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  mapOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: 16,
  },
  mapOverlayTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  mapOverlaySubtitle: {
    color: "#E5E7EB",
    fontSize: 12,
    marginTop: 4,
  },
  driverBottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    backgroundColor: "rgba(5,5,9,0.96)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  currentStudentName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  currentStudentInfo: {
    color: "#C0C4D0",
    fontSize: 14,
    marginTop: 2,
    marginBottom: 12,
  },
  primaryActionButton: {
    backgroundColor: "#FFC857",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  primaryActionLabel: {
    color: "#1B1B24",
    fontSize: 15,
    fontWeight: "700",
  },
  studentList: {
    marginTop: 4,
  },
  studentChip: {
    backgroundColor: "#101018",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  studentChipCurrent: {
    borderWidth: 1,
    borderColor: "#FFC857",
  },
  studentChipName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  studentChipStatus: {
    color: "#A1A1AA",
    fontSize: 11,
    marginTop: 2,
  },
  emptyText: {
    color: "#A1A1AA",
    fontSize: 14,
  },
});