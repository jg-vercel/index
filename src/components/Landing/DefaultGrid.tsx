import {useNotionPages} from "../../reactQuery/NotionAPI.ts";

type GridProps={
}

export const DefaultGrid = () => {
    const {data}=useNotionPages();
    return (
        <div
            className="bg-gray-100 border-r border-b border-gray-300 flex flex-col justify-center items-center overflow-hidden">
            <div className="text-center max-w-md px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Title</h2>
                <div className="space-y-4">
                    <DefaultGridItem/>
                    <DefaultGridItem/>
                </div>
            </div>
        </div>
    )
}

export const DefaultGridItem = () => {
    return (
        <div>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-semibold underline text-lg">
                subTitle
            </a>
            <p className="text-gray-600 mt-2">description</p>
        </div>
    )
}