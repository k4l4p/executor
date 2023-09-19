import { useEffect, RefObject } from "react"

const useCtrlKFocus = <T extends HTMLElement>(ref: RefObject<T>) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "k") {
				event.preventDefault()
				ref.current?.focus()
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [ref])
}

export default useCtrlKFocus
