"use client";

import { useState } from "react";
import { Billboard } from "@prisma/client";
import { Trash2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
	initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
	initialData,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	// Strings
	const title = initialData ? "Edit Billboard" : "Create Billboard";
	const description = initialData ? "Edit a Billboard" : "Add a Billboard";
	const toastMessage = initialData
		? "Billboard Updated"
		: "Billboard Created";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/billboards/${params.billboardId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/billboards`, data);
			}
			router.refresh();
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Something Went Wrong :-(");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/billboards/${params.billboardId}`
			);
			router.refresh();
			toast.success("Billboard Deleted");
			router.push("/");
		} catch (error) {
			toast.error(
				"Something Went Wrong :-( prolly delete all categories using this first"
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</div>

			<Separator />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Billboard Label"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={loading}
						className="ml-auto"
						type="submit"
					>
						{action}
					</Button>
				</form>
			</Form>

			<Separator />
			{/* <ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="public"
			/> */}
		</>
	);
};
