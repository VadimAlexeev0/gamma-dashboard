import prismadb from "@/lib/prisma";

const BillboardPage = async ({
	params,
}: {
	params: { billboardId: string };
}) => {
	const billboard = prismadb.billboard.findUnique({
		where: {
			id: params.billboardId,
		},
	});

	return <div>Billboard Create</div>;
};

export default BillboardPage;
