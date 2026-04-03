import type { StudentStop } from "../types/transport";

type SimpleRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const VAN_START = {
  latitude: -23.561684,
  longitude: -46.625378,
};

export const STUDENT_STOPS: StudentStop[] = [
  {
    id: "1",
    nome: "Ana paula",
    status: "a_buscar",
    latitude: -23.559,
    longitude: -46.63,
    ordem: 1,
  },
  {
    id: "2",
    nome: "João souza",
    status: "a_buscar",
    latitude: -23.563,
    longitude: -46.62,
    ordem: 2,
  },
  {
    id: "3",
    nome: "Pedro Silva",
    status: "a_buscar",
    latitude: -23.566,
    longitude: -46.627,
    ordem: 3,
  },
];

export const INITIAL_REGION: SimpleRegion = {
  ...VAN_START,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1F2933" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#E5E7EB" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#052E16" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1F2933" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4B5563" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },
] as const;

