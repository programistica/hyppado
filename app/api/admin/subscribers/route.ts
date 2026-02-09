import { NextResponse } from "next/server";
import type { Subscriber } from "@/lib/types/admin";

/**
 * GET /api/admin/subscribers
 * Returns subscriber list. If NEXT_PUBLIC_ADMIN_MOCKS is true, returns mock data.
 * Query param: status=active|canceled (optional filter)
 */
export async function GET(request: Request) {
  const isMockMode = process.env.NEXT_PUBLIC_ADMIN_MOCKS === "true";

  if (!isMockMode) {
    // No mock mode - return empty array
    return NextResponse.json([]);
  }

  // Parse status filter from URL
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status")?.toUpperCase();

  // Mock subscriber data - deterministic
  const mockSubscribers: Subscriber[] = [
    // 9 Active subscribers
    {
      id: "sub_001",
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "5511999001001",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-01T10:00:00Z",
    },
    {
      id: "sub_002",
      name: "João Santos",
      email: "joao.santos@email.com",
      phone: "5511999002002",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-03T14:30:00Z",
    },
    {
      id: "sub_003",
      name: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      phone: null, // No phone
      status: "ACTIVE",
      lastPaymentAt: "2026-01-28T09:15:00Z",
    },
    {
      id: "sub_004",
      name: "Pedro Costa",
      email: "pedro.costa@email.com",
      phone: "5521988004004",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-05T16:45:00Z",
    },
    {
      id: "sub_005",
      name: "Carla Ferreira",
      email: "carla.ferreira@email.com",
      phone: null, // No phone
      status: "ACTIVE",
      lastPaymentAt: "2026-01-30T11:20:00Z",
    },
    {
      id: "sub_006",
      name: "Lucas Almeida",
      email: "lucas.almeida@email.com",
      phone: "5531977006006",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-04T08:00:00Z",
    },
    {
      id: "sub_007",
      name: "Juliana Lima",
      email: "juliana.lima@email.com",
      phone: "5541966007007",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-02T13:10:00Z",
    },
    {
      id: "sub_008",
      name: "Rafael Souza",
      email: "rafael.souza@email.com",
      phone: null, // No phone
      status: "ACTIVE",
      lastPaymentAt: "2026-01-29T17:30:00Z",
    },
    {
      id: "sub_009",
      name: "Fernanda Rocha",
      email: "fernanda.rocha@email.com",
      phone: "5551955009009",
      status: "ACTIVE",
      lastPaymentAt: "2026-02-06T10:45:00Z",
    },
    // 3 Canceled subscribers
    {
      id: "sub_010",
      name: "Bruno Martins",
      email: "bruno.martins@email.com",
      phone: "5561944010010",
      status: "CANCELED",
      lastPaymentAt: "2026-01-15T12:00:00Z",
    },
    {
      id: "sub_011",
      name: "Patrícia Gomes",
      email: "patricia.gomes@email.com",
      phone: null, // No phone
      status: "CANCELED",
      lastPaymentAt: "2026-01-10T09:30:00Z",
    },
    {
      id: "sub_012",
      name: "Thiago Ribeiro",
      email: "thiago.ribeiro@email.com",
      phone: "5571933012012",
      status: "CANCELED",
      lastPaymentAt: "2026-01-20T15:15:00Z",
    },
  ];

  // Filter by status if provided
  let filtered = mockSubscribers;
  if (statusFilter === "ACTIVE" || statusFilter === "CANCELED") {
    filtered = mockSubscribers.filter((s) => s.status === statusFilter);
  }

  return NextResponse.json(filtered);
}
