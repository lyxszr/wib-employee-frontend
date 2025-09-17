import { Outlet } from "react-router-dom"
import { useApiClientSetup } from "../hooks/shared/useApiClient"

const ApiPersistWrapper = () => {
    const { initialized } = useApiClientSetup()

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">initializing...</p>
              </div>
            </div>
        )
    }

    if (children) {
        return children
    }

    return <Outlet />
}

export default ApiPersistWrapper