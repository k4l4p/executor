import { AbiFunction } from "abitype"
import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { writeContract } from "wagmi/actions"

type CellType = {
	info: AbiFunction
  address: `0x${string}`
}

const Cell = ({ info }: CellType) => {
	const [isOpen, setIsOpen] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Record<string, string>>()
	const onSubmit: SubmitHandler<Record<string, string>> = async (data) =>
		{
      const { hash } = await writeContract({
        address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
        abi: [info],
        functionName: info.name as never,
        args: [69],
      })
    }

	return (
		<li key={info.name} className="py-5 flex flex-col gap-5">
			<div
				onClick={() => {
					setIsOpen(!isOpen)
				}}
				className="flex justify-between gap-x-6 cursor-pointer"
			>
				<div className="flex min-w-0 gap-x-4">
					<div className="min-w-0 flex-auto">
						<p className="text-sm font-semibold leading-6 text-white">
							{info.name}
						</p>
						<p className="mt-1 truncate text-xs leading-5 text-gray-400">
							{info.stateMutability}
						</p>
					</div>
				</div>
			</div>
			<div className={isOpen ? "block" : "hidden"}>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
					{info.inputs.map((i, idx) => (
						<React.Fragment key={idx}>
							{i.name && <h5 className="text-sm text-indigo-300">{i.name}</h5>}
							{i.type.includes("uint") ? (
								<input
									{...register(idx.toString())}
									type="text"
									className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="uint"
								/>
							) : i.type.includes("string") ? (
								<input
									{...register(idx.toString())}
									type="text"
									className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="string"
								/>
							) : i.type.includes("address") ? (
								<input
									{...register(idx.toString())}
									type="text"
									className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="address"
								/>
							) : i.type.includes("bool") ? (
								<input
									{...register(idx.toString())}
									type="text"
									className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="true / false"
								/>
							) : i.type.includes("bytes") ? (
								<input
									{...register(idx.toString())}
									type="text"
									className="bg-transparent block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="bytes"
								/>
							) : (
								<></>
							)}
						</React.Fragment>
					))}
					<button
						type="submit"
						className="self-end rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
					>
						Submit
					</button>
				</form>
			</div>
		</li>
	)
}

export default Cell
