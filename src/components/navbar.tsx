import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prisma";
import { Separator } from "./ui/separator";

const Navbar = async () => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const stores = await prismadb.store.findMany({
		where: {
			userId,
		},
	});

	return (
		<div className="border-b">
			<div className="flex h-16 items-center px-4">
				<h1 className=" font-extrabold text-5xl italic tracking-tight">
					Gamma
					<span className="text-sm font-mono"> v.0</span>
				</h1>
				<Separator orientation="vertical" className="mx-6" />
				<StoreSwitcher items={stores} />
				<MainNav className="mx-6" />
				<div className="ml-auto flex items-center space-x-4">
					<UserButton afterSignOutUrl="/" />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
