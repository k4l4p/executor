import { Switch } from "@headlessui/react"
import React, { useState } from "react"

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ")
}

const Toggle = ({
	enabled,
	setEnabled,
}: {
	enabled: boolean
	setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	return (
    <div className="flex gap-2">
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={classNames(
				enabled ? "bg-indigo-300" : "bg-gray-600",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
			)}
		>
			<span
				aria-hidden="true"
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			/>
		</Switch>
    <h5 className="text-sm text-gray-300">{enabled ? 'true' : 'false'}</h5>
    </div>
	)
}

export default Toggle
