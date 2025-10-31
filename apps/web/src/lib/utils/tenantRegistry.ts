export interface TenantDescriptor {
  slug: string;
  name: string;
  description: string;
  isDemo?: boolean;
}

export const tenantRegistry: TenantDescriptor[] = [
  {
    slug: "weber",
    name: "Weber GmbH",
    description: "Produktiver Mandant mit voller Bearbeitung",
    isDemo: false
  },
  {
    slug: "tryout",
    name: "Tryout",
    description: "Lesender Demo-Zugang für Präsentationen",
    isDemo: true
  }
];
