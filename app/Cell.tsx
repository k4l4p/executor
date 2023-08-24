import { AbiFunction } from "abitype"
import React, { ReactNode, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Abi } from "viem"
import { useContractRead } from "wagmi"
import {
	prepareWriteContract,
	readContract,
	writeContract,
} from "wagmi/actions"
import Toggle from "./Toggle"

type CellType = {
	info: AbiFunction
	address: `0x${string}`
}

const Cell = ({ info, address }: CellType) => {
	const [isOpen, setIsOpen] = useState(false)
	const [errorMsg, setErrorMsg] = useState<null | string>(null)
	const [returnValue, setReturnValue] = useState<unknown>(null)

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<Record<string, string | boolean>>({
		defaultValues: info.inputs.reduce((aggr, curr, idx) => ({...aggr, [idx]: curr.type === 'bool'? false : ''}), {}),
	})
	const onSubmit: SubmitHandler<Record<string, string | boolean>> = async (
		data
	) => {
		setErrorMsg(null)
		setReturnValue(null)
		try {
			if (
				info.stateMutability === "payable" ||
				info.stateMutability === "nonpayable"
			) {
				const { request, result } = await prepareWriteContract({
					address,
					abi: [info],
					functionName: info.name as never,
					args: Object.values(data),
				})

				const { hash } = await writeContract(request)
				setReturnValue(`Trx hash: ${hash}`)
			} else {
				const ret = await readContract({
					address: address,
					abi: [info],
					functionName: info.name as never,
					args: Object.values(data),
				})
				setReturnValue((ret as any).toString())
			}
		} catch (err) {
			if (err instanceof Error) {
				setErrorMsg(err.message)
			}
			console.log(err)
		}
	}

	return (
		<li
			key={info.name}
			className="hover:bg-white/10 transition-colors py-5 flex flex-col gap-5 px-6"
		>
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
			<div className={isOpen ? "flex flex-col gap-2" : "hidden"}>
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
								<Controller
									name={idx.toString()}
									control={control}
									render={({ field }) => (
										<Toggle
											setEnabled={(e) => field.onChange(e)}
											enabled={field.value as boolean}
										/>
									)}
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
				<div
					className={
						"overflow-hidden bg-red-900 shadow sm:rounded-lg " +
						(errorMsg !== null ? "block" : "hidden")
					}
				>
					<div className="flex flex-col gap-3 px-4 py-5 sm:p-6">
						<h3>Error:</h3>
						<p className="break-all">{errorMsg}</p>
					</div>
				</div>
				<div
					className={
						"overflow-hidden bg-indigo-950 shadow sm:rounded-lg " +
						(returnValue !== null ? "block" : "hidden")
					}
				>
					<div className="flex flex-col gap-3 px-4 py-5 sm:p-6">
						<h3>Result:</h3>
						<p>{returnValue as ReactNode}</p>
					</div>
				</div>
			</div>
		</li>
	)
}

export default Cell
