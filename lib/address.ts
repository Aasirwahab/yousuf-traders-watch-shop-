import "server-only";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

export type AddressView = {
  id: string;
  name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal: string;
  country: string;
  isDefault: boolean;
};

export type AddressInput = {
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal: string;
  country: string;
  isDefault?: boolean;
};

function toView(row: {
  id: string;
  name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal: string;
  country: string;
  isDefault: boolean;
}): AddressView {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    state: row.state,
    postal: row.postal,
    country: row.country,
    isDefault: row.isDefault,
  };
}

/** Saved addresses for the signed-in user, default first. Empty for guests. */
export async function getUserAddresses(): Promise<AddressView[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const rows = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return rows.map(toView);
}

export async function createAddress(input: AddressInput): Promise<AddressView[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const existingCount = await prisma.address.count({ where: { userId: user.id } });
  // First address is always the default; otherwise honour the requested flag.
  const makeDefault = existingCount === 0 || Boolean(input.isDefault);

  if (makeDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: user.id,
      name: input.name,
      phone: input.phone || null,
      line1: input.line1,
      line2: input.line2 || null,
      city: input.city,
      state: input.state || null,
      postal: input.postal,
      country: input.country,
      isDefault: makeDefault,
    },
  });

  return getUserAddresses();
}

export async function updateAddress(id: string, input: AddressInput): Promise<AddressView[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  // Scope by userId so a user can only edit their own addresses.
  const owned = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!owned) return getUserAddresses();

  if (input.isDefault && !owned.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  await prisma.address.update({
    where: { id: owned.id },
    data: {
      name: input.name,
      phone: input.phone || null,
      line1: input.line1,
      line2: input.line2 || null,
      city: input.city,
      state: input.state || null,
      postal: input.postal,
      country: input.country,
      // Never clear the default flag here — removing default is implicit when
      // another address is set as default. Keeps at least one default present.
      isDefault: owned.isDefault || Boolean(input.isDefault),
    },
  });

  return getUserAddresses();
}

export async function deleteAddress(id: string): Promise<AddressView[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const owned = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!owned) return getUserAddresses();

  await prisma.address.delete({ where: { id: owned.id } });

  // If we removed the default, promote the next remaining address.
  if (owned.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return getUserAddresses();
}

export async function setDefaultAddress(id: string): Promise<AddressView[]> {
  const user = await getOrCreateUser();
  if (!user) return [];

  const owned = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!owned) return getUserAddresses();

  await prisma.address.updateMany({
    where: { userId: user.id, isDefault: true },
    data: { isDefault: false },
  });
  await prisma.address.update({ where: { id: owned.id }, data: { isDefault: true } });

  return getUserAddresses();
}
