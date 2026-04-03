import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from "react-native";
import type { StudentStop } from "../types/transport";
import { Image } from "react-native";
interface Props {
  students: StudentStop[];
  vanPosition: { latitude: number; longitude: number };
  onMarcarFalta: (id: string) => void;
  onBack: () => void;
  onOpenProfile: () => void;
  etaMinutes: number;
}

export function ParentScreen({
  students,
  vanPosition,
  onMarcarFalta,
  onBack,
  onOpenProfile,
  etaMinutes,
}: Props) {
  const orderedStudents = [...students].sort((a, b) => a.ordem - b.ordem);
  const mainStudent = orderedStudents[0];
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerTitle}>Olá, responsável</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe a rota da van em tempo real
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenProfile} style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>
        <ImageBackground
          source={{
            uri: "https://images.pexels.com/photos/28022177/pexels-photo-28022177.jpeg?auto=compress&cs=tinysrgb&w=1200",
          }}
          style={styles.mapImage}
          imageStyle={styles.mapImageInner}
        >
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayTitle}>Rota ilustrativa</Text>
            <Text style={styles.mapOverlaySubtitle}>
              Mapa de exemplo com visual.
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.parentBottomSheet}>
        <Text style={styles.sectionTitle}>Status de hoje</Text>
        {mainStudent && (
          <>
            <Text style={styles.currentStudentName}>{mainStudent.nome}</Text>
            <Text style={styles.currentStudentInfo}>
              Chegada em aproximadamente {etaMinutes} min
            </Text>
          </>
        )}

        <View style={styles.parentActionsRow}>
          {mainStudent && mainStudent.status !== "ausente" ? (
            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={() => onMarcarFalta(mainStudent.id)}
            >
              <Text style={styles.secondaryActionLabel}>Marcar falta hoje</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.infoText}>
              Falta de hoje já registrada. A rota do motorista será ajustada.
            </Text>
          )}
        </View>

        <FlatList
          data={orderedStudents}
          keyExtractor={(item) => item.id}
          style={styles.studentList}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <View>
                <Text style={styles.studentName}>{item.nome}</Text>
                <Text style={styles.studentSub}>{`Parada ${item.ordem}`}</Text>
              </View>
              <View style={styles.badge}>
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
  mapWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  mapImage: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  mapImageInner: {
    borderRadius: 24,
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
  parentBottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24 + 12,
    backgroundColor: "rgba(5,5,9,0.96)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  parentActionsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FFC857",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionLabel: {
    color: "#FFC857",
    fontSize: 15,
    fontWeight: "600",
  },
  infoText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  studentList: {
    marginTop: 16,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
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
  badgeText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
});

