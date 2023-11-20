import prismadb from "@/lib/prisma";

interface DashboardPageProps {
	params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
	const store = await prismadb.store.findUnique({
		where: {
			id: params.storeId,
		},
	});

	return <div>Selected Store: {store?.name}</div>;
};

export default DashboardPage;
