import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prisma";

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorised", { status: 401 });
		}

		const body = await req.json();
		const { name } = body;

		if (!name) {
			return new NextResponse("Name Is Required", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID Is Required", { status: 400 });
		}
		const store = await prismadb.store.update({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});
		return NextResponse.json(store);
	} catch (error) {
		console.log("[STORE_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorised", { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse("Store ID Is Required", { status: 400 });
		}
		// Maybe delete many
		const store = await prismadb.store.delete({
			where: {
				id: params.storeId,
				userId,
			},
		});
		return NextResponse.json(store);
	} catch (error) {
		console.log("[STORE_DELETE]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
