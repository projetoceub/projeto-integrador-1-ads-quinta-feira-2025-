# Documentação Técnica - Vansmind: Sistema de Transporte Escolar Inteligente

## 1. Visão Geral do Projeto

- Rotas otimizadas com recálculo dinâmico
- Rastreamento GPS em tempo real via Firebase
- Check-in/check-out automatizado com geofencing
- Backend Node.js + PostgreSQL para histórico e analytics

**Stack Técnica**:
- **Frontend**: React Native (Expo), TypeScript, React Navigation
- **Real-time**: Firebase Realtime Database/Firestore
- **Backend**: Node.js (Express), PostgreSQL
- **Mapas**: Google Maps API / Mapbox
- **Autenticação**: Firebase Auth / JWT

## 2. Arquitetura de Telas (User Flows)

### Fluxo Motorista (Driver)
```
RoleSelectionScreen → DriverScreen → ProfileScreen (opcional)
                          ↓
                    Confirma Embarque (geofencing trigger)
                          ↓
                    Próxima Parada (auto-scroll lista)
                          ↓
                    Rota Concluída → Dashboard Histórico
```

**Telas Detalhadas**:
1. **DriverScreen** (existente - expandir):
   - Header: Rota atual, #alunos, Perfil
   - Mapa fullscreen com overlay 'Em Navegação'
   - BottomSheet fixo: 
     - 'Próxima parada' (nome aluno + ETA + ordem)
     - Botão primário AMARLO grande: 'Confirmar embarque' (toque deslize)
     - Chips horizontais: Lista alunos com status colorido
   - **Hands-free**: Voz 'Chegando João - confirme embarque'

2. **RouteActiveScreen** (nova):
   - Navegação turn-by-turn (Google Maps Directions API)
   - ETA dinâmico + alertas sonoros
   - Geofencing 50m: Auto-pausa + confirmação

3. **AttendanceListScreen** (nova):
   - Lista vertical scrollable com checkboxes
   - QR Code scan para embarque rápido
   - Export PDF fim de rota

### Fluxo Responsável (Parent)
```
RoleSelectionScreen → ParentScreen → ProfileScreen (opcional)
                          ↓
                    Notificação Push 'Van a 5min'
                          ↓
                    Check-out manual ou auto (geofencing)
```

**Telas Detalhadas**:
1. **ParentScreen** (existente - expandir):
   - Header: 'Olá, responsável' + Perfil
   - Mapa fullscreen com van + aluno pins
   - BottomSheet: 
     - Aluno principal + ETA
     - Botão 'Marcar falta' (laranja)
     - Lista completa com badges status
   - **Push**: 'Maria embarcada ✅'

2. **RealTimeMapScreen** (nova):
   - Mapa interativo com polyline rota
   - Van marker animado (Firebase RTDB)
   - Histórico 7 dias swipe

3. **CheckoutScreen** (nova):
   - Confirmação visual + foto embarque
   - Avaliação rápida (1-5 estrelas)

**RoleSelectionScreen** : Login roles + logo Vansmind

## 3. Requisitos Funcionais (RFs)

### RF01: Autenticação Segura
- Login biometria/FaceID por role
- Motorista: PIN 4 dígitos + van_id
- Responsável: +1 aluno vinculado

### RF02: Rastreamento Tempo Real
```
Firebase RTDB Structure:
vans/{vanId}/location → {lat, lng, heading, timestamp, driverId}
vans/{vanId}/route/active → {routeId, students: [], eta: 12min}
```

### RF03: Geofencing Inteligente
- Raio 50m cada parada → pausa auto + vibração + voz
- Alerta 2min antes chegada

### RF04: Recálculo Rota Dinâmico (obrigatório)
```
Se aluno X falta:
1. Remover parada X da sequence
2. Reordenar pontos restantes (algoritmo nearest neighbor)
3. Push todos responsáveis 'Rota ajustada +3min'
4. Salvar historical_adjustment PostgreSQL
```

### RF05: Check-in/out Automatizado
```
Status flow: a_buscar → embarcado (geofencing+confirm) → chegou (escola)
Edge-case: ausente → auto após 2min timeout
```

### RF06: Histórico & Relatórios
- PDF : Horários, faltas, km rodados
- Analytics: % ocupação, tempo médio/parada

