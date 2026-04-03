import React, { useMemo, useState, useEffect } from "react";
import type { Role, StudentStop } from "./types/transport";
import { VAN_START, STUDENT_STOPS } from "./constants/map";
import { RoleSelectionScreen } from "./screens/RoleSelectionScreen";
import { DriverScreen } from "./screens/DriverScreen";
import { ParentScreen } from "./screens/ParentScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

type Screen = "roleSelection" | "driver" | "parent" | "profile";

export default function App() {
  const [screen, setScreen] = useState<Screen>("roleSelection");
  const [role, setRole] = useState<Role | null>(null);
  const [students, setStudents] = useState<StudentStop[]>(STUDENT_STOPS);
  const [vanPosition] = useState(VAN_START);
  const [etaMinutes, setEtaMinutes] = useState(5);

  const orderedStudents = useMemo(  
    () => [...students].sort((a, b) => a.ordem - b.ordem),
    [students]
  );

  const currentStudent = useMemo(
    () => orderedStudents.find((s) => s.status === "a_buscar") ?? null,
    [orderedStudents]
  );

  useEffect(() => {
    if (!currentStudent) {
      setEtaMinutes(0);
      return;
    }
    setEtaMinutes(5);
    const id = setInterval(() => {
      setEtaMinutes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60_000);
    return () => clearInterval(id);
  }, [currentStudent?.id]);

  function handleSelectRole(selectedRole: Role) {
    setRole(selectedRole);
    setScreen(selectedRole === "driver" ? "driver" : "parent");
  }

  function handleBackToRoleSelection() {
    setRole(null);
    setScreen("roleSelection");
  }

  function handleOpenProfile() {
    setScreen("profile");
  }

  function handleCloseProfile() {
    if (role === "driver") {
      setScreen("driver");
    } else {
      setScreen("parent");
    }
  }

  function handleConfirmEmbarque() {
    if (!currentStudent) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id ? { ...s, status: "embarcado" } : s
      )
    );
  }

  function handleMarcarFalta(id: string) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "ausente" } : s))
    );
  }

  if (screen === "roleSelection") {
    return <RoleSelectionScreen onSelectRole={handleSelectRole} />;
  }

  if (screen === "driver") {
    return (
      <DriverScreen
        students={students}
        currentStudent={currentStudent ?? undefined}
        vanPosition={vanPosition}
        etaMinutes={etaMinutes}
        onConfirmEmbarque={handleConfirmEmbarque}
        onBack={handleBackToRoleSelection}
        onOpenProfile={handleOpenProfile}
      />
    );
  }

  if (screen === "parent") {
    return (
      <ParentScreen
        students={students}
        vanPosition={vanPosition}
        onMarcarFalta={handleMarcarFalta}
        onBack={handleBackToRoleSelection}
        onOpenProfile={handleOpenProfile}
        etaMinutes={etaMinutes}
      />
    );
  }

  return (
    <ProfileScreen
      role={role}
      students={students}
      onBack={handleCloseProfile}
    />
  );
}