## 4. Modelagem de Dados (PostgreSQL Schema)

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role ENUM('driver', 'parent') NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  firebase_uid VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vans 
CREATE TABLE vans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(10) UNIQUE NOT NULL,
  capacity INTEGER NOT NULL,
  driver_id UUID REFERENCES users(id),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true
);

--(alunos)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES users(id),
  photo_url TEXT,
  school_grade VARCHAR(20),
  regular_stop JSONB -- {home: {lat,lng}, school: {lat,lng}}
);

-- (rotas planejadas)
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  van_id UUID REFERENCES vans(id),
  name VARCHAR(100), -- 'Manhã Escola Central'
  date DATE NOT NULL,
  direction ENUM('to_school', 'from_school'),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- (pontos otimizados)
CREATE TABLE route_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id),
  stop_order INTEGER NOT NULL,
  location GEOGRAPHY(POINT) NOT NULL, -- PostGIS
  estimated_time TIMESTAMP,
  actual_arrival TIMESTAMP
);

--  (registros embarque)
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_point_id UUID REFERENCES route_points(id),
  status ENUM('a_buscar', 'embarcado', 'chegou', 'ausente') NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  confirmed_by UUID REFERENCES users(id), --motorista
  geofence_trigger BOOLEAN DEFAULT false,
  notes TEXT -- 'Falta justificada'
);

-- Indexes performance
CREATE INDEX idx_route_points_route ON route_points(route_id);
CREATE INDEX idx_attendance_route_point ON attendance_logs(route_point_id);
CREATE INDEX idx_van_location USING GIST(location) ON vans USING GIN(location);
```

**Relacionamentos**:
```
users 1:N vans (driver)
users 1:N students (parent)  
vans 1:N routes
routes 1:N route_points
students 1:N route_points
route_points 1:N attendance_logs
```

## 5. Regras de Negócio Críticas

### RN01: Offline Motorista
```
1. Perde internet → Salva localmente (AsyncStorage):
   {embarques: [{studentId, timestamp, gps_local}]}
2. Reconecta → Sync Firebase + PostgreSQL
3. Responsáveis veem 'Sinal fraco' no mapa
4. Timeout 5min → Alerta escola 'Van offline'
```

### RN02: Recálculo Rota (Cancelamento 10min antes)
```
Input: Aluno#3 falta
Algoritmo:
1. route_points ORDER BY stop_order REMOVE #3
2. Reordenar restantes por distance_matrix API (Google Directions)
3. UPDATE route.active_points JSONB
4. Push @driver: 'Rota recalculada +4min'
5. Push @affected_parents: 'João faltou, rota +2min sua casa'
```

### RN03: Geofencing Security
```
raio_chegada = 50m
raio_embarque = 30m (timeout 120s)
if GPS_spoofing_detected (speed>80kmh OU jump>500m): 
  alert_admin + disable_van
```

### RN04: Validações Motorista
```
- Não pode marcar 'embarcado' se não geofence
- Máx 2min/parada (exceto ausente)
- Após 18h: Bloqueia 'to_school'
```

## 6. Sugestão Interface (UI/UX Driver-Focused)

### Princípios Design:
```
1. ZERO DISTRAÇÃO: Botões 44x44px (Apple HIG), contraste 7:1
2. Modo Noturno AUTOMÁTICO (lux<50)
3. Voz ATIVA: 'Chegando Maria' / 'Embarque confirmado'
4. Tela 85% Mapa, 15% controles
```

### DriverScreen Mockup:
```
┌─────────────────────────────┐
│ ◀ Rota Manhã (5 alunos)  👤 │ ← Header fixo 10%
├─────────────────────────────┤
│        🗺️ MAPA 85%           │
│        Van 🔴 → Aluno 🟢     │
│        Polyline otimizada    │
│        Compass + Speed 42kmh │
└─────────────────────────────┘
│ PRÓXIMA: João #3 · 2min ↓    │ ← BottomSheet 15%
│ [ deslize CONFIRMAR 👆 ] ← 100w x 60h AMARULO
│ [Pedro✓] [Ana○] [João◯] →    │ ← Chips scroll
└─────────────────────────────┘
```

**Cores Semânticas**:
- Verde #16A34A: Embarcado✅
- Laranja #F59E0B: A_buscar ⭕
- Vermelho #DC2626: Ausente ❌
- Amarelo #FACC15: Ações primárias

**Acessibilidade**:
```
- VoiceOver labels em TODOS elementos
- Dynamic Type (texto escala)
- Vibration patterns distintos
- Reduced Motion support
```



